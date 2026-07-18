import { emitEvent, getConfig, serviceClient } from "../_shared/db.ts";
import {
  isWindowOpen,
  META_PARAM_ORDER,
  renderBody,
  sendTemplate,
  sendText,
} from "../_shared/wa.ts";

/**
 * Dispatcher: la ÚNICA puerta de salida de mensajes.
 *
 * pg_cron lo invoca cada minuto. Reclama los mensajes vencidos de la
 * cola (scheduled_messages) con SKIP LOCKED —varios workers pueden
 * correr en paralelo sin duplicar—, decide texto libre o plantilla
 * según la ventana de 24 h de Meta, envía, y deja registro en
 * messages + events.
 *
 * Reintentos: 3 intentos con vuelta a 'pending'; después, 'failed'.
 */
const MAX_ATTEMPTS = 3;

Deno.serve(async () => {
  const db = serviceClient();

  // Fase 2 (modo concierge): el canal es manual. El guion del día lo
  // muestra el panel /operador y el fundador envía desde su WhatsApp.
  // Los mensajes quedan 'pending' a propósito: son la cola del panel.
  const channelMode = await getConfig<string>(db, "channel_mode");
  if (channelMode !== "meta") {
    return Response.json({ mode: "manual", note: "Envío automático desactivado; usar /operador" });
  }

  const phoneNumberId = await getConfig<string>(db, "wa_phone_number_id");
  if (!phoneNumberId || phoneNumberId.startsWith("CAMBIAR")) {
    return Response.json({ error: "wa_phone_number_id sin configurar en app_config" }, { status: 503 });
  }

  const { data: claimed, error } = await db.rpc("fn_claim_scheduled_messages", { p_batch: 50 });
  if (error) return Response.json({ error: error.message }, { status: 500 });

  let sent = 0, failed = 0;

  for (const sm of claimed ?? []) {
    try {
      // Datos necesarios para componer y enviar
      const { data: user } = await db
        .from("users")
        .select("id, full_name, whatsapp_e164, last_inbound_at, care_days_total, deleted_at")
        .eq("id", sm.user_id)
        .single();

      if (!user || user.deleted_at) {
        await db.from("scheduled_messages").update({ status: "cancelled" }).eq("id", sm.id);
        continue;
      }

      const { data: template } = sm.template_id
        ? await db.from("message_templates").select("*").eq("id", sm.template_id).single()
        : { data: null };

      const { data: exercise } = sm.exercise_id
        ? await db.from("exercises").select("*").eq("id", sm.exercise_id).single()
        : { data: null };

      // Variables disponibles para el cuerpo del mensaje
      const vars: Record<string, string> = {
        nombre: (sm.payload?.nombre as string) || user.full_name?.split(" ")[0] || "",
        dias: String(sm.payload?.dias ?? user.care_days_total),
        ejercicio: exercise?.message_body ?? "",
        variante_facil: exercise?.easier_variant ?? "",
        variante_viva: exercise?.harder_variant ?? "",
        ...(sm.payload ?? {}),
      };

      const body = renderBody(template?.body ?? (sm.payload?.body as string) ?? "", vars);
      if (!body) throw new Error("Mensaje sin cuerpo: ni plantilla ni payload.body");

      // Ventana de 24 h: texto libre (gratis) o plantilla de Meta (de pago)
      let waMessageId: string;
      if (isWindowOpen(user.last_inbound_at)) {
        ({ waMessageId } = await sendText(phoneNumberId, user.whatsapp_e164, body));
      } else if (template?.meta_template) {
        const order = META_PARAM_ORDER[template.meta_template] ?? [];
        ({ waMessageId } = await sendTemplate(
          phoneNumberId,
          user.whatsapp_e164,
          template.meta_template,
          order.map((k) => vars[k] ?? ""),
        ));
      } else {
        throw new Error("Fuera de ventana de 24 h y la plantilla no tiene versión aprobada en Meta");
      }

      // Registro: cola → enviado, historial de mensajes, momento marcado
      await db.from("scheduled_messages").update({ status: "sent" }).eq("id", sm.id);
      await db.from("messages").insert({
        user_id: user.id,
        direction: "out",
        wa_message_id: waMessageId,
        template_id: sm.template_id,
        body,
        status: "sent",
      });
      if (sm.exercise_id) {
        await db.from("user_exercises")
          .update({ sent_at: new Date().toISOString() })
          .eq("user_id", user.id)
          .eq("exercise_id", sm.exercise_id)
          .is("sent_at", null);
      }
      await emitEvent(db, user.id, "message.sent", { scheduled_id: sm.id, wa_message_id: waMessageId });
      sent++;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const exhausted = sm.attempts >= MAX_ATTEMPTS;
      await db.from("scheduled_messages").update({
        status: exhausted ? "failed" : "pending",
        last_error: message,
        // backoff sencillo: reintento en 5 minutos
        ...(exhausted ? {} : { due_at: new Date(Date.now() + 5 * 60_000).toISOString() }),
      }).eq("id", sm.id);
      if (exhausted) {
        await db.from("alerts").insert({
          user_id: sm.user_id,
          type: "envio_fallido",
          severity: "media",
          payload: { scheduled_id: sm.id, error: message },
        });
      }
      failed++;
    }
  }

  return Response.json({ claimed: claimed?.length ?? 0, sent, failed });
});
