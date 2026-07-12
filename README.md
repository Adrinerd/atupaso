# A Tu Paso — Landing

Landing page de **A Tu Paso**: un servicio de suscripción que envía cada día,
por WhatsApp, una pequeña acción de salud de unos 3 minutos, pensada para
personas de 55 a 75 años que quieren volver a moverse poco a poco.

## Stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Stripe Checkout](https://stripe.com/es/payments/checkout) (suscripción mensual de 6,95 €)
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

## Configurar Stripe (pagos)

La landing funciona sin Stripe, pero el botón de suscripción necesita dos
variables de entorno para redirigir a la pasarela de pago:

1. Copia `.env.example` a `.env.local`.
2. Rellena `STRIPE_SECRET_KEY` y `STRIPE_PRICE_ID` siguiendo las
   instrucciones comentadas dentro del propio archivo.
3. Reinicia `npm run dev`.

Para probar sin cobrar de verdad, usa las claves de **modo test** y la
tarjeta de prueba `4242 4242 4242 4242` (cualquier fecha futura y CVC).

El número de WhatsApp se captura durante el propio pago: Stripe pide el
teléfono del comprador (validado) y un campo opcional recoge el número de
la persona que recibirá los mensajes cuando es un regalo. Todo queda en el
panel de Stripe, que es la fuente de verdad de suscriptores.

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx          # Tipografías, SEO, JSON-LD, esqueleto HTML
│   ├── page.tsx            # La landing (composición de secciones)
│   ├── globals.css         # Sistema de diseño (colores, tipografía, a11y)
│   ├── api/checkout/       # Crea la sesión de Stripe Checkout y redirige
│   ├── gracias/            # Vuelta de un pago completado
│   ├── cancelado/          # Vuelta de un pago cancelado o fallido
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

- **Fase 3**: despliegue en Vercel, dominio y configuración de Stripe en
  producción.
- Más adelante: webhooks de Stripe, envío real por WhatsApp (API) y base de
  datos de suscriptores.
- Completar los datos del titular en `aviso-legal` y `privacidad`.
- Sustituir `hola@atupaso.es` por el correo definitivo en `src/lib/site.ts`.
