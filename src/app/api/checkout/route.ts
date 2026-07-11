import { NextResponse } from "next/server";

/**
 * Ruta de suscripción — pendiente de la Fase 2.
 *
 * Los botones "Suscribirme" de la landing ya envían aquí (POST).
 * En la Fase 2, esta ruta creará una sesión de Stripe Checkout
 * (suscripción mensual) y redirigirá a la pasarela de pago.
 *
 * Mantenerla como stub permite tener toda la landing funcional y
 * probada antes de tocar nada de pagos.
 */
export async function POST() {
  return NextResponse.json(
    {
      estado: "pendiente",
      mensaje:
        "El pago se activa en la Fase 2: esta ruta creará la sesión de Stripe Checkout y redirigirá a la pasarela.",
    },
    { status: 503 },
  );
}
