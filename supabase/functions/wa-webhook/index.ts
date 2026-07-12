import { claimWebhookEvent, emitEvent, serviceClient } from "../_shared/db.ts";

/**
 * Webhook de WhatsApp (Meta Cloud API): todo lo que entra.
 *
 * - GET: verificación del webhook (handshake de Meta).
 * - POST: mensajes entrantes y actualizaciones de estado de entrega.
 *
 * Responsabilidades (Fase 1):
 *   1. Registrar todo mensaje entrante (la BD es la fuente de verdad).
 *   2. Mantener last_inbound_at (gobierna la ventana de 24 h).
 *   3. Si el usuario estaba inactivo/en recuperación/dormido → reactivarlo.
 *   4. Evaluación por reglas del momento del día (el jsonb `evaluation`
 *      del ejercicio) + respuesta de celebración o sin culpa.
 *   5. Menciones de salud → alerta para intervención humana. La IA (Fase 3)
 *      se añadirá detrás de este mismo webhook, nunca en su lugar.
 */

const HEALTH_KEYWORDS = [
  "dolor", "duele", "mareo", "mareada", "mareado", "caida", "caída",
  "me cai", "me caí", "hospital", "medicacion", "medicación", "medico", "médico",
  "pecho", "ahogo", "urgencias",
];

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function matchResult(
  text: string,
  evaluation: Record<string, string[]>,
): string | null {
  const t = normalize(text);
  // 'struggled' primero: "me costó pero hecho" debe contar la dificultad
  for (const result of ["struggled", "done_easier", "done_harder", "done"]) {
    if ((evaluation[result] ?? []).some((kw) => t.includes(kw))) return result;
  }
  return null;
}

Deno.serve(async (req) => {
  // ---------- Verificación del webhook (solo en el alta en Meta) ----------
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    if (mode === "subscribe" && token === Deno.env.get("WA_VERIFY_TOKEN")) {
      return new Response(url.searchParams.get("hub.challenge") ?? "", { status: 200 });
    }
    return new Response("forbidden", { status: 403 });
  }

  const db = serviceClient();
  const payload = await req.json();

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value ?? {};

      // ---------- Estados de entrega de mensajes salientes ----------
      for (const status of value.statuses ?? []) {
        await db.from("messages")
          .update({ status: status.status }) // sent | delivered | read | failed
          .eq("wa_message_id", status.id);
      }

      // ---------- Mensajes entrantes ----------
      for (const msg of value.messages ?? []) {
        if (!(await claimWebhookEvent(db, "meta", msg.id))) continue; // duplicado

        const phone = `+${msg.from}`;
        const text: string = msg.text?.body ?? msg.button?.text ?? "";

        const { data: user } = await db.from("users")
          .select("id, journey_status, care_days_total")
          .eq("whatsapp_e164", phone)
          .is("deleted_at", null)
          .maybeSingle();

        if (!user) {
          await emitEvent(db, null, "wa.inbound_unknown", { from: phone, text });
          continue;
        }

        // 1-2. Registrar y reabrir la ventana de 24 h
        await db.from("messages").insert({
          user_id: user.id,
          direction: "in",
          wa_message_id: msg.id,
          body: text,
          status: "received",
        });
        await db.from("users")
          .update({ last_inbound_at: new Date().toISOString() })
          .eq("id", user.id);
        await emitEvent(db, user.id, "wa.inbound", { text });

        // 3. Quien responde, vuelve: sin sermones, solo alegría
        if (["inactivo", "en_recuperacion", "dormido"].includes(user.journey_status)) {
          await db.rpc("fn_transition_journey", {
            p_user: user.id, p_to: "activo", p_reason: "respondió por WhatsApp",
          });
          await db.from("scheduled_messages").upsert({
            user_id: user.id,
            template_id: (await db.from("message_templates").select("id").eq("code", "reactivacion").single()).data?.id,
            payload: { dias: String(user.care_days_total) },
            due_at: new Date().toISOString(),
            idempotency_key: `reactivation:${user.id}:${msg.id}`,
          }, { onConflict: "idempotency_key", ignoreDuplicates: true });
        }

        // 5. Salud: siempre humano, nunca automático
        if (HEALTH_KEYWORDS.some((kw) => normalize(text).includes(kw))) {
          await db.from("alerts").insert({
            user_id: user.id,
            type: "mencion_salud",
            severity: "alta",
            payload: { text },
          });
        }

        // 4. Evaluación por reglas del momento de hoy
        const { data: pending } = await db.from("user_exercises")
          .select("id, exercise_id, exercises(evaluation, on_success, on_failure)")
          .eq("user_id", user.id)
          .eq("scheduled_for", new Date().toISOString().slice(0, 10))
          .eq("result", "pending")
          .maybeSingle();

        if (pending && text) {
          const exercise = pending.exercises as unknown as {
            evaluation: Record<string, string[]>;
            on_success: { template?: string };
            on_failure: { template?: string };
          };
          const result = matchResult(text, exercise.evaluation ?? {});
          if (result) {
            await db.from("user_exercises").update({
              result,
              response_text: text,
              responded_at: new Date().toISOString(),
              evaluated_by: "rule",
            }).eq("id", pending.id);

            // Respuesta según on_success / on_failure del ejercicio
            const templateCode = result === "struggled"
              ? exercise.on_failure?.template ?? "sin_culpa"
              : exercise.on_success?.template ?? "celebracion";
            const { data: tpl } = await db.from("message_templates")
              .select("id").eq("code", templateCode).single();

            // El contador lo actualiza el trigger; +1 si acaba de completar
            const dias = result === "struggled"
              ? user.care_days_total
              : user.care_days_total + 1;

            await db.from("scheduled_messages").upsert({
              user_id: user.id,
              template_id: tpl?.id,
              payload: { dias: String(dias) },
              due_at: new Date().toISOString(),
              idempotency_key: `feedback:${user.id}:${pending.id}`,
            }, { onConflict: "idempotency_key", ignoreDuplicates: true });

            await emitEvent(db, user.id, "exercise.evaluated", {
              user_exercise_id: pending.id, result, by: "rule",
            });
          }
          // Sin match: queda pendiente. En Fase 3, la IA clasificará estos
          // casos; en Fase 1-2 los ves en Metabase (v_usuarios_atencion).
        }
      }
    }
  }

  // Meta exige 200 rápido; cualquier reproceso ya es idempotente.
  return Response.json({ received: true });
});
