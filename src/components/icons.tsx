import type { SVGProps } from "react";

/**
 * Iconografía propia de A Tu Paso.
 *
 * Iconos de trazo, sencillos y cálidos, dibujados a mano para la marca.
 * Nada de mancuernas ni cuerpos: escaleras, luna, sol, hojas, corazones.
 *
 * Todos son decorativos (aria-hidden): el texto que los acompaña
 * es el que transmite el significado.
 */
type IconProps = SVGProps<SVGSVGElement>;

function baseProps(props: IconProps): IconProps {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

/** Hoja: la marca, la calma, lo natural. */
export function IconHoja(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M20 4C11.5 4.5 5 10 4.5 19.5 14 19 19.5 12.5 20 4Z" />
      <path d="M4.5 19.5C8 14.5 12.5 9.5 17 6.5" />
    </svg>
  );
}

/** Escaleras: subir sin pararse en el descansillo. */
export function IconEscaleras(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M3 20h4.5v-4.5H12V11h4.5V6.5H21" />
      <path d="M3 20h18" strokeOpacity="0.35" />
    </svg>
  );
}

/** Pluma: ligereza, agacharse con soltura. */
export function IconPluma(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M20 4c-5.5 0-11 4-12.5 11L5 19.5" />
      <path d="M20 4c.5 5.5-3 11.5-9.5 12.5" />
      <path d="M8.5 13.5 15 7" strokeOpacity="0.5" />
    </svg>
  );
}

/** Luna: dormir mejor. */
export function IconLuna(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

/** Sol: energía al despertar. */
export function IconSol(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
    </svg>
  );
}

/** Corazón: los nietos, la familia, lo que importa. */
export function IconCorazon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M12 20.5S3.5 15.5 2.5 10a4.8 4.8 0 0 1 9-2.3h1A4.8 4.8 0 0 1 21.5 10c-1 5.5-9.5 10.5-9.5 10.5Z" />
    </svg>
  );
}

/** Marca de verificación suave, para listas. */
export function IconCheck(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M5 12.5 10 17.5 19 6.5" />
    </svg>
  );
}

/** Bocadillo de mensaje: todo ocurre por WhatsApp. */
export function IconMensaje(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5Z" />
      <path d="M8.5 10.5h7M8.5 14h4.5" strokeOpacity="0.6" />
    </svg>
  );
}

/** Taza: la calma de un café, el ritmo tranquilo. */
export function IconTaza(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M4 9h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V9Z" />
      <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 5.5c0-1 .8-1 .8-2M12 5.5c0-1 .8-1 .8-2" strokeOpacity="0.6" />
    </svg>
  );
}
