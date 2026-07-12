import { createClient } from "npm:@supabase/supabase-js@2";

/**
 * Cliente de base de datos con rol de servicio.
 * Solo las Edge Functions escriben en la BD (RLS deny-by-default).
 */
export function serviceClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );
}

/** Lee un valor de app_config (el número de WhatsApp, umbrales…). */
export async function getConfig<T>(
  db: ReturnType<typeof serviceClient>,
  key: string,
): Promise<T | null> {
  const { data } = await db.from("app_config").select("value").eq("key", key).single();
  return (data?.value as T) ?? null;
}

/** Registra un evento de negocio (append-only). */
export async function emitEvent(
  db: ReturnType<typeof serviceClient>,
  userId: string | null,
  type: string,
  payload: Record<string, unknown> = {},
) {
  await db.from("events").insert({ user_id: userId, type, payload });
}

/**
 * Idempotencia de webhooks: true si este evento externo es nuevo,
 * false si ya se procesó (y por tanto hay que ignorarlo).
 */
export async function claimWebhookEvent(
  db: ReturnType<typeof serviceClient>,
  provider: string,
  externalId: string,
): Promise<boolean> {
  const { error } = await db
    .from("webhook_events")
    .insert({ provider, external_id: externalId });
  return !error; // clave duplicada => ya procesado
}
