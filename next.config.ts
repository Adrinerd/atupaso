import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sin configuración especial por ahora: la landing es 100 % estática
  // salvo la ruta de checkout (Fase 2). Preparado para desplegar en Vercel.
  reactStrictMode: true,
};

export default nextConfig;
