# Fase 1 — Puesta en marcha del backend

Guía paso a paso para dejar funcionando el núcleo: base de datos, webhooks
de Stripe y WhatsApp, y el envío diario automático. Pensada para seguirla
sin saber programar, con calma. Son cuatro bloques; solo el D depende de
que Meta verifique tu empresa (empieza el bloque C cuanto antes por eso).

---

## A. Crear la base de datos (Supabase) — 20 min

1. Entra en **https://supabase.com** → "Start your project" → crea cuenta
   (puedes usar tu GitHub).
2. **"New project"**:
   - Organización: la tuya. Nombre: `atupaso`.
   - Database password: genera una y **guárdala** en un sitio seguro.
   - **Region: elige una de la UE** (p. ej. *West EU (Ireland)*). Importante
     por protección de datos (RGPD).
3. Cuando el proyecto termine de crearse, ve al menú izquierdo →
   **SQL Editor** → "New query".
4. Abre el archivo `supabase/migrations/20260712000001_schema.sql` de este
   repositorio, copia TODO su contenido, pégalo en el editor y pulsa **Run**.
   Debe decir "Success".
5. Repite lo mismo con `20260712000002_functions.sql`.
6. Repite con `supabase/seed.sql` (esto carga niveles, 45 ejercicios y
   plantillas).
7. La migración `20260712000003_cron.sql` déjala para el final del bloque B
   (necesita datos que aún no tienes).

## B. Desplegar las funciones — 30 min

Las tres funciones (webhook de Stripe, webhook de WhatsApp y el
despachador de mensajes) se despliegan con la herramienta de Supabase
desde tu ordenador:

1. Instala la CLI de Supabase: en tu terminal (la misma que usaste para
   `npm run dev`):
   ```
   npm install -g supabase
   ```
2. Desde la carpeta del proyecto:
   ```
   supabase login
   supabase link --project-ref TU_PROJECT_REF
   ```
   (El `project-ref` aparece en Supabase → Settings → General, es un código
   tipo `abcdefghijklmno`.)
3. Guarda los secretos que usarán las funciones:
   ```
   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...   (lo tendrás en el bloque C)
   supabase secrets set WA_ACCESS_TOKEN=...               (lo tendrás en el bloque D)
   supabase secrets set WA_VERIFY_TOKEN=una-frase-larga-que-tu-inventes
   ```
4. Despliega:
   ```
   supabase functions deploy stripe-webhook
   supabase functions deploy wa-webhook
   supabase functions deploy dispatcher
   ```
5. **Activa los relojes** (pg_cron): abre
   `supabase/migrations/20260712000003_cron.sql`, sustituye `<PROJECT_REF>`
   por el tuyo, ejecuta antes en el SQL Editor:
   ```sql
   select vault.create_secret('TU_SERVICE_ROLE_KEY', 'service_role_key');
   ```
   (la service role key está en Settings → API) y después pega y ejecuta la
   migración entera.

## C. Conectar Stripe — 15 min

1. Panel de Stripe → **Desarrolladores → Webhooks → "Añadir destino"**.
2. URL del endpoint:
   `https://TU_PROJECT_REF.supabase.co/functions/v1/stripe-webhook`
3. Eventos a escuchar (busca y marca exactamente estos cuatro):
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
4. Al crearlo, Stripe te da un **"Secreto de firma"** (`whsec_...`):
   guárdalo con `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...` y
   vuelve a ejecutar `supabase functions deploy stripe-webhook`.
5. Prueba: haz un pago de test en tu web (`4242 4242…`). En Supabase →
   **Table Editor → users** debe aparecer el usuario creado solo. 🎉

## D. Conectar WhatsApp (Meta) — el que más tarda, empieza YA

1. **Cuenta Meta Business**: https://business.facebook.com → crea el
   negocio "A Tu Paso" y completa la **verificación de empresa**
   (Configuración → Centro de seguridad → Iniciar verificación). Pide
   documentación del negocio y puede tardar días: es el cuello de botella.
2. **App de WhatsApp**: https://developers.facebook.com → "Mis apps" →
   "Crear app" → tipo "Empresa" → añade el producto **WhatsApp**.
3. **Número**: en WhatsApp → "Configuración de la API", añade tu número
   dedicado (uno nuevo; NO tu personal). Copia dos cosas:
   - el **Identificador del número de teléfono** (`phone_number_id`), y
   - el **token de acceso permanente** (crea un usuario de sistema en
     Meta Business → Configuración → Usuarios del sistema → genera token
     con permiso `whatsapp_business_messaging`).
4. Guarda el token: `supabase secrets set WA_ACCESS_TOKEN=...` y el número
   en la base de datos: SQL Editor →
   ```sql
   update app_config set value = '"EL_PHONE_NUMBER_ID"'
   where key = 'wa_phone_number_id';
   ```
5. **Webhook**: en la app de Meta → WhatsApp → Configuración → Webhook:
   - URL: `https://TU_PROJECT_REF.supabase.co/functions/v1/wa-webhook`
   - Token de verificación: la misma frase que pusiste en `WA_VERIFY_TOKEN`.
   - Suscríbete al campo **messages**.
6. **Plantillas**: en el Administrador de WhatsApp (Meta Business) →
   Plantillas de mensaje → crea estas seis, en español, categoría
   **Utilidad** (Meta tarda minutos-horas en aprobarlas). El texto debe
   coincidir con el de `supabase/seed.sql`, con las variables numeradas:

   | Nombre en Meta | Variables |
   |---|---|
   | `atupaso_bienvenida` | {{1}} nombre |
   | `atupaso_momento_diario` | {{1}} nombre, {{2}} ejercicio, {{3}} versión fácil, {{4}} versión viva |
   | `atupaso_vuelta_amable` | {{1}} nombre, {{2}} días |
   | `atupaso_pago_fallido` | {{1}} nombre |
   | `atupaso_despedida` | {{1}} días |
   | `atupaso_reactivacion` | {{1}} nombre, {{2}} días |

## E. Comprobar que todo el circuito funciona

1. Pago de prueba en la web → usuario aparece en `users` y en un minuto
   le llega la **bienvenida** por WhatsApp (plantilla).
2. Responde al mensaje → en `messages` aparece la respuesta y
   `last_inbound_at` se actualiza.
3. Onboarding (Fase 1 es manual): decides el nivel con sus 3 respuestas y
   lo asignas en SQL Editor:
   ```sql
   select fn_transition_journey('ID_DEL_USUARIO', 'en_analisis', 'onboarding manual');
   select fn_assign_initial_level('ID_DEL_USUARIO', 3);  -- 0-2 sentado, 3-4 de pie, 5-6 activo
   select fn_transition_journey('ID_DEL_USUARIO', 'activo', 'onboarding manual');
   ```
4. Mañana a las ~8:00 le llegará su primer **momento de hoy** solo. Si
   responde "Hecho", el sistema le contesta celebrando y su contador sube.
   Todo sin tocar nada.

## Qué queda para la Fase 2

- Onboarding 100 % automático (el paso 3 de arriba deja de ser manual).
- Metabase (dashboard) y avisos a tu móvil cuando haya alertas.
- Afinar umbrales de nivel/inactividad con datos reales.
