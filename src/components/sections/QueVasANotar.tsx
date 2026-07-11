import type { ComponentType, SVGProps } from "react";
import {
  IconCorazon,
  IconEscaleras,
  IconHoja,
  IconLuna,
  IconPluma,
  IconSol,
} from "@/components/icons";
import { Container } from "@/components/ui/Container";

/**
 * "Qué vas a notar": beneficios reales, de la vida de verdad.
 *
 * Nunca estética, nunca báscula, nunca promesas milagrosas.
 * Escenas concretas que este público reconoce al instante.
 */
type Benefit = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

const benefits: Benefit[] = [
  {
    icon: IconEscaleras,
    title: "Subir escaleras",
    description: "Llegar arriba sin pararte en el descansillo a recuperar el aliento.",
  },
  {
    icon: IconPluma,
    title: "Moverte con más soltura",
    description: "Agacharte a coger lo que se cae sin pensártelo dos veces.",
  },
  {
    icon: IconLuna,
    title: "Dormir mejor",
    description: "Un cuerpo que se mueve de día descansa mejor de noche.",
  },
  {
    icon: IconSol,
    title: "Más energía",
    description: "Menos pesadez al levantarte y más ganas de salir a la calle.",
  },
  {
    icon: IconCorazon,
    title: "Estar para los tuyos",
    description: "Sentarte en el suelo a jugar con tus nietos… y levantarte después.",
  },
  {
    icon: IconHoja,
    title: "Tranquilidad",
    description: "La calma de saber que hoy, otra vez, te has cuidado un poco.",
  },
];

export function QueVasANotar() {
  return (
    <section id="beneficios" className="bg-crema-claro py-20 lg:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-tinta sm:text-[2.75rem]">
            Qué vas a notar
          </h2>
          <p className="mt-5 text-xl leading-relaxed text-tinta-suave">
            Nada de milagros. Cambios pequeños que se notan donde importa: en
            tu día a día.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="rounded-3xl border border-tinta/5 bg-crema p-8"
            >
              <span className="inline-flex size-13 items-center justify-center rounded-2xl bg-terracota-100 text-terracota-700">
                <Icon className="size-7" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-tinta">
                {title}
              </h3>
              <p className="mt-2 text-lg leading-relaxed text-tinta-suave">
                {description}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
