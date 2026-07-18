import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con rol de servicio, SOLO para código de servidor
 * (panel de operador y sus acciones). Nunca importar desde componentes
 * de cliente: la clave de servicio no debe salir del servidor.
 */
export function supabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null; // sin configurar: el panel lo explica
  return createClient(url, key, { auth: { persistSession: false } });
}
