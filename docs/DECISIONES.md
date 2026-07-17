# Registro de decisiones

> **Append-only.** Nunca se edita ni se borra una entrada pasada: si una
> decisión se revierte, se añade una entrada nueva que lo explica. Es la
> trazabilidad del proyecto — el "por qué" detrás de lo que hay en el código.
>
> Formato de cada entrada: fecha · decisión · motivo · alternativa descartada.

---

## 2026-07 — Precio 6,95 €/mes (no 7 €)

**Decisión:** el precio de la suscripción es 6,95 €/mes.
**Motivo:** psicología de precio por debajo de la barrera redonda, manteniendo
el posicionamiento de "menos que un café a la semana".
**Nota técnica:** centralizado en `src/lib/site.ts` (`price`), con formato
español (`amountDisplay`). Cambiarlo es una sola línea.

## 2026-07 — Contador de días, no rachas

**Decisión:** la mecánica de constancia es un contador que **solo suma y nunca
se pone a cero**. Se prohíbe cualquier "racha" que se rompa al fallar un día.
**Motivo:** una racha clásica es "todo o nada" hecho mecánica — justo el enemigo
de la marca. Para un público 55-75 que arrastra intentos fallidos, ver el
contador caer a cero confirma el fracaso y provoca abandono. Un contador que
solo suma invita a volver tras un fallo.
**Alternativa descartada:** racha de días consecutivos al estilo apps de fitness.
**Implementación:** trigger `fn_refresh_care_days` en la BD + copy en landing,
FAQ y plantillas de WhatsApp.

## 2026-07 — Personalización honesta ("punto de partida", no "100 % personalizado")

**Decisión:** prometer "adaptado a tu punto de partida" y "a tu ritmo", nunca
"plan 100 % personalizado".
**Motivo:** al arranque, la personalización real son 2-3 grupos por cuestionario
inicial + auto-ajuste dentro de cada ejercicio (variante fácil/viva). Prometer
IA individual que aún no existe sería deshonesto (contra el valor de marca) y no
hace falta para producir la seguridad que el público necesita.
**Alternativa descartada:** vender "personalización total con IA" desde el día 1.
**Futuro:** la personalización granular por individuo es mejora de fase posterior,
cuando haya datos y volumen que la justifiquen.

## 2026-07 — Captura del WhatsApp durante el pago (no antes ni después)

**Decisión:** el número de WhatsApp se recoge dentro de Stripe Checkout
(`phone_number_collection`) + un campo opcional para el número del destinatario
cuando es un regalo.
**Motivo:** un solo paso, validado por Stripe, imposible pagar sin dejarlo, y
guardado junto al cliente sin necesidad de base de datos propia en la web.
**Alternativas descartadas:** (a) formulario propio antes del pago → añade
fricción y obliga a montar BD/consentimientos ya; (b) formulario tras el pago →
un porcentaje real cierra la pestaña y quedan suscriptores sin número.

## 2026-07 — Contraste de marca: tonos oscuros para texto/botones

**Decisión:** los hex de marca (`#7A9E7E`, `#D98E73`) se usan en superficies y
acentos grandes; para texto y botones se usan variantes más oscuras derivadas.
**Motivo:** los tonos originales no cumplen contraste AA sobre crema para texto
pequeño. El público es mayor: la legibilidad es requisito, no opción.
**Alternativa descartada:** usar los hex de marca tal cual en todo, incluido texto.

## 2026-07 — Backend: WhatsApp Business Cloud API oficial (no número personal)

**Decisión:** Opción B — número dedicado sobre la WhatsApp Business Cloud API
de Meta. El número es un parámetro en `app_config`.
**Motivo:** la app WhatsApp Business del móvil no tiene API oficial;
automatizarla exige bots no oficiales que acaban en baneo del número — riesgo
mortal para un negocio que vive de ese canal.
**Alternativa descartada:** Opción A (número personal con WhatsApp Business).
**Consecuencia asumida:** ventana de 24 h de Meta (texto libre solo dentro;
fuera, plantillas de pago). Convierte el engagement diario en margen.

## 2026-07 — Backend: dos máquinas de estado ortogonales

**Decisión:** cada usuario tiene `subscription_status` (lo escribe solo Stripe)
y `journey_status` (lo escribe solo el motor de eventos), independientes.
**Motivo:** un único estado mezcla facturación y comportamiento y hace
inexpresable el caso más valioso (paga pero no responde).
**Alternativa descartada:** un solo campo de estado por usuario.

## 2026-07 — Backend: la lógica crítica en código, n8n solo en la periferia

**Decisión:** webhooks, motor de mensajes y transiciones viven en código
versionado (Supabase Edge Functions + SQL). n8n queda para avisos e informes.
**Motivo:** lógica de negocio en editor visual = difícil de versionar, testear y
depurar; deuda técnica hacia los 1.000 usuarios.
**Alternativa descartada:** n8n como orquestador central del negocio.

## 2026-07 — GitHub como única fuente de la verdad; método de trabajo

**Decisión:** el repositorio es la fuente de la verdad. `CLAUDE.md` es la memoria
de arranque de cada sesión; `docs/` guarda proyecto, marca, arquitectura y este
registro. Un chat por línea de trabajo; todo cambio termina en commit.
**Motivo:** el historial de chat se resume y se trunca; no es memoria fiable.
**Alternativa descartada:** confiar en un único chat largo como memoria del proyecto.
