import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Container } from "@/components/ui/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `Aviso legal — ${site.name}`,
  robots: { index: false },
};

/**
 * Aviso legal (plantilla).
 *
 * ⚠️ Los datos entre corchetes deben completarse con la información
 * real del titular antes de publicar la web, y el texto conviene
 * revisarlo con un profesional legal. En España, una web con venta
 * de servicios está obligada a identificar a su titular (LSSI-CE).
 */
export default function AvisoLegalPage() {
  return (
    <>
      <Header />
      <main id="contenido" className="py-16 lg:py-24">
        <Container className="max-w-3xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-tinta">
            Aviso legal
          </h1>
          <div className="mt-8 space-y-6 text-lg leading-relaxed text-tinta-suave">
            <p>
              En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de
              la Información y de Comercio Electrónico (LSSI-CE), se informa de
              que este sitio web es titularidad de:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Titular: [Nombre y apellidos o razón social]</li>
              <li>NIF/CIF: [Número]</li>
              <li>Domicilio: [Dirección completa]</li>
              <li>Correo electrónico: {site.contactEmail}</li>
            </ul>
            <p>
              El acceso y uso de este sitio web atribuye la condición de
              usuario e implica la aceptación de las condiciones aquí
              recogidas. El titular se reserva el derecho a modificar los
              contenidos del sitio sin previo aviso.
            </p>
            <p>
              Los contenidos de {site.name} tienen carácter divulgativo y de
              acompañamiento, y no sustituyen en ningún caso el consejo de un
              profesional sanitario.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
