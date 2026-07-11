import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Pago no completado — ${site.name}`,
  robots: { index: false },
};

/**
 * Página de pago cancelado (o fallido).
 *
 * Coherente con la marca: cero culpa, cero presión. La puerta queda
 * abierta y hay un camino de vuelta claro. También recibe aquí quien
 * sufrió un error técnico durante el pago, así que el texto cubre
 * ambos casos sin dramatismo.
 */
export default function CanceladoPage() {
  return (
    <>
      <Header />
      <main id="contenido" className="py-16 lg:py-24">
        <Container className="max-w-2xl">
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-tinta sm:text-5xl">
            No pasa nada.
          </h1>

          <div className="mt-6 space-y-4 text-xl leading-relaxed text-tinta-suave">
            <p>
              La suscripción no se ha completado y{" "}
              <strong className="text-tinta">no se te ha cobrado nada</strong>.
            </p>
            <p>
              Si ha sido un despiste, un error o simplemente no era el
              momento, aquí no hay prisa. Puedes volver a intentarlo cuando
              quieras: tres minutos al día seguirán siendo suficientes mañana,
              y pasado también.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <LinkButton href="/#precio">Volver a intentarlo</LinkButton>
            <LinkButton href="/" variant="secondary">
              Volver al inicio
            </LinkButton>
          </div>

          <p className="mt-10 text-lg leading-relaxed text-tinta-suave">
            ¿Te has quedado con alguna duda antes de decidirte? Escríbenos a{" "}
            <a
              href={`mailto:${site.contactEmail}`}
              className="font-medium text-salvia-800 underline underline-offset-4"
            >
              {site.contactEmail}
            </a>{" "}
            y te la resolvemos sin compromiso.
          </p>
        </Container>
      </main>
      <Footer />
    </>
  );
}
