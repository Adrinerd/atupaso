import Stripe from "npm:stripe@18";
import { claimWebhookEvent, emitEvent, serviceClient } from "../_shared/db.ts";

/**
 * Webhook de Stripe: la única pieza que escribe subscription_status.
 *
 * W1: checkout.session.completed  → alta de usuario + bienvenida
 * W6: invoice.paid                → registrar pago, reactivar si venía de impago
 * W7: invoice.payment_failed      → impago + mensaje amable + alerta al 3.º fallo
 * W8: customer.subscription.deleted → baja + despedida + cancelar cola
 *
 * Idempotente: cada event.id de Stripe se procesa una sola vez.
 */
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);
const cryptoProvider = Stripe.createSubtleCryptoProvider();

Deno.serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!,
      undefined,
      cryptoProvider,
    );
  } catch (err) {
    return Response.json({ error: `Firma inválida: ${err instanceof Error ? err.message : err}` }, { status: 400 });
  }

  const db = serviceClient();
  if (!(await claimWebhookEvent(db, "stripe", event.id))) {
    return Response.json({ received: true, duplicated: true });
  }

  switch (event.type) {
    // ---------- W1: pago inicial completado ----------
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const details = session.customer_details;

      // Número que RECIBIRÁ los mensajes: el del campo regalo si se rellenó,
      // si no, el teléfono del comprador (validado por Stripe).
      const giftField = session.custom_fields?.find((f) => f.key === "whatsapp_destinatario");
      const giftNumber = giftField?.text?.value?.replace(/[\s.-]/g, "") || null;
      const isGift = Boolean(giftNumber);
      const whatsapp = isGift
        ? (giftNumber!.startsWith("+") ? giftNumber! : `+34${giftNumber}`)
        : details?.phone ?? null;

      if (!whatsapp) {
        await db.from("alerts").insert({
          type: "alta_sin_telefono",
          severity: "alta",
          payload: { session_id: session.id, email: details?.email },
        });
        break;
      }

      // Alta (o re-alta si vuelve tras una baja)
      const { data: existing } = await db.from("users").select("id, journey_status")
        .eq("whatsapp_e164", whatsapp).maybeSingle();

      let userId: string;
      if (existing) {
        userId = existing.id;
        await db.from("users").update({
          subscription_status: "active",
          stripe_customer_id: session.customer as string,
          deleted_at: null,
        }).eq("id", userId);
        if (existing.journey_status === "baja") {
          await db.rpc("fn_transition_journey", {
            p_user: userId, p_to: "pendiente_onboarding", p_reason: "resuscripción",
          });
        }
      } else {
        const { data: created, error } = await db.from("users").insert({
          full_name: isGift ? null : details?.name,
          whatsapp_e164: whatsapp,
          is_gift: isGift,
          buyer_name: details?.name,
          buyer_email: details?.email,
          stripe_customer_id: session.customer as string,
          subscription_status: "active",
          consent_at: new Date().toISOString(),
        }).select("id").single();
        if (error) throw error;
        userId = created.id;
      }

      await db.from("subscriptions").upsert({
        user_id: userId,
        stripe_subscription_id: session.subscription as string,
        status: "active",
      }, { onConflict: "stripe_subscription_id" });

      // Bienvenida (arranca el onboarding); idempotente por clave
      await db.from("scheduled_messages").upsert({
        user_id: userId,
        template_id: (await db.from("message_templates").select("id").eq("code", "bienvenida").single()).data?.id,
        payload: {},
        due_at: new Date().toISOString(),
        idempotency_key: `welcome:${userId}:${session.subscription}`,
      }, { onConflict: "idempotency_key", ignoreDuplicates: true });

      await emitEvent(db, userId, "stripe.checkout_completed", {
        session_id: session.id, is_gift: isGift,
      });
      break;
    }

    // ---------- W6: cobro recurrente correcto ----------
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const { data: user } = await db.from("users").select("id, subscription_status")
        .eq("stripe_customer_id", invoice.customer as string).maybeSingle();
      if (!user) break;

      await db.from("payments").upsert({
        user_id: user.id,
        stripe_invoice_id: invoice.id,
        amount_cents: invoice.amount_paid,
        currency: invoice.currency,
        status: "paid",
        paid_at: new Date().toISOString(),
      }, { onConflict: "stripe_invoice_id", ignoreDuplicates: true });

      if (user.subscription_status === "past_due") {
        await db.from("users").update({ subscription_status: "active" }).eq("id", user.id);
      }
      await emitEvent(db, user.id, "stripe.invoice_paid", { invoice_id: invoice.id });
      break;
    }

    // ---------- W7: cobro fallido ----------
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const { data: user } = await db.from("users").select("id")
        .eq("stripe_customer_id", invoice.customer as string).maybeSingle();
      if (!user) break;

      await db.from("users").update({ subscription_status: "past_due" }).eq("id", user.id);
      await db.from("scheduled_messages").upsert({
        user_id: user.id,
        template_id: (await db.from("message_templates").select("id").eq("code", "pago_fallido").single()).data?.id,
        payload: {},
        due_at: new Date().toISOString(),
        idempotency_key: `dunning:${user.id}:${invoice.id}`,
      }, { onConflict: "idempotency_key", ignoreDuplicates: true });

      if ((invoice.attempt_count ?? 0) >= 3) {
        await db.from("alerts").insert({
          user_id: user.id, type: "pago_fallido_3", severity: "alta",
          payload: { invoice_id: invoice.id },
        });
      }
      await emitEvent(db, user.id, "stripe.invoice_failed", {
        invoice_id: invoice.id, attempt: invoice.attempt_count,
      });
      break;
    }

    // ---------- W8: suscripción cancelada ----------
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const { data: user } = await db.from("users").select("id, care_days_total")
        .eq("stripe_customer_id", sub.customer as string).maybeSingle();
      if (!user) break;

      await db.from("users").update({ subscription_status: "canceled" }).eq("id", user.id);
      await db.from("subscriptions").update({ status: "canceled" })
        .eq("stripe_subscription_id", sub.id);
      await db.rpc("fn_transition_journey", {
        p_user: user.id, p_to: "baja", p_reason: "cancelación en Stripe",
      });
      // Se cancela todo lo pendiente y se despide sin culpa
      await db.from("scheduled_messages").update({ status: "cancelled" })
        .eq("user_id", user.id).eq("status", "pending");
      await db.from("scheduled_messages").upsert({
        user_id: user.id,
        template_id: (await db.from("message_templates").select("id").eq("code", "despedida").single()).data?.id,
        payload: { dias: String(user.care_days_total) },
        due_at: new Date().toISOString(),
        idempotency_key: `goodbye:${user.id}:${sub.id}`,
      }, { onConflict: "idempotency_key", ignoreDuplicates: true });

      await emitEvent(db, user.id, "stripe.subscription_deleted", { subscription_id: sub.id });
      break;
    }

    default:
      // Evento no manejado: registrado y fuera.
      await emitEvent(db, null, "stripe.unhandled", { type: event.type });
  }

  return Response.json({ received: true });
});
