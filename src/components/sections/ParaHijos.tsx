import { IconCheck } from "@/components/icons";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/**
 * "Para hijos e hijas": el segundo comprador.
 *
 * Cambia el tono (habla al hijo/a de 35-55, no a la persona mayor)
 * y cambia el fondo (terracota suave) para marcar el giro de voz.
 * La emoción aquí es cuidar desde la distancia, sin agobiar.
 */
const guarantees = [
  "Funciona en el WhatsApp que ya usan: no tendrás que instalarles nada ni hacer de soporte técnico.",
  "Acciones suaves y seguras, adaptadas a su punto de partida, explicadas con un lenguaje cercano y sin jerga deportiva.",
  "Lo cancelas cuando quieras, sin permanencia ni explicaciones.",
];

export function ParaHijos() {
  return (
    <section id="para-hijos" className="bg-terracota-100 py-20 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <p className="text-lg font-semibold uppercase tracking-wide text-terracota-800">
              Para hijos e hijas
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-tinta sm:text-[2.75rem]">
              ¿Piensas en tu madre o en tu padre mientras lees esto?
            </h2>
            <div className="mt-6 max-w-xl space-y-4 text-xl leading-relaxed text-tinta-suave">
              <p>
                Les llamas. Les dices que salgan a caminar, que se muevan un
                poco. Y te quedas con la sensación de que no basta, porque no
                puedes estar ahí cada mañana.
              </p>
              <p className="text-tinta">
                Nosotros sí. Un mensaje cercano cada día, una acción sencilla y
                segura, y la sensación —suya y tuya— de que alguien les
                acompaña.
              </p>
            </div>
            <div className="mt-9">
              <LinkButton href="#precio" variant="secondary" className="bg-crema/60">
                Regalar A Tu Paso
              </LinkButton>
            </div>
          </div>

          <div className="flex items-center">
            <ul className="w-full space-y-5 rounded-3xl bg-crema p-8 shadow-suave sm:p-10">
              {guarantees.map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-terracota-200 text-terracota-800">
                    <IconCheck className="size-4.5" />
                  </span>
                  <p className="text-lg leading-relaxed text-tinta">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
