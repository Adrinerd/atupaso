import { Button } from "@/components/ui/Button";
import { routes } from "@/lib/site";

type CheckoutFormProps = {
  /** Texto del botón de suscripción. */
  label: string;
  /** Variante visual del botón según el fondo donde se muestra. */
  variant?: "primary" | "onDark";
  className?: string;
};

/**
 * Formulario que inicia la suscripción.
 *
 * Es un formulario HTML clásico (POST) a propósito: funciona sin
 * JavaScript, algo importante para un público mayor con dispositivos
 * y conexiones muy variados.
 *
 * En la Fase 2, la ruta /api/checkout crea la sesión de Stripe
 * Checkout y redirige a la pasarela de pago. Los componentes de la
 * landing no necesitarán ningún cambio.
 */
export function CheckoutForm({
  label,
  variant = "primary",
  className = "",
}: CheckoutFormProps) {
  return (
    <form method="POST" action={routes.checkout} className={className}>
      <Button type="submit" variant={variant} className="w-full sm:w-auto">
        {label}
      </Button>
    </form>
  );
}
