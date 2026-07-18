"use server";

import { revalidatePath } from "next/cache";
import { requireOperador } from "@/lib/operador-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Acciones del panel de operador (Fase 2, modo concierge).
 *
 * Cada acción replica lo que en modo automático hace la máquina
 * (dispatcher / webhook), pero con el fundador como transporte del
 * mensaje. La base de datos queda idéntica en ambos modos: esa es
 * la condición para que conectar Meta (Fase 3) sea solo un interruptor.
 */

async function db() {
  await requireOperador();
  const client = supabaseAdmin();
  if (!client) throw new Error("Supabase sin configurar");
  return client;
}

/** El operador ha copiado y enviado un mensaje del guion por WhatsApp. */
export async function marcarEnviado(formData: FormData) {
  const client = await db();
  const scheduledId = Number(formData.get("scheduled_id"));

  const { data: row } = await client
    .from("v_guion_de_hoy")
    .select("*")
    .eq("scheduled_id", scheduledId)
    .maybeSingle();
  if (!row) return; // ya procesado en otra pestaña

  await client.from("scheduled_messages").update({ status: "sent" }).eq("id", scheduledId);
  await client.from("messages").insert({
    user_id: row.user_id,
    direction: "out",
    body: row.body,
    status: "sent",
  });
  if (row.exercise_code) {
    await client
      .from("user_exercises")
      .update({ sent_at: new Date().toISOString() })
      .eq("user_id", row.user_id)
      .eq("scheduled_for", new Date().toISOString().slice(0, 10))
      .is("sent_at", null);
  }
  await client.from("events").insert({
    user_id: row.user_id,
    type: "message.sent_manual",
    payload: { scheduled_id: scheduledId, template: row.template_code },
  });

  revalidatePath("/operador");
}

/** Registrar la respuesta del usuario al momento de hoy. */
export async function registrarResultado(formData: FormData) {
  const client = await db();
  const id = Number(formData.get("user_exercise_id"));
  const result = String(formData.get("result")); // done | done_easier | done_harder | struggled | skipped

  const { data: ue } = await client
    .from("user_exercises")
    .select("id, user_id, result")
    .eq("id", id)
    .single();
  if (!ue || ue.result !== "pending") return;

  await client
    .from("user_exercises")
    .update({
      result,
      responded_at: result === "skipped" ? null : new Date().toISOString(),
      evaluated_by: "human",
    })
    .eq("id", id);

  await client.from("events").insert({
    user_id: ue.user_id,
    type: "exercise.evaluated",
    payload: { user_exercise_id: id, result, by: "human" },
  });

  // Respuesta de vuelta (celebración o sin culpa) → se encola y aparece
  // en el guion para que el operador la copie. "skipped" no genera
  // respuesta: la marca no persigue a quien hoy no ha podido.
  if (result !== "skipped") {
    const templateCode = result === "struggled" ? "sin_culpa" : "celebracion";
    const { data: user } = await client
      .from("users")
      .select("care_days_total")
      .eq("id", ue.user_id)
      .single();
    const { data: tpl } = await client
      .from("message_templates")
      .select("id")
      .eq("code", templateCode)
      .single();
    await client.from("scheduled_messages").upsert(
      {
        user_id: ue.user_id,
        template_id: tpl?.id,
        payload: { dias: String(user?.care_days_total ?? "") },
        due_at: new Date().toISOString(),
        idempotency_key: `feedback:${ue.user_id}:${id}`,
      },
      { onConflict: "idempotency_key", ignoreDuplicates: true },
    );
  }

  revalidatePath("/operador");
}

/** Onboarding: registrar las respuestas del cuestionario y asignar nivel. */
export async function completarOnboarding(formData: FormData) {
  const client = await db();
  const userId = String(formData.get("user_id"));
  const p1 = Number(formData.get("p1"));
  const p2 = Number(formData.get("p2"));
  const p3 = Number(formData.get("p3"));
  const flagCaidas = formData.get("flag_caidas") === "on";
  const flagMedico = formData.get("flag_medico") === "on";

  // Puntuación del Método (§5): suma 0-6; el flag de caídas resta un punto
  // (colocación conservadora). Ante la duda, siempre el nivel inferior.
  const score = Math.max(0, p1 + p2 + p3 - (flagCaidas ? 1 : 0));

  const { data: user } = await client
    .from("users")
    .select("journey_status")
    .eq("id", userId)
    .single();
  if (!user) return;

  if (user.journey_status === "pendiente_onboarding") {
    await client.rpc("fn_transition_journey", {
      p_user: userId,
      p_to: "en_analisis",
      p_reason: "cuestionario recibido (operador)",
    });
  }
  await client.rpc("fn_assign_initial_level", { p_user: userId, p_score: score });
  await client.rpc("fn_transition_journey", {
    p_user: userId,
    p_to: "activo",
    p_reason: "onboarding completado (operador)",
  });
  await client.from("events").insert({
    user_id: userId,
    type: "onboarding.completed",
    payload: { p1, p2, p3, flag_caidas: flagCaidas, flag_medico: flagMedico, score },
  });
  if (flagMedico) {
    await client.from("alerts").insert({
      user_id: userId,
      type: "flag_medico",
      severity: "media",
      payload: { nota: "Indicó limitación médica en el cuestionario" },
    });
  }

  revalidatePath("/operador");
}

/** Dar por resuelta una alerta. */
export async function resolverAlerta(formData: FormData) {
  const client = await db();
  const id = Number(formData.get("alert_id"));
  await client
    .from("alerts")
    .update({ status: "resuelta", resolved_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/operador");
}
