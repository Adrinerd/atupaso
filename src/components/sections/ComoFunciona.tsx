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
    title: "Te suscribes y nos cuentas tu punto de partida",
    description:
      "Dos minutos, desde este mismo teléfono. Nos dejas tu número de WhatsApp y respondes a unas pocas preguntas sencillas, para empezar donde estás tú.",
  },
  {
    number: "2",
    title: "Recibes tu momento de hoy",
    description:
      "Cada mañana, un mensaje con una pequeña acción adaptada a tu punto de partida, explicada con calma y paso a paso. Y según te vaya resultando, la vamos ajustando.",
  },
  {
    number: "3",
    title: "Lo haces a tu ritmo",
    description:
      "Cuando te venga bien: en la cocina, en el salón, en pijama. Cada acción trae una versión más suave y otra un poco más viva. Tú decides cada día hasta dónde.",
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

        {/* El contador de días: aquí los días solo suman, nunca se ponen a cero.
            Es la anti-racha: la mecánica de constancia de A Tu Paso no castiga
            los días de la vida real (médicos, nietos, achaques). */}
        <div className="mt-14 grid items-center gap-10 rounded-[2rem] bg-crema-claro p-8 shadow-suave sm:p-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex justify-center">
            <div className="w-full max-w-xs rounded-2xl rounded-bl-md bg-salvia-100 px-6 py-5 shadow-suave">
              <p className="text-lg leading-relaxed text-tinta">
                Ya llevas <strong className="text-salvia-900">24 días</strong>{" "}
                cuidándote 🌱
              </p>
              <p className="mt-1 text-right text-sm text-tinta-suave" aria-hidden="true">
                9:03
              </p>
            </div>
          </div>
          <div>
            <h3 className="font-display text-3xl font-semibold leading-snug text-tinta">
              Aquí los días solo suman.{" "}
              <span className="text-terracota-700">Ninguno resta.</span>
            </h3>
            <p className="mt-4 text-lg leading-relaxed text-tinta-suave">
              Cada día que haces tu momento, tu cuenta crece. ¿Que hoy no puede
              ser? No pasa nada: tu cuenta no baja ni se pone a cero. Se queda
              en 24, esperándote, y cuando vuelves sigue en 25.
            </p>
            <p className="mt-3 text-lg leading-relaxed text-tinta">
              Sin cadenas que se rompen. Sin volver a empezar. Nunca.
            </p>
          </div>
        </div>

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
