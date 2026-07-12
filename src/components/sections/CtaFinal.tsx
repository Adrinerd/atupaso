import { CheckoutForm } from "@/components/CheckoutForm";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

/**
 * CTA final: se repite la promesa y se abre la puerta.
 *
 * Aquí el formulario de suscripción está directamente en el botón:
 * quien ha llegado hasta abajo no necesita volver a subir al precio.
 */
export function CtaFinal() {
  return (
    <section id="empezar" className="bg-salvia-900 py-20 lg:py-28">
      <Container className="text-center">
        <h2 className="mx-auto max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-crema sm:text-[3rem]">
          Tu cuerpo no te pide una vida nueva.{" "}
          <em className="not-italic text-terracota-300">
            Te pide tres minutos hoy.
          </em>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-xl leading-relaxed text-salvia-200">
          Mañana por la mañana puede estar esperándote tu primer mensaje.
        </p>

        <CheckoutForm
          label={`Empezar hoy por ${site.price.display}`}
          variant="onDark"
          className="mt-10 flex justify-center"
        />

        <p className="mt-5 text-base text-salvia-200">
          Sin permanencia. Cancelas cuando quieras.
        </p>
      </Container>
    </section>
  );
}
