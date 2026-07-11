import { Container } from "@/components/ui/Container";
import { IconCheck } from "@/components/icons";

/**
 * "Cómo funciona": tres pasos, muy visuales.
 *
 * Los números grandes en Fraunces hacen de ilustración: no necesitamos
 * iconografía tecnológica. La banda inferior desactiva la objeción
 * principal de este público: "yo no me aclaro con las aplicaciones".
 */
const steps = [
  {
    number: "1",
    title: "Te suscribes",
    description:
      "Dos minutos, desde este mismo teléfono. Nos dejas tu número de WhatsApp (o el de la persona a la que quieres cuidar) y listo.",
  },
  {
    number: "2",
    title: "Recibes tu momento de hoy",
    description:
      "Cada mañana te llega un mensaje con una pequeña acción para tu cuerpo, explicada con calma y paso a paso. Cada día, una distinta.",
  },
  {
    number: "3",
    title: "Lo haces a tu ritmo",
    description:
      "Cuando te venga bien: en la cocina, en el salón, en pijama. Sin horarios, sin equipamiento y sin nadie vigilando.",
  },
];

const reassurances = [
  "Sin aplicaciones que instalar",
  "Sin contraseñas que recordar",
  "Solo WhatsApp, el que ya usas cada día",
];

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="py-20 lg:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-tinta sm:text-[2.75rem]">
            Tan sencillo como leer un mensaje
          </h2>
          <p className="mt-5 text-xl leading-relaxed text-tinta-suave">
            Porque eso es, exactamente, todo lo que hay que hacer.
          </p>
        </div>

        <ol className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <li
              key={step.number}
              className="rounded-3xl bg-crema-claro p-8 shadow-suave"
            >
              <p
                aria-hidden="true"
                className="font-display text-6xl font-semibold leading-none text-terracota-500"
              >
                {step.number}
              </p>
              <h3 className="mt-5 font-display text-2xl font-semibold text-tinta">
                {step.title}
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-tinta-suave">
                {step.description}
              </p>
            </li>
          ))}
        </ol>

        {/* Desactivar la objeción tecnológica, en una sola línea visual */}
        <ul className="mt-10 flex flex-col gap-4 rounded-3xl bg-salvia-100 px-8 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          {reassurances.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <IconCheck className="size-5 shrink-0 text-salvia-800" />
              <span className="text-lg font-medium text-salvia-900">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
