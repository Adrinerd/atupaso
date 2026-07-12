import { NextResponse } from "next/server";
import Stripe from "stripe";
import { site } from "@/lib/site";

/**
 * Inicio de la suscripción con Stripe Checkout.
 *
 * Los botones "Suscribirme" de la landing envían aquí un POST
 * (formulario HTML clásico, sin JavaScript). Esta ruta crea una
 * sesión de Stripe Checkout en modo suscripción y redirige a la
 * pasarela de pago alojada por Stripe.
 *
 * El número de WhatsApp se captura DURANTE el pago:
 * - `phone_number_collection` pide el teléfono del comprador
 *   (Stripe lo valida y lo guarda en el cliente).
 * - Un campo opcional permite indicar otro número si la
 *   suscripción es un regalo para un padre o una madre.
 *
 * Sin webhooks ni base de datos por ahora: los datos del suscriptor
 * quedan en el panel de Stripe, que es la fuente de verdad.
 */
export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  // Guarda de configuración: mejor un mensaje claro que un error críptico.
  if (!secretKey || !priceId) {
    return NextResponse.json(
      {
        error:
          "Stripe no está configurado. Copia .env.example a .env.local y rellena STRIPE_SECRET_KEY y STRIPE_PRICE_ID.",
      },
      { status: 503 },
    );
  }

  const stripe = new Stripe(secretKey);

  // Base para las URLs de vuelta: el dominio desde el que se envió el
  // formulario (funciona igual en local y en producción).
  const origin = request.headers.get("origin") ?? site.url;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      locale: "es",
      line_items: [{ price: priceId, quantity: 1 }],

      // Teléfono del comprador, validado por Stripe.
      phone_number_collection: { enabled: true },

      // Caso regalo: el WhatsApp que recibirá los mensajes puede no ser
      // el del comprador. Campo opcional, máximo 50 caracteres de etiqueta.
      custom_fields: [
        {
          key: "whatsapp_destinatario",
          label: {
            type: "custom",
            custom: "WhatsApp de quien lo recibirá (si es regalo)",
          },
          type: "text",
          optional: true,
        },
      ],

      success_url: `${origin}/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancelado`,
    });

    if (!session.url) {
      throw new Error("Stripe no devolvió la URL de la sesión de pago");
    }

    // 303: el navegador convierte el POST del formulario en un GET a Stripe.
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("[checkout] No se pudo crear la sesión de Stripe:", error);
    // La página de cancelado tiene un tono amable y un camino de vuelta.
    return NextResponse.redirect(`${origin}/cancelado`, 303);
  }
}
