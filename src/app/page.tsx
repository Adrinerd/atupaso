import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ComoFunciona } from "@/components/sections/ComoFunciona";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { EsParaTi } from "@/components/sections/EsParaTi";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { ParaHijos } from "@/components/sections/ParaHijos";
import { Precio } from "@/components/sections/Precio";
import { QueVasANotar } from "@/components/sections/QueVasANotar";

/**
 * Landing de A Tu Paso.
 *
 * Un único recorrido, pensado para conducir a la suscripción:
 * promesa → identificación → funcionamiento → beneficios →
 * compradores secundarios (hijos/as) → precio → objeciones → cierre.
 */
export default function HomePage() {
  return (
    <>
      <Header />
      <main id="contenido">
        <Hero />
        <EsParaTi />
        <ComoFunciona />
        <QueVasANotar />
        <ParaHijos />
        <Precio />
        <Faq />
        <CtaFinal />
      </main>
      <Footer />
    </>
  );
}
