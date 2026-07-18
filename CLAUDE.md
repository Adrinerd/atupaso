# CLAUDE.md — Memoria de arranque de A Tu Paso

> Este archivo lo lee Claude Code automáticamente al empezar cada sesión.
> Es el **índice** del proyecto: corto y denso. El detalle vive en `docs/`.
> Si algo de aquí deja de ser cierto, actualízalo en el mismo commit que lo cambia.

## Qué es esto

**A Tu Paso** es un servicio de suscripción que envía cada día, por WhatsApp,
una pequeña acción de salud de ~3 minutos ("tu momento de hoy"), para personas
de 55 a 75 años que quieren volver a moverse poco a poco. No es fitness, no es
adelgazar: es volver a moverse, sin culpa ni presión. La emoción de marca es el
**alivio**. Precio: **6,95 €/mes**, sin permanencia.

Detalle completo en [`docs/PROYECTO.md`](docs/PROYECTO.md).

## Estado actual

| Fase | Qué es | Estado |
|---|---|---|
| 1 — Landing | Web de captación + Stripe Checkout | ✅ En producción (Vercel) |
| 2 — Pagos | Suscripción, gracias/cancelado, captura de WhatsApp | ✅ Hecho |
| 3 — Backend núcleo | BD (Supabase), webhooks, motor de mensajes | ✅ Código listo; pendiente de desplegar por el fundador |
| — Automatización completa | Onboarding automático, dashboard | ⬜ Siguiente |
| — IA | Clasificación, FAQ, riesgo de abandono | ⬜ Pendiente |

La numeración de fases del backend y su alcance están en
[`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) (§13, roadmap).

## Estructura del repositorio

```
atupaso/
├── CLAUDE.md              # este archivo (memoria de arranque)
├── .claude/
│   └── agents/            # agentes especializados reutilizables
│       └── growth-content.md  #   contenido de vídeo para Facebook/Instagram
├── docs/                  # la fuente de la verdad documental
│   ├── README.md          #   índice de la documentación
│   ├── PROYECTO.md        #   qué es el negocio, público, promesa
│   ├── PLAN-DE-NEGOCIO.md #   economía, moat, riesgos, fases go-to-market, métricas
│   ├── GUIA-DE-MARCA.md   #   misión, valores, arquetipo, voz, color, tipografía
│   ├── ARQUITECTURA.md    #   diseño técnico del backend (documento vivo)
│   ├── DECISIONES.md      #   registro append-only de decisiones
│   └── FASE1-SETUP.md     #   guía de despliegue del backend (no técnicos)
├── src/                   # la landing (Next.js 15 App Router)
│   ├── app/               #   páginas, layout, rutas, SEO
│   ├── components/        #   secciones y UI reutilizable
│   ├── content/           #   FAQ y otros datos de contenido
│   └── lib/site.ts        #   configuración central (precio, nombre, rutas)
└── supabase/              # el backend
    ├── migrations/        #   esquema y lógica SQL (fuente de verdad de la BD)
    ├── functions/         #   Edge Functions (Deno): webhooks y dispatcher
    └── seed.sql           #   niveles, plantillas y 45 ejercicios
```

## Stack

- **Web**: Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS 4, en Vercel.
- **Pagos**: Stripe Checkout (suscripción mensual).
- **Backend**: Supabase (PostgreSQL región UE) — única fuente de la verdad.
- **Mensajería**: WhatsApp Business Cloud API (Meta). Número = configuración, no código.
- **IA** (futuro): gateway agnóstico del proveedor; el modelo es configuración.

## Cómo trabajar en este repo (método)

1. **La fuente de la verdad es GitHub, nunca el chat.** El chat se resume y se
   trunca; lo que no está commiteado, se pierde. Todo cambio termina en un commit.
2. **Los documentos son vivos**: al cambiar una decisión, se actualiza el doc en
   el **mismo** commit. Un doc desactualizado miente.
3. **`docs/DECISIONES.md` es append-only**: nunca se edita hacia atrás. Cada
   decisión relevante se registra ahí (qué, cuándo, por qué, alternativa descartada).
4. **Un chat por línea de trabajo.** Al abrir un chat nuevo: leer `CLAUDE.md` y
   `docs/`, confirmar en qué punto estamos, y continuar. Ningún chat parte de cero.
5. **Antes de tocar la marca o el copy**, consultar `docs/GUIA-DE-MARCA.md`.
   Las palabras prohibidas son prohibidas de verdad.

## Agentes disponibles

- **`growth-content`** — experto en growth marketing y creación de contenido
  de vídeo. Genera guiones, ganchos y copy de vídeos (Reels, in-feed, Stories)
  para Facebook e Instagram, optimizados para consideración y conversión, con
  la voz de marca. Definición en `.claude/agents/growth-content.md`.

## Comandos útiles

```bash
npm run dev      # landing en http://localhost:3000
npm run build    # comprobar que compila antes de commitear
```

Despliegue del backend: ver [`docs/FASE1-SETUP.md`](docs/FASE1-SETUP.md).

## Rama de trabajo

Desarrollo en `claude/a-tu-paso-landing-px80gh`. `main` es lo que está en
producción. Nunca se hace push directo a `main`: se fusiona por Pull Request.
