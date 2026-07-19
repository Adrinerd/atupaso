import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Condiciones de contratación — ${site.name}`,
  robots: { index: false },
};

/**
 * Condiciones de contratación (plantilla).
 *
 * ⚠️ Completar los datos entre corchetes antes de publicar y revisar con
 * un profesional legal cuando el negocio esté validado (ver docs/LEGAL.md).
 * Obligatoria en España para la venta de suscripciones (normativa de
 * consumo y LSSI-CE).
 */
export default function CondicionesPage() {
  return (
    <>
      <Header />
      <main id="contenido" className="py-16 lg:py-24">
        <Container className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-tinta">
            Condiciones de contratación
          </h1>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-tinta-suave">
            <p>
              <strong className="text-tinta">1. Quién presta el servicio.</strong>{" "}
              {site.name} es un servicio prestado por [Nombre y apellidos],
              NIF [número], con domicilio en [dirección] y correo de contacto{" "}
              {site.contactEmail}.
            </p>
            <p>
              <strong className="text-tinta">2. Qué contratas.</strong> Una
              suscripción mensual por la que recibes, cada día y por WhatsApp,
              una pequeña acción de bienestar de unos 3 minutos, adaptada a tu
              punto de partida. Es un servicio de acompañamiento y educación en
              hábitos: <strong className="text-tinta">no es un servicio
              sanitario</strong> y no sustituye el consejo de profesionales de
              la salud.
            </p>
            <p>
              <strong className="text-tinta">3. Precio y renovación.</strong>{" "}
              El precio es de {site.price.display} (IVA incluido). La
              suscripción se renueva automáticamente cada mes y el cobro lo
              gestiona Stripe con tu tarjeta. No hay permanencia ni penalización
              por cancelar.
            </p>
            <p>
              <strong className="text-tinta">4. Cómo cancelar.</strong> Cuando
              quieras y con efecto inmediato sobre la siguiente renovación:
              escríbenos a {site.contactEmail} o responde CANCELAR en el propio
              WhatsApp. Seguirás recibiendo el servicio hasta el final del
              periodo ya pagado y no se te volverá a cobrar.
            </p>
            <p>
              <strong className="text-tinta">5. Derecho de desistimiento.</strong>{" "}
              Como consumidor, dispones de 14 días naturales desde la
              contratación para desistir sin dar explicaciones, escribiendo a{" "}
              {site.contactEmail}. Si has disfrutado ya del servicio durante
              esos días, podremos deducir la parte proporcional; en la práctica,
              si en tus primeros 14 días no es para ti, te devolvemos el importe
              y en paz.
            </p>
            <p>
              <strong className="text-tinta">6. Tu parte.</strong> Las acciones
              propuestas son suaves y de intensidad progresiva, pero eres
              responsable de realizarlas dentro de tus posibilidades, siguiendo
              las indicaciones de seguridad de cada mensaje, y de consultar a tu
              médico si tienes una condición de salud que pueda desaconsejar el
              ejercicio.
            </p>
            <p>
              <strong className="text-tinta">7. Responsabilidad.</strong> En la
              medida en que la ley lo permite, la responsabilidad de {site.name}{" "}
              se limita al importe pagado por el servicio. Nada de lo anterior
              limita derechos que la normativa de consumo te reconozca como
              irrenunciables.
            </p>
            <p>
              <strong className="text-tinta">8. Ley aplicable.</strong> Estas
              condiciones se rigen por la legislación española. Cualquier
              controversia se someterá a los juzgados que correspondan conforme
              a la normativa de consumidores.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
