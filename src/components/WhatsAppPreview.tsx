import { IconHoja } from "@/components/icons";
import { site } from "@/lib/site";

/**
 * Vista previa del chat: el producto, tal cual se vive.
 *
 * En lugar de fotos de stock, enseñamos exactamente lo que la persona
 * va a recibir cada mañana. Es la pieza de conversión más importante
 * del hero: convierte una idea abstracta ("acciones de 3 minutos")
 * en algo concreto y familiar.
 *
 * Evoca una conversación de mensajería sin imitar la interfaz de
 * WhatsApp (sin su logotipo ni sus colores exactos).
 */

type BubbleProps = {
  children: React.ReactNode;
  time: string;
  from: "atupaso" | "persona";
};

function Bubble({ children, time, from }: BubbleProps) {
  const isOwn = from === "persona";
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[0.94rem] leading-relaxed shadow-suave ${
          isOwn
            ? "rounded-br-md bg-salvia-200 text-tinta"
            : "rounded-bl-md bg-crema-claro text-tinta"
        }`}
      >
        <p>{children}</p>
        <p className="mt-1 text-right text-xs text-tinta-suave" aria-hidden="true">
          {time}
        </p>
      </div>
    </div>
  );
}

export function WhatsAppPreview() {
  return (
    <aside
      aria-label="Ejemplo real del mensaje diario que recibirás"
      className="w-full max-w-sm"
    >
      <div className="overflow-hidden rounded-[1.75rem] border border-tinta/10 bg-salvia-100 shadow-tarjeta">
        {/* Cabecera del chat */}
        <div className="flex items-center gap-3 bg-salvia-800 px-5 py-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-salvia-500 text-crema">
            <IconHoja className="size-6" />
          </span>
          <div>
            <p className="font-sans text-base font-semibold text-crema">
              {site.name}
            </p>
            <p className="text-sm text-salvia-200">tu momento de hoy</p>
          </div>
        </div>

        {/* Conversación de ejemplo */}
        <div className="space-y-3 px-4 py-5">
          <Bubble from="atupaso" time="9:02">
            Buenos días, Carmen 🌱 Tu momento de hoy dura tres minutos. Sin
            prisa: cuando te venga bien.
          </Bubble>
          <Bubble from="atupaso" time="9:02">
            Hoy toca algo sencillo: levántate de la silla y vuelve a sentarte,
            despacio, cinco veces. Si necesitas apoyar las manos, apóyalas. Y
            si te resulta fácil, prueba a hacerlo aún más despacio.
          </Bubble>
          <Bubble from="atupaso" time="9:03">
            Eso es todo. Ya llevas 24 días cuidándote 🌱 Mañana seguimos, a tu
            paso. 🤍
          </Bubble>
          <Bubble from="persona" time="10:47">
            Hecho 😊
          </Bubble>
        </div>
      </div>

      <p className="mt-4 text-center text-base text-tinta-suave">
        Así de sencillo. Cada mañana, en tu WhatsApp.
      </p>
    </aside>
  );
}
