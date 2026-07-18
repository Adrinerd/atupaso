import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Autenticación mínima del panel de operador (Fase 2).
 *
 * Una sola contraseña (variable de entorno OPERATOR_PASSWORD) y una cookie
 * httpOnly con un HMAC derivado de ella. Suficiente para un panel interno
 * de una persona; si algún día hay más operadores, se migra a Supabase Auth.
 */
const COOKIE_NAME = "atupaso_operador";

function expectedToken(): string | null {
  const password = process.env.OPERATOR_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("operador-de-a-tu-paso").digest("hex");
}

export function isValidToken(token: string | undefined): boolean {
  const expected = expectedToken();
  if (!expected || !token || token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

/** Comprueba la contraseña y devuelve el token de cookie si es correcta. */
export function tokenForPassword(password: string): string | null {
  const configured = process.env.OPERATOR_PASSWORD;
  if (!configured || password !== configured) return null;
  return expectedToken();
}

/** Para páginas y acciones del panel: expulsa al login si no hay sesión. */
export async function requireOperador(): Promise<void> {
  const jar = await cookies();
  if (!isValidToken(jar.get(COOKIE_NAME)?.value)) {
    redirect("/operador/login");
  }
}

export const OPERADOR_COOKIE = COOKIE_NAME;
