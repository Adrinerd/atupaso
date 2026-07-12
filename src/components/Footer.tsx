import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

/**
 * Pie de página sobrio: marca, contacto y enlaces legales.
 * Nada que distraiga del objetivo de la landing.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-tinta/10 bg-crema py-12">
      <Container className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <p className="font-display text-2xl font-semibold text-salvia-900">
            {site.name}
            <span className="text-terracota-700">.</span>
          </p>
          <p className="mt-2 text-base leading-relaxed text-tinta-suave">
            Tres minutos al día para volver a moverte. Hecho con calma en
            España.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-base">
          <a
            href={`mailto:${site.contactEmail}`}
            className="text-salvia-800 underline underline-offset-4 hover:text-salvia-900"
          >
            {site.contactEmail}
          </a>
          <a
            href="/aviso-legal"
            className="text-tinta-suave underline underline-offset-4 hover:text-tinta"
          >
            Aviso legal
          </a>
          <a
            href="/privacidad"
            className="text-tinta-suave underline underline-offset-4 hover:text-tinta"
          >
            Política de privacidad
          </a>
        </div>
      </Container>

      <Container className="mt-10">
        <p className="text-sm text-tinta-suave">
          © {year} {site.name}. Todos los derechos reservados.
        </p>
      </Container>
    </footer>
  );
}
