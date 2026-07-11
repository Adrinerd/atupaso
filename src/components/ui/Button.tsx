import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

/**
 * Botones de la landing.
 *
 * El público es mayor: los botones son grandes, con mucho aire,
 * texto legible y un área táctil mínima de 56 px de alto.
 *
 * - `primary`   → acción principal (suscribirse). Verde salvia oscuro
 *                 para garantizar contraste AA sobre crema.
 * - `secondary` → acciones de apoyo (ir al precio, regalar).
 * - `onDark`    → variante para fondos oscuros (CTA final).
 */
type Variant = "primary" | "secondary" | "onDark";

const baseClasses = [
  "inline-flex items-center justify-center gap-2",
  "min-h-14 rounded-full px-8 py-3.5",
  "font-sans text-lg font-semibold leading-snug",
  "transition-colors duration-200",
  "cursor-pointer select-none text-center",
].join(" ");

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-salvia-800 text-crema shadow-suave hover:bg-salvia-900 active:bg-salvia-900",
  secondary:
    "bg-transparent text-salvia-800 ring-2 ring-inset ring-salvia-600 hover:bg-salvia-100",
  onDark:
    "bg-crema text-salvia-900 shadow-suave hover:bg-crema-claro active:bg-crema-claro",
};

export function buttonClasses(variant: Variant = "primary", extra = ""): string {
  return `${baseClasses} ${variantClasses[variant]} ${extra}`.trim();
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
};

/** Enlace con aspecto de botón (para anclas internas y navegación). */
export function LinkButton({
  variant = "primary",
  className = "",
  children,
  ...props
}: LinkButtonProps) {
  return (
    <a className={buttonClasses(variant, className)} {...props}>
      {children}
    </a>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

/** Botón real (para formularios, como el de suscripción). */
export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClasses(variant, className)} {...props}>
      {children}
    </button>
  );
}
