import { CheckoutForm } from "@/components/CheckoutForm";
import { IconCheck } from "@/components/icons";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

/**
 * Precio: un único plan, sin trampas.
 *
 * Una sola tarjeta centrada. El ancla #precio es el destino de todos
 * los botones de la página, y aquí vive el formulario de suscripción.
 */
const included = [
  "Un mensaje cada día, los 365 días del año",
  "Acciones de unos 3 minutos, suaves y seguras",
  "Pensado para personas de 55 a 75 años",
  "Para ti o para regalar a quien quieres cuidar",
  "Sin permanencia: cancelas cuando quieras",
];

export function Precio() {
  return (
    <section id="precio" className="py-20 lg:py-28">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight text-tinta sm:text-[2.75rem]">
            Un único plan. Sin sorpresas.
          </h2>
          <p className="mt-5 text-xl leading-relaxed text-tinta-suave">
            Menos de lo que cuesta un café a la semana.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-lg rounded-[2rem] border border-salvia-200 bg-crema-claro p-8 shadow-tarjeta sm:p-12">
          <p className="text-lg font-semibold uppercase tracking-wide text-salvia-700">
            Tu momento de hoy
          </p>

          <p className="mt-4 flex items-baseline gap-2">
            <span className="font-display text-6xl font-semibold tracking-tight text-tinta">
              {site.price.monthly} €
            </span>
            <span className="text-xl text-tinta-suave">al mes</span>
          </p>

          <ul className="mt-8 space-y-4">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <IconCheck className="mt-1.5 size-5 shrink-0 text-salvia-700" />
                <p className="text-lg leading-relaxed text-tinta">{item}</p>
              </li>
            ))}
          </ul>

          <CheckoutForm
            label={`Suscribirme por ${site.price.display}`}
            className="mt-10 [&_button]:w-full"
          />

          <p className="mt-5 text-center text-base leading-relaxed text-tinta-suave">
            Pago seguro con tarjeta a través de Stripe.
            <br />
            Sin letra pequeña: si no te encaja, lo cancelas y ya está.
          </p>
        </div>
      </Container>
    </section>
  );
}
