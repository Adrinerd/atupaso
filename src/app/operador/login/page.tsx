import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { OPERADOR_COOKIE, tokenForPassword } from "@/lib/operador-auth";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Operador — A Tu Paso",
  robots: { index: false },
};

/** Entrada al panel del operador: una contraseña, una cookie. */
export default async function OperadorLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  async function login(formData: FormData) {
    "use server";
    const token = tokenForPassword(String(formData.get("password") ?? ""));
    if (!token) redirect("/operador/login?error=1");
    const jar = await cookies();
    jar.set(OPERADOR_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/operador",
      maxAge: 60 * 60 * 24 * 30,
    });
    redirect("/operador");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Container className="max-w-sm">
        <h1 className="font-display text-3xl font-semibold text-tinta">
          Panel del operador
        </h1>
        <p className="mt-2 text-base text-tinta-suave">
          Uso interno de A Tu Paso.
        </p>
        <form action={login} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-base font-medium text-tinta">Contraseña</span>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="mt-2 w-full rounded-xl border border-tinta/20 bg-crema-claro px-4 py-3 text-lg"
            />
          </label>
          {error && (
            <p className="text-base text-terracota-800">
              Contraseña incorrecta (¿está definida OPERATOR_PASSWORD?).
            </p>
          )}
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </Container>
    </main>
  );
}
