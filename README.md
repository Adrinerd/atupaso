# A Tu Paso — Landing

Landing page de **A Tu Paso**: un servicio de suscripción que envía cada día,
por WhatsApp, una pequeña acción de salud de unos 3 minutos, pensada para
personas de 55 a 75 años que quieren volver a moverse poco a poco.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- Stripe Checkout (suscripción mensual) — _se integra en la Fase 2_
- Preparado para desplegar en [Vercel](https://vercel.com)

## Ejecutar en local

Necesitas Node.js 18.18 o superior (recomendado: Node 20+).

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

Para comprobar la build de producción:

```bash
npm run build
npm start
```

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx          # Tipografías, SEO, JSON-LD, esqueleto HTML
│   ├── page.tsx            # La landing (composición de secciones)
│   ├── globals.css         # Sistema de diseño (colores, tipografía, a11y)
│   ├── api/checkout/       # Ruta de suscripción (Stripe en la Fase 2)
│   ├── aviso-legal/        # Página legal (plantilla, completar datos)
│   └── privacidad/         # Política de privacidad (plantilla)
├── components/
│   ├── sections/           # Las 8 secciones de la landing
│   ├── ui/                 # Piezas reutilizables (Button, Container)
│   ├── WhatsAppPreview.tsx # Vista previa del mensaje diario
│   └── icons.tsx           # Iconografía propia de la marca
├── content/
│   └── faq.ts              # Preguntas frecuentes (landing + JSON-LD)
└── lib/
    └── site.ts             # Configuración central (precio, nombre, rutas)
```

## Marca

| Rol       | Color               | Uso                                        |
| --------- | ------------------- | ------------------------------------------ |
| Principal | `#7A9E7E` salvia    | Superficies y acentos (tonos oscuros para texto/botones, por contraste AA) |
| Acento    | `#D98E73` terracota | Detalles cálidos                           |
| Fondo     | `#F5F1E8` crema     | Nunca blanco puro                          |
| Texto     | `#33302B` tinta     | Nunca negro absoluto                       |

Tipografías: **Fraunces** (titulares) e **Inter** (texto), servidas con
`next/font`. El cuerpo de texto parte de 18 px.

## Pendiente (próximas fases)

- **Fase 2**: Stripe Checkout, captura del número de WhatsApp, páginas de
  gracias y cancelado, `.env.example`.
- **Fase 3**: despliegue en Vercel, dominio y configuración de Stripe en
  producción.
- Completar los datos del titular en `aviso-legal` y `privacidad`.
- Sustituir `hola@atupaso.es` por el correo definitivo en `src/lib/site.ts`.
