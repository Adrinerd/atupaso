import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * robots.txt generado por Next.js.
 * Las páginas de vuelta del pago no deben aparecer en buscadores.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/gracias", "/cancelado", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
