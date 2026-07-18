# Plan de negocio — A Tu Paso

> Documento maestro de negocio. Recoge la lógica económica, el foco
> estratégico y el orden de ejecución que minimiza riesgo. Complementa a
> `PROYECTO.md` (qué es) y `ARQUITECTURA.md` (cómo se construye).
>
> Nota de nombre: este plan nació con el nombre provisional "Tresminutos".
> La marca final es **A Tu Paso** (ver `DECISIONES.md`).

## 1. Resumen ejecutivo

Servicio de suscripción que envía, cada día por WhatsApp, una pequeña acción
de salud de 3 minutos ("tu momento de hoy") para personas mayores, no
deportistas y sedentarias: un público mal atendido por la cultura del gimnasio
y la industria del fitness. No exige ir a ningún sitio, descargar nada ni
cambiar de vida: llega como un mensaje amable, se responde en el mismo chat, y
un sistema de progreso mantiene el enganche sin la manipulación agresiva que
aleja a este público.

Es un producto digital operado por una sola persona, con infraestructura
ligera (landing + Stripe + WhatsApp Business API), pensado para generar
ingresos recurrentes y, si escala, ser adquirible por su base de suscriptores,
su método probado y sus datos de retención.

## 2. El problema

Existe un hueco real entre "no hago nada por mi salud" y "la cultura de
gimnasio intimidante". El público objetivo está mal servido precisamente
porque el fitness le habla mal: le vende cuerpos que no quiere y un lenguaje
que lo expulsa. La barrera no es física, es **emocional y de fricción**. Nadie
le ofrece algo pequeño, respetuoso, sin juicio y sostenible en el tiempo.

## 3. La solución

Una acción diaria de 3 minutos, entregada por WhatsApp, que:

- Pide un gesto mínimo y alcanzable (movilidad, equilibrio, respiración, un
  hábito saludable simple).
- Se responde en el propio chat ("responde cuando lo hagas"), lo que genera
  enganche y, técnicamente, **abre la ventana gratuita de conversación de
  WhatsApp**.
- Acumula progreso (días, camino) comunicado por mensaje, no dentro de una app.
- Ayuda a desarrollar hábitos que esta persona no desarrollaría de otro modo,
  mejorando su salud y calidad de vida sin la cultura "gym heavy".

El canal es WhatsApp porque el público ya vive ahí: cero fricción de adopción,
nada que instalar, y una experiencia que se siente como el mensaje de un
familiar, no como una app.

## 4. Por qué NO hay app (decisión de diseño)

Se descarta deliberadamente la app nativa. Para este público, una app añade
fricción (descargas, permisos, actualizaciones) —justo la barrera que WhatsApp
evita—. La autoridad de la marca no viene del formato, sino de la experiencia y
de una landing profesional. Una app exigiría tiendas de Apple/Google,
revisiones y mantenimiento en dos plataformas: un lastre desproporcionado para
un operador solo. La app queda reservada para el futuro, solo si una masa de
usuarios que ya paga la pide y existe una función que WhatsApp no cubra.

## 5. Modelo de negocio

- **Ingreso principal:** suscripción mensual recurrente (**6,95 €/mes**),
  gestionada automáticamente por Stripe.
- **Ingresos futuros posibles:** afiliación con productos/servicios de salud
  relevantes, directorio de proveedores vetados, y —vía B2B— venta a
  residencias, centros de día o aseguradoras que tienen a este público cautivo
  y con presupuesto.
- **Punto crítico de la economía:** WhatsApp cobra por cada mensaje que tú
  inicias (la acción diaria). El precio de la suscripción debe cubrir con
  holgura el coste de mensajería por usuario/mes. Las respuestas del usuario
  abren una ventana de servicio gratuita, así que **el diseño que provoca
  respuesta es también el que abarata la factura**: engagement y coste están
  alineados.

## 6. Arquitectura técnica (resumen)

Landing con dominio propio + Stripe Checkout recurrente + WhatsApp Business
Cloud API (Meta) + motor de automatización sobre base de datos (Supabase) que
une todo por eventos: pago confirmado → alta → programa el envío diario →
registra respuestas → calcula nivel → dispara mensajes. Un negocio automatizado
operable por una persona, sin app y sin envíos manuales.

> El diseño técnico completo (esquema, estados, workflows, escalado) vive en
> [`ARQUITECTURA.md`](ARQUITECTURA.md). Nota: frente a la idea inicial de usar
> un BSP (360dialog/Twilio), se decidió ir directo con la Cloud API de Meta
> (ver `DECISIONES.md`).

