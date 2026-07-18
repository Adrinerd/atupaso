import type { Metadata } from "next";
import { requireOperador } from "@/lib/operador-auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Container } from "@/components/ui/Container";
import { CopyButton } from "@/components/operador/CopyButton";
import {
  completarOnboarding,
  marcarEnviado,
  registrarResultado,
  resolverAlerta,
} from "./actions";

export const metadata: Metadata = {
  title: "Operador — A Tu Paso",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

/**
 * Panel del operador (Fase 2 — modo concierge).
 *
 * La rutina diaria del fundador, en una página:
 *  1. Guion de hoy: mensajes preparados por el sistema → copiar → WhatsApp.
 *  2. Respuestas: registrar en un clic lo que contestó cada persona.
 *  3. Onboarding: completar el cuestionario de los nuevos.
 *  4. Alertas: lo que requiere atención humana.
 */

const resultButtons = [
  { value: "done", label: "Hecho", classes: "bg-salvia-800 text-crema" },
  { value: "done_easier", label: "Con ayuda", classes: "bg-salvia-600 text-crema" },
  { value: "done_harder", label: "Le fue fácil", classes: "bg-salvia-500 text-crema" },
  { value: "struggled", label: "Le costó", classes: "bg-terracota-500 text-tinta" },
  { value: "skipped", label: "No respondió", classes: "bg-tinta/10 text-tinta" },
];

function Section({ title, count, children }: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-semibold text-tinta">
        {title}{" "}
        <span className="text-lg font-normal text-tinta-suave">({count})</span>
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export default async function OperadorPage() {
  await requireOperador();
  const db = supabaseAdmin();

  if (!db) {
    return (
      <main className="py-16">
        <Container className="max-w-2xl">
          <h1 className="font-display text-3xl font-semibold text-tinta">Panel del operador</h1>
          <p className="mt-4 text-lg text-tinta-suave">
            Faltan las variables <code>SUPABASE_URL</code> y{" "}
            <code>SUPABASE_SERVICE_ROLE_KEY</code> (en Vercel o en{" "}
            <code>.env.local</code>). Están en Supabase → Settings → API.
          </p>
        </Container>
      </main>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const [guion, respuestas, nuevos, alertas] = await Promise.all([
    db.from("v_guion_de_hoy").select("*"),
    db
      .from("user_exercises")
      .select("id, user_id, users(full_name, whatsapp_e164, care_days_total), exercises(name)")
      .eq("scheduled_for", today)
      .eq("result", "pending")
      .not("sent_at", "is", null),
    db
      .from("users")
      .select("id, full_name, whatsapp_e164, buyer_name, is_gift, journey_status, created_at")
      .in("journey_status", ["pendiente_onboarding", "en_analisis"])
      .is("deleted_at", null)
      .order("created_at"),
    db
      .from("alerts")
      .select("id, user_id, type, severity, payload, created_at, users(full_name, whatsapp_e164)")
      .eq("status", "abierta")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <main className="py-10">
      <Container className="max-w-3xl">
        <h1 className="font-display text-3xl font-semibold text-tinta">
          Buenos días 🌱
        </h1>
        <p className="mt-1 text-base text-tinta-suave">
          Modo manual (Fase 2): copia, envía por WhatsApp y registra. La base
          de datos hace el resto.
        </p>

        {/* 1 ─ GUION DE HOY */}
        <Section title="Guion de hoy — para enviar" count={guion.data?.length ?? 0}>
          {(guion.data ?? []).map((m) => (
            <div key={m.scheduled_id} className="rounded-2xl border border-tinta/10 bg-crema-claro p-5">
              <p className="text-sm font-semibold text-salvia-800">
                {m.nombre || "—"} · {m.whatsapp_e164} · {m.template_code ?? "mensaje"}
              </p>
              <p className="mt-2 whitespace-pre-wrap text-base leading-relaxed text-tinta">
                {m.body}
              </p>
              <div className="mt-4 flex items-center gap-3">
                <CopyButton text={m.body} />
                <form action={marcarEnviado}>
                  <input type="hidden" name="scheduled_id" value={m.scheduled_id} />
                  <button className="rounded-full bg-salvia-800 px-4 py-2 text-sm font-semibold text-crema hover:bg-salvia-900">
                    Marcar enviado
                  </button>
                </form>
              </div>
            </div>
          ))}
          {(guion.data?.length ?? 0) === 0 && (
            <p className="text-base text-tinta-suave">Nada pendiente de enviar. 🎉</p>
          )}
        </Section>

        {/* 2 ─ RESPUESTAS */}
        <Section title="Respuestas al momento de hoy" count={respuestas.data?.length ?? 0}>
          {(respuestas.data ?? []).map((r) => {
            const user = r.users as unknown as {
              full_name: string | null; whatsapp_e164: string; care_days_total: number;
            };
            const exercise = r.exercises as unknown as { name: string };
            return (
              <div key={r.id} className="rounded-2xl border border-tinta/10 bg-crema-claro p-5">
                <p className="text-sm font-semibold text-salvia-800">
                  {user.full_name ?? user.whatsapp_e164} · {exercise.name} · lleva{" "}
                  {user.care_days_total} días
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resultButtons.map((b) => (
                    <form key={b.value} action={registrarResultado}>
                      <input type="hidden" name="user_exercise_id" value={r.id} />
                      <input type="hidden" name="result" value={b.value} />
                      <button className={`rounded-full px-4 py-2 text-sm font-semibold ${b.classes}`}>
                        {b.label}
                      </button>
                    </form>
                  ))}
                </div>
                <p className="mt-2 text-sm text-tinta-suave">
                  Al registrar (salvo “No respondió”), la respuesta de vuelta
                  aparecerá arriba, en el guion.
                </p>
              </div>
            );
          })}
          {(respuestas.data?.length ?? 0) === 0 && (
            <p className="text-base text-tinta-suave">Sin momentos esperando respuesta.</p>
          )}
        </Section>

        {/* 3 ─ ONBOARDING */}
        <Section title="Nuevos — completar onboarding" count={nuevos.data?.length ?? 0}>
          {(nuevos.data ?? []).map((u) => (
            <div key={u.id} className="rounded-2xl border border-tinta/10 bg-crema-claro p-5">
              <p className="text-sm font-semibold text-salvia-800">
                {u.full_name ?? u.buyer_name ?? "Sin nombre"} · {u.whatsapp_e164}
                {u.is_gift && " · 🎁 regalo"} · {u.journey_status}
              </p>
              <form action={completarOnboarding} className="mt-3 space-y-3 text-base text-tinta">
                <input type="hidden" name="user_id" value={u.id} />
                {[
                  { name: "p1", q: "¿Se levanta de una silla sin manos?", opts: ["No / con ayuda", "Con esfuerzo", "Sí"] },
                  { name: "p2", q: "¿Cuánto camina seguido?", opts: ["<10 min", "10-30 min", ">30 min"] },
                  { name: "p3", q: "¿Se sostiene a un pie (con apoyo cerca)?", opts: ["No", "Unos segundos", "Con soltura"] },
                ].map((p) => (
                  <fieldset key={p.name}>
                    <legend className="text-sm font-medium">{p.q}</legend>
                    <div className="mt-1 flex flex-wrap gap-3">
                      {p.opts.map((opt, i) => (
                        <label key={i} className="flex items-center gap-1.5 text-sm">
                          <input type="radio" name={p.name} value={i} required /> {opt}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
                <div className="flex flex-wrap gap-4 text-sm">
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" name="flag_caidas" /> Caídas o miedo a caer
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input type="checkbox" name="flag_medico" /> Limitación médica
                  </label>
                </div>
                <button className="rounded-full bg-salvia-800 px-5 py-2 text-sm font-semibold text-crema hover:bg-salvia-900">
                  Asignar nivel y activar
                </button>
              </form>
            </div>
          ))}
          {(nuevos.data?.length ?? 0) === 0 && (
            <p className="text-base text-tinta-suave">Nadie pendiente de onboarding.</p>
          )}
        </Section>

        {/* 4 ─ ALERTAS */}
        <Section title="Alertas abiertas" count={alertas.data?.length ?? 0}>
          {(alertas.data ?? []).map((a) => {
            const user = a.users as unknown as {
              full_name: string | null; whatsapp_e164: string;
            } | null;
            return (
              <div
                key={a.id}
                className={`rounded-2xl border p-5 ${
                  a.severity === "alta"
                    ? "border-terracota-500 bg-terracota-100"
                    : "border-tinta/10 bg-crema-claro"
                }`}
              >
                <p className="text-sm font-semibold text-tinta">
                  {a.type} · {a.severity}
                  {user && ` · ${user.full_name ?? user.whatsapp_e164}`}
                </p>
                <pre className="mt-2 whitespace-pre-wrap text-sm text-tinta-suave">
                  {JSON.stringify(a.payload, null, 2)}
                </pre>
                <form action={resolverAlerta} className="mt-3">
                  <input type="hidden" name="alert_id" value={a.id} />
                  <button className="rounded-full bg-tinta/10 px-4 py-2 text-sm font-semibold text-tinta hover:bg-tinta/20">
                    Marcar resuelta
                  </button>
                </form>
              </div>
            );
          })}
          {(alertas.data?.length ?? 0) === 0 && (
            <p className="text-base text-tinta-suave">Sin alertas. Todo en calma.</p>
          )}
        </Section>
      </Container>
    </main>
  );
}
