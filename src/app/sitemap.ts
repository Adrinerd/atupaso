import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Mapa del sitio para buscadores. La landing es la página que importa. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${site.url}/aviso-legal`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${site.url}/privacidad`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
