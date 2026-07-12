import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

/**
 * Cabecera mínima: marca + un único botón.
 *
 * La landing tiene un solo objetivo (la suscripción), así que no hay
 * menú de navegación. El botón acompaña siempre, fijo arriba, para que
 * la acción principal quede a un toque en cualquier punto de la página.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-tinta/5 bg-crema/90 backdrop-blur-sm">
      <Container className="flex h-[4.5rem] items-center justify-between">
        <a
          href="#inicio"
          className="font-display text-2xl font-semibold tracking-tight text-salvia-900"
        >
          {site.name}
          <span className="text-terracota-700">.</span>
        </a>
        <LinkButton href="#precio" className="!min-h-12 !px-6 !text-base">
          Empezar hoy
        </LinkButton>
      </Container>
    </header>
  );
}
