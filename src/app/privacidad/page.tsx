import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Política de privacidad — ${site.name}`,
  robots: { index: false },
};

/**
 * Política de privacidad (plantilla).
 *
 * ⚠️ Completar los datos entre corchetes y revisar con un profesional
 * legal antes de publicar. El tratamiento del número de WhatsApp y de
 * los datos de pago (Stripe) debe reflejarse aquí con precisión cuando
 * se active la Fase 2.
 */
export default function PrivacidadPage() {
  return (
    <>
      <Header />
      <main id="contenido" className="py-16 lg:py-24">
        <Container className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-tinta">
            Política de privacidad
          </h1>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-tinta-suave">
            <p>
              Responsable del tratamiento: [Nombre o razón social], con
              domicilio en [dirección] y correo de contacto{" "}
              {site.contactEmail}.
            </p>
            <p>
              <strong className="text-tinta">Qué datos tratamos.</strong> Para
              prestar el servicio necesitamos tu nombre, tu número de WhatsApp
              (o el de la persona suscrita) y los datos de facturación. El pago
              se procesa a través de Stripe: nosotros no almacenamos los datos
              de tu tarjeta.
            </p>
            <p>
              <strong className="text-tinta">Para qué los usamos.</strong>{" "}
              Exclusivamente para enviarte el mensaje diario del servicio,
              gestionar tu suscripción y atender tus consultas. No vendemos ni
              cedemos tus datos a terceros con fines comerciales.
            </p>
            <p>
              <strong className="text-tinta">Tus derechos.</strong> Puedes
              ejercer tus derechos de acceso, rectificación, supresión,
              oposición, limitación y portabilidad escribiendo a{" "}
              {site.contactEmail}. También puedes reclamar ante la Agencia
              Española de Protección de Datos (aepd.es).
            </p>
            <p>
              <strong className="text-tinta">Conservación.</strong> Guardamos
              tus datos mientras la suscripción esté activa y, después, solo
              durante los plazos que exige la normativa fiscal.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
