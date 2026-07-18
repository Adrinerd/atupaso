# Operación manual (Fase 2) — el manual del operador

> Cómo se opera A Tu Paso en modo concierge: tú envías los WhatsApps con tu
> propia app; el sistema prepara, recuerda y registra. Unos 10-15 minutos al
> día con 5-20 clientes.

## Qué necesitas tener montado (una sola vez)

1. **Supabase desplegado** — bloques A, B y C de [`FASE1-SETUP.md`](FASE1-SETUP.md)
   (base de datos + funciones + webhook de Stripe).
   **El bloque D (Meta/WhatsApp API) NO hace falta**: es de la Fase 3.
2. **Tres variables nuevas en Vercel** (Settings → Environment Variables):
   `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (Supabase → Settings → API) y
   `OPERATOR_PASSWORD` (invéntala). Redeploy después de guardarlas.
3. Tu WhatsApp de siempre (o un número aparte si prefieres separar; da igual
   para el sistema, porque el envío lo haces tú).

## La rutina diaria (mañana, con el café)

1. Abre **`atupaso.vercel.app/operador`** e inicia sesión.
2. **Guion de hoy**: el sistema ha preparado un mensaje por cada usuario
   activo (su momento del día, según su nivel). Para cada uno:
   - Pulsa **Copiar mensaje** → pégalo en su chat de WhatsApp → envía.
   - Pulsa **Marcar enviado** (esto lo registra en la base de datos).
3. A lo largo del día, cuando alguien conteste, vuelve al panel y en
   **Respuestas** pulsa el botón que toque: *Hecho · Con ayuda · Le fue
   fácil · Le costó · No respondió*. El contador de días y las señales de
   progresión se actualizan solos, y la respuesta de vuelta (celebración o
   sin culpa) aparece arriba en el guion para que la copies y envíes.
4. Si hay alguien en **Nuevos**: hazle por WhatsApp las preguntas del
   cuestionario (están en el propio panel), marca sus respuestas y pulsa
   **Asignar nivel y activar**. Mañana el sistema le preparará su primer
   momento solo.
5. **Alertas**: si alguien mencionó dolor/salud o hay un pago fallido, sale
   aquí. Atiéndelo en persona y márcalo resuelto.

Eso es todo. El alta de clientes (Stripe), la elección del ejercicio de cada
día, el contador, los niveles y el historial: todo automático. Tú solo eres
el mensajero — y los ojos y el corazón del servicio, que en esta fase es
exactamente lo que queremos.

## Por qué merece la pena hacerlo así (recordatorio)

- Validas **retención real** (¿responden al día 14? ¿renuevan el mes 2?)
  antes de pagar la complejidad de Meta.
- Cada registro que haces construye el **dataset de retención por ejercicio**
  — el moat del negocio — idéntico al que generará la automatización.
- Aprendes el tono real de tus clientes, que afinará plantillas y Método.

## Cuándo pasar a la Fase 3 (automatizar el canal)

Cuando el criterio de salida del [`ROADMAP.md`](ROADMAP.md) se cumpla
(retención día 14 + renovaciones mes 2), se hace el bloque D de
`FASE1-SETUP.md` y se cambia un valor en la base de datos:

```sql
update app_config set value = '"meta"' where key = 'channel_mode';
```

Desde ese momento el dispatcher envía solo y el webhook escucha solo. El
panel sigue funcionando como supervisión.
