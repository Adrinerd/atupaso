import type { Metadata } from "next";
import Stripe from "stripe";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { IconCheck, IconHoja, IconMensaje } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Bienvenido — ${site.name}`,
  robots: { index: false },
};

/**
 * Página de gracias (destino del pago completado en Stripe).
 *
 * Además de confirmar, prepara a la persona para lo que viene:
 * las preguntas iniciales para conocer su punto de partida y el
 * primer mensaje de mañana. Si la sesión de Stripe es válida,
 * personalizamos con el teléfono/correo reales del pago.
 */

type CustomerDetails = {
  phone: string | null;
  email: string | null;
};

/** Recupera los datos del pago; si algo falla, la página funciona igual. */
async function getCustomerDetails(
  sessionId: string | undefined,
): Promise<CustomerDetails | null> {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!sessionId || !secretKey) return null;

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.status !== "complete") return null;
    return {
      phone: session.customer_details?.phone ?? null,
      email: session.customer_details?.email ?? null,
    };
  } catch {
    // Sesión inexistente o caducada: mostramos la versión genérica.
    return null;
  }
}

const nextSteps = [
  {
    icon: IconMensaje,
    text: "En un momento te escribiremos por WhatsApp con unas pocas preguntas sencillas, para conocer tu punto de partida.",
  },
  {
    icon: IconHoja,
    text: "Mañana por la mañana te llegará tu primer momento de hoy: unos tres minutos, a tu ritmo.",
  },
  {
    icon: IconCheck,
    text: "Si es un regalo, avisa a esa persona de que le va a escribir alguien con buenas intenciones.",
  },
];

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const customer = await getCustomerDetails(session_id);

  return (
    <>
      <Header />
      <main id="contenido" className="py-16 lg:py-24">
        <Container className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-salvia-100 px-4 py-2 text-base font-medium text-salvia-800">
            <IconCheck className="size-5" />
            Suscripción completada
          </p>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight text-tinta sm:text-5xl">
            Ya está. Así de fácil.
          </h1>

          <p className="mt-6 text-xl leading-relaxed text-tinta-suave">
            Bienvenido a {site.name}. Acabas de hacer algo importante: empezar.
            {customer?.phone && (
              <>
                {" "}
                Te escribiremos al{" "}
                <strong className="text-tinta">{customer.phone}</strong>.
              </>
            )}
            {customer?.email && (
              <>
                {" "}
                El recibo llegará a{" "}
                <strong className="text-tinta">{customer.email}</strong>.
              </>
            )}
          </p>

          <h2 className="mt-12 font-display text-2xl font-semibold text-tinta">
            Qué va a pasar ahora
          </h2>
          <ul className="mt-6 space-y-5">
            {nextSteps.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-4">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-terracota-100 text-terracota-700">
                  <Icon className="size-5" />
                </span>
                <p className="text-lg leading-relaxed text-tinta">{text}</p>
              </li>
            ))}
          </ul>

          <div className="mt-12 rounded-3xl bg-crema-claro p-8 shadow-suave">
            <p className="text-lg leading-relaxed text-tinta-suave">
              ¿Alguna duda, o algún dato que quieras corregir? Escríbenos a{" "}
              <a
                href={`mailto:${site.contactEmail}`}
                className="font-medium text-salvia-800 underline underline-offset-4"
              >
                {site.contactEmail}
              </a>{" "}
              y te respondemos en persona.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
