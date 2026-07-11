import { faqItems } from "@/content/faq";
import { Container } from "@/components/ui/Container";

/**
 * Preguntas frecuentes: objeciones reales, respondidas con honestidad.
 *
 * Usamos <details>/<summary> nativos: accesibles con teclado y lector
 * de pantalla sin necesidad de JavaScript, y funcionan en cualquier
 * dispositivo, por antiguo que sea.
 */
export function Faq() {
  return (
    <section id="preguntas" className="bg-crema-claro py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-tinta sm:text-[2.75rem]">
            Las dudas de siempre, respondidas sin rodeos
          </h2>

          <div className="mt-12 space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.question}
                className="group rounded-2xl border border-tinta/5 bg-crema px-6 py-2 open:pb-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-xl font-semibold leading-snug text-tinta [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full bg-salvia-100 text-2xl font-normal leading-none text-salvia-800 transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[60ch] text-lg leading-relaxed text-tinta-suave">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
