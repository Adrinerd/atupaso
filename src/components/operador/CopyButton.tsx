"use client";

import { useState } from "react";

/** Botón de copiar al portapapeles para el guion del operador. */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="rounded-full bg-salvia-100 px-4 py-2 text-sm font-semibold text-salvia-900 hover:bg-salvia-200"
    >
      {copied ? "Copiado ✓" : "Copiar mensaje"}
    </button>
  );
}
