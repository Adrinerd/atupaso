import { IconCheck } from "@/components/icons";
import { Container } from "@/components/ui/Container";

/**
 * "¿Es esto para ti?": el espejo.
 *
 * Primero la identificación (frases que la persona podría haber dicho
 * con sus propias palabras), después la esperanza. Aquí se gana o se
 * pierde la confianza: cero culpa, cero exigencia.
 */
const statements = [
  "Hace años que no haces ejercicio y no sabes por dónde empezar.",
  "Te cuesta más que antes agacharte, subir escaleras o levantarte del sofá.",
  "Has probado gimnasios o aplicaciones… y lo dejaste a las pocas semanas.",
  "Sientes que todo lo que hay por ahí está pensado para gente más joven.",
];

export function EsParaTi() {
  return (
    <section id="para-ti" className="bg-crema-claro py-20 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-tinta sm:text-[2.75rem]">
              ¿Te suena alguna de estas frases?
            </h2>
            <ul className="mt-10 space-y-6">
              {statements.map((statement) => (
                <li key={statement} className="flex items-start gap-4">
                  <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-salvia-100 text-salvia-800">
                    <IconCheck className="size-4.5" />
                  </span>
                  <p className="text-xl leading-relaxed text-tinta">
                    {statement}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* La respuesta: alivio, no exigencia */}
          <div className="flex items-center">
            <div className="rounded-3xl bg-salvia-800 p-8 shadow-tarjeta sm:p-12">
              <p className="font-display text-3xl font-medium leading-snug text-crema sm:text-[2.1rem]">
                Entonces esto está hecho para ti.
              </p>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-salvia-100">
                <p>
                  No llegas tarde. Tu cuerpo no te ha abandonado: solo necesita
                  que vuelvas a contar con él, un poquito cada día.
                </p>
                <p>
                  Sin «todo o nada». Sin empezar el lunes. Sin apuntarte a
                  nada que te dé pereza.
                </p>
                <p className="font-medium text-crema">
                  Empezando hoy, con tres minutos. A tu paso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
