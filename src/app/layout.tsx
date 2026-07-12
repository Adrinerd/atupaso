import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { faqItems } from "@/content/faq";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Tipografías de marca, servidas por Next (sin peticiones a Google
 * en tiempo de ejecución): Fraunces para titulares, Inter para texto.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  alternates: {
    canonical: "/",
  },
};

/**
 * Datos estructurados para buscadores (JSON-LD):
 * la organización, el servicio con su precio y las preguntas frecuentes.
 */
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: site.name,
      url: site.url,
      email: site.contactEmail,
    },
    {
      "@type": "Service",
      name: site.name,
      description: site.description,
      serviceType: "Acompañamiento diario de bienestar por WhatsApp",
      areaServed: "ES",
      offers: {
        "@type": "Offer",
        price: site.price.monthly,
        priceCurrency: "EUR",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        {/* Enlace de salto para navegación por teclado (accesibilidad) */}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-salvia-800 focus:px-6 focus:py-3 focus:text-crema"
        >
          Saltar al contenido
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  );
}
