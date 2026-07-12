import { WhatsAppPreview } from "@/components/WhatsAppPreview";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

/**
 * Hero: la promesa de la marca, sin rodeos.
 *
 * Titular = la promesa literal de A Tu Paso. El subtítulo explica el
 * qué y el cómo en dos frases. Un solo botón, que lleva al precio
 * (donde está el formulario de suscripción real).
 */
export function Hero() {
  return (
    <section id="inicio" className="overflow-hidden pb-20 pt-14 sm:pt-20 lg:pb-28">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div className="max-w-2xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-salvia-100 px-4 py-2 text-base font-medium text-salvia-800">
              Un mensaje al día · Tres minutos · Nada más
            </p>

            <h1 className="font-display text-[2.6rem] font-semibold leading-[1.12] tracking-tight text-tinta sm:text-[3.25rem] lg:text-[3.6rem]">
              No necesitas cambiar tu vida.{" "}
              <em className="not-italic text-terracota-700">
                Solo tres minutos hoy.
              </em>
            </h1>

            <p className="mt-6 max-w-xl text-xl leading-relaxed text-tinta-suave">
              Cada mañana recibes en tu WhatsApp un pequeño momento para tu
              cuerpo: moverte un poco, respirar hondo, ganar soltura. Sin
              gimnasios, sin aplicaciones y sin nadie metiéndote prisa.
            </p>

            <div className="mt-9">
              <LinkButton href="#precio" className="w-full sm:w-auto">
                Quiero empezar hoy
              </LinkButton>
              <p className="mt-4 text-base text-tinta-suave">
                {site.price.amountDisplay} al mes · Sin permanencia · Cancelas
                cuando quieras
              </p>
            </div>
          </div>

          {/* El producto, tal cual: el mensaje que llega cada mañana */}
          <div className="relative flex justify-center lg:justify-end">
            <div
              aria-hidden="true"
              className="absolute -top-10 right-1/2 size-[26rem] translate-x-1/2 rounded-full bg-salvia-100/70 blur-2xl lg:right-0 lg:translate-x-16"
            />
            <div className="relative">
              <WhatsAppPreview />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
