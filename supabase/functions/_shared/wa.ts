/**
 * Adaptador de canal: WhatsApp Business Cloud API (Meta).
 *
 * Todo el conocimiento sobre "cómo se envía por WhatsApp" vive aquí.
 * Si algún día cambiamos de proveedor (Twilio, 360dialog) o de número,
 * solo cambia este archivo y app_config — nunca la lógica de negocio.
 */

const GRAPH_URL = "https://graph.facebook.com/v21.0";

/** Ventana de servicio de Meta: 24 h desde el último mensaje del usuario. */
export function isWindowOpen(lastInboundAt: string | null): boolean {
  if (!lastInboundAt) return false;
  return Date.now() - new Date(lastInboundAt).getTime() < 24 * 60 * 60 * 1000;
}

type SendResult = { waMessageId: string };

async function callGraph(
  phoneNumberId: string,
  body: Record<string, unknown>,
): Promise<SendResult> {
  const res = await fetch(`${GRAPH_URL}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get("WA_ACCESS_TOKEN")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Meta ${res.status}: ${JSON.stringify(json.error ?? json)}`);
  }
  return { waMessageId: json.messages?.[0]?.id ?? "" };
}

/** Texto libre: solo válido dentro de la ventana de 24 h. */
export function sendText(phoneNumberId: string, to: string, body: string) {
  return callGraph(phoneNumberId, {
    to,
    type: "text",
    text: { body, preview_url: false },
  });
}

/** Plantilla aprobada: válida en cualquier momento (tiene coste). */
export function sendTemplate(
  phoneNumberId: string,
  to: string,
  templateName: string,
  params: string[],
) {
  return callGraph(phoneNumberId, {
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: "es" },
      components: params.length
        ? [{
          type: "body",
          parameters: params.map((text) => ({ type: "text", text })),
        }]
        : [],
    },
  });
}

/**
 * Orden de las variables {{n}} de cada plantilla aprobada en Meta.
 * Debe coincidir con cómo se den de alta en el panel de Meta.
 */
export const META_PARAM_ORDER: Record<string, string[]> = {
  atupaso_bienvenida: ["nombre"],
  atupaso_momento_diario: ["nombre", "ejercicio", "variante_facil", "variante_viva"],
  atupaso_vuelta_amable: ["nombre", "dias"],
  atupaso_pago_fallido: ["nombre"],
  atupaso_despedida: ["dias"],
  atupaso_reactivacion: ["nombre", "dias"],
};

/** Sustituye {{variable}} en el cuerpo de una plantilla de la BD. */
export function renderBody(body: string, vars: Record<string, string>): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}