## 7. El embudo (flujo del usuario)

1. Ve el vídeo en Meta (paid + orgánico).
2. Llega a la landing (o click-to-WhatsApp).
3. Introduce su número y paga con Stripe.
4. Recibe su primer momento en WhatsApp.
5. A partir de ahí, todo ocurre en el chat: acción diaria, respuesta, progreso.

## 8. Defensibilidad (moat)

El canal y la accesibilidad no son defendibles: cualquiera puede montar un bot.
El moat real, que se construye con el tiempo, es triple:

- **Método probado:** qué acción, en qué orden, con qué tono, para este perfil.
  Conocimiento ganado operando, no copiable de un vistazo.
- **Datos de retención por microacción:** registrar qué se completa y qué se
  abandona genera un dataset que nadie más tiene. Base de la mejora continua y
  del atractivo para un comprador.
- **Distribución B2B:** relaciones con residencias, centros y aseguradoras que
  distribuyen el producto y sostienen la retención vía el entorno.

Estas tres capas son también lo que hace el negocio **adquirible**.

## 9. Riesgos y cómo se gestionan

- **Retención del público más difícil que existe.** Personas mayores y no
  deportistas tienen el churn estructural más alto. Mitigación: tono
  respetuoso, acciones mínimas y alcanzables, y la vía B2B donde el entorno
  sostiene el hábito.
- **Coherencia ética.** El enganche no debe convertirse en la manipulación que
  el propio producto critica. El diseño prioriza acompañamiento sobre presión.
  (De aquí sale la decisión de contador de días en vez de rachas.)
- **Coste por mensaje de WhatsApp.** Riesgo para el margen a escala.
  Mitigación: precio que cubra la mensajería, diseño que provoca respuestas
  (ventana gratuita) y tarifa sin markup.
- **Cumplimiento (health claims).** Mantenerse en educación y estilo de vida,
  nunca en tratamiento médico, para no heredar carga regulatoria.
- **WhatsApp castiga el envío no solicitado.** El contenido debe ser tan bueno
  que la gente lo quiera; opt-in limpio.
- **Riesgo mayor: construir antes de validar.** Ver plan de fases.

## 10. Presupuesto inicial (~500 €)

- Fase de validación: coste casi nulo (dominio, quizá plan básico).
- El grueso se reserva para **paid media al vídeo en Meta**, y solo se activa
  cuando ya se sabe que la acción engancha y que hay pagos. No se gasta por
  adelantado.

## 11. Plan de ejecución por fases (go-to-market)

> Estas fases son de **negocio/validación**, distintas de las fases técnicas
> del roadmap de `ARQUITECTURA.md`. El principio es validar demanda antes de
> automatizar.

- **Fase 1 — Cobro primero (validación real).** Landing + Stripe. En cuanto
  esté, ya se puede cobrar. Meter tráfico del vídeo y ver si alguien paga. Si
  nadie paga, te enteras aquí, barato. ✅ _Hecho: landing y Stripe en producción._
- **Fase 2 — Entrega manual con clientes de pago.** Los primeros días, aunque
  el cobro sea automático, enviar la acción a mano a los pocos que paguen.
  Coste cero, confirma el engagement y afina contenido y tono.
- **Fase 3 — Automatización completa.** WhatsApp API + webhooks + niveles +
  logs, solo cuando la Fase 1 demuestre pagos reales. ✅ _Código listo
  (backend Fase 1); pendiente de desplegar._
- **Fase 4 — Escala y expansión.** Paid media serio, optimización del embudo y
  apertura de la vía B2B. La app nativa se evalúa solo aquí.

## 12. Métricas clave

- **Retención al día 14** (la señal madre: ¿siguen respondiendo?).
- **Conversión a pago y renovación al mes 2** (¿pagan el segundo mes?).
- **Coste por lead** del vídeo en Meta.
- **Coste de mensajería por usuario/mes vs. precio** (margen unitario).
- **Retención por microacción** (qué engancha, qué se abandona).

## 13. Principio rector

**No construir rápido, sino aprender rápido.** Cada pieza de automatización se
añade cuando el dolor operativo la pide y cuando la fase anterior ya demostró
demanda. La velocidad real del negocio es meter tráfico a la landing cuanto
antes y dejar que Stripe diga la verdad sobre si alguien paga el mes 2.
