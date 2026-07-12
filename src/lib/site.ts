/**
 * Configuración central del sitio.
 *
 * Todo dato que aparece en varios lugares (precio, nombre, enlaces…)
 * vive aquí. Cambiarlo en este archivo lo cambia en toda la web.
 */
export const site = {
  name: "A Tu Paso",
  /** URL pública. Se usa en metadatos y SEO. Actualizar al comprar el dominio. */
  url: "https://atupaso.es",
  title: "A Tu Paso — Tres minutos al día para volver a moverte",
  description:
    "Cada mañana recibes en tu WhatsApp una pequeña acción de unos 3 minutos para cuidar tu cuerpo, adaptada a tu punto de partida. Pensado para personas de 55 a 75 años. Sin aplicaciones, sin gimnasios, sin prisas. 6,95 €/mes, sin permanencia.",
  /** Correo de contacto visible en el pie. Sustituir por el definitivo. */
  contactEmail: "hola@atupaso.es",
  price: {
    /** Importe mensual en euros, ya con IVA (para JSON-LD y Stripe). */
    monthly: 6.95,
    /** Importe formateado a la española, para mostrar en la web. */
    amountDisplay: "6,95 €",
    display: "6,95 €/mes",
  },
} as const;

/**
 * Rutas internas usadas por los botones de la landing.
 * El checkout real (Stripe) se conecta en la Fase 2 sin tocar los componentes.
 */
export const routes = {
  checkout: "/api/checkout",
  gracias: "/gracias",
  cancelado: "/cancelado",
} as const;
