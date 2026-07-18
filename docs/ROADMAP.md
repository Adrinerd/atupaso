# Roadmap — A Tu Paso

> **Numeración canónica de fases del proyecto.** Si otro documento habla de
> "fases" con otros números (planes anteriores), manda este. Cada fase tiene
> un objetivo de negocio, no solo técnico: no se pasa a la siguiente hasta
> que la actual responde su pregunta.

## Vista rápida

| Fase | Nombre | Pregunta que responde | Estado |
|---|---|---|---|
| 0 | Landing + pagos | ¿Puedo cobrar? | ✅ Hecha (en producción) |
| 1 | Núcleo técnico | ¿Existe la máquina? | ✅ Código listo (pendiente de desplegar Supabase) |
| 2 | **Validación manual (modo concierge)** | **¿Esto retiene? ¿Pagan el mes 2?** | ▶ En curso |
| 3 | Conexión WhatsApp automática | ¿Escala sin mí cada mañana? | ⬜ Al validar la fase 2 |
| 4 | Método completo | ¿El sistema progresa a la gente solo? | ⬜ |
| 5 | IA | ¿Se atiende solo lo ambiguo? | ⬜ |
| 6 | Escala | ¿Crece con paid media y B2B? | ⬜ |

## Fase 0 — Landing + pagos ✅

Landing profesional (Next.js en Vercel) con Stripe Checkout de 6,95 €/mes,
captura del WhatsApp durante el pago, páginas de gracias/cancelado, SEO y
páginas legales. **Hecha y en producción.**

## Fase 1 — Núcleo técnico ✅ (código listo)

Base de datos completa en Supabase (usuarios, estados, cola de mensajes,
eventos, historiales), webhooks de Stripe, webhook de WhatsApp, dispatcher,
45 ejercicios y 11 plantillas sembrados. **El código está terminado y
validado; falta que el fundador cree el proyecto Supabase y lo despliegue**
(guía en `FASE1-SETUP.md`, bloques A-C — el bloque D/Meta NO hace falta aún).

## Fase 2 — Validación manual (modo concierge) ▶

**La decisión clave:** no conectamos ningún número a la API de Meta todavía.
El fundador envía y recibe los WhatsApps **con su propia app**, de forma
manual, a los primeros clientes reales. El sistema hace todo lo demás:

- Stripe da de alta a los usuarios solos (eso ya es automático).
- Cada mañana el sistema prepara **el guion del día**: a quién escribir y
  qué texto exacto (el momento de cada usuario, según su nivel).
- Un **panel de operador** privado (`/operador` en la web) muestra ese guion
  con botón de copiar, y permite registrar en un clic lo que respondió cada
  persona ("hecho", "le costó", "no respondió") y completar el onboarding
  con las 5 preguntas del Método.
- Todo queda en la base de datos igual que si lo hubiera enviado la máquina:
  contador de días, señales de progresión, datos de retención (el moat).

**Por qué así:** valida el negocio (¿responden? ¿renuevan?) con coste cero de
Meta y cero riesgo, mientras entrena exactamente el mismo circuito de datos
que usará la automatización. Con 5-20 clientes, esto son ~10-15 min al día.

**Criterio de salida:** retención al día 14 alta y primeras renovaciones del
mes 2 (las métricas madre del plan de negocio). Si no se cumplen, se ajusta
producto/contenido sin haber pagado la complejidad de Meta.

## Fase 3 — Conexión WhatsApp automática ⬜

Cuando la fase 2 diga "sí": alta en Meta (verificación de empresa, número
dedicado, plantillas aprobadas — bloque D de `FASE1-SETUP.md`) y cambiar el
interruptor `channel_mode` de `manual` a `meta` en la configuración. El
dispatcher empieza a enviar solo y el webhook a escuchar solo. **No hay que
construir nada nuevo: es enchufar credenciales.** El panel de operador queda
como supervisión.

## Fase 4 — Método completo ⬜

Implementar el Método v0.1 aprobado (`METODO.md` §13): 9 etapas (fases A/B/C
por nivel), dominio "marcha", puertas "hoy contamos", triggers de progresión
completos, ~50 ejercicios nuevos, resumen dominical.

## Fase 5 — IA ⬜

Clasificador de respuestas ambiguas (con cola de aprobación humana), FAQ
automática, detección de riesgo de abandono, resúmenes de conversación.
Diseño en `ARQUITECTURA.md` §9.

## Fase 6 — Escala ⬜

Paid media serio al vídeo en Meta, optimización del embudo, dashboard propio,
vía B2B (residencias, centros de día, aseguradoras). La app nativa solo se
evalúa aquí, si los usuarios la piden.

---

### Correspondencia con numeraciones anteriores

- Las "Fases 1-3" del desarrollo de la landing (brief original) = Fase 0.
- Las "Fases 1-4" del roadmap técnico de `ARQUITECTURA.md` §13 = Fases 1, 3-4, 5 y 6.
- Las "Fases 1-4" go-to-market de `PLAN-DE-NEGOCIO.md` §11 = Fases 0, 2, 3 y 6.
