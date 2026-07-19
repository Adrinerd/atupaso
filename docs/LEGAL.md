# Aspectos legales — A Tu Paso (España)

> ⚠️ **Este documento es orientación práctica, no asesoramiento legal ni
> fiscal profesional.** Está escrito para tomar decisiones informadas en fase
> MVP y saber cuándo consultar a un gestor/abogado. Las cifras (cuotas, SMI)
> son orientativas y cambian cada año: verifícalas antes de actuar.

## El enfoque en dos fases

La lógica es la misma que en el resto del proyecto: **cumplir lo esencial
desde el día 1 (que además es casi gratis), y aplazar lo caro hasta que el
negocio demuestre que existe.** Lo que no hacemos es ignorar obligaciones:
las conocemos, decidimos con riesgo medido y lo documentamos.

---

## FASE LEGAL 1 — Ahora (MVP, primeros clientes)

### 1.1 La web (obligatorio ya, coste 0 €)

Una web que **cobra** en España debe tener, por la LSSI-CE y la normativa de
consumo:

| Pieza | Estado | Qué falta |
|---|---|---|
| **Aviso legal** (identifica al titular: nombre, NIF, domicilio, email) | ✅ Plantilla en `/aviso-legal` | Rellenar tus datos reales |
| **Política de privacidad** (RGPD: qué datos, para qué, derechos) | ✅ Plantilla en `/privacidad` | Rellenar responsable |
| **Condiciones de contratación** (precio, renovación, cancelación, desistimiento) | ✅ Plantilla en `/condiciones` | Rellenar titular y revisar |
| **Banner de cookies** | ✅ **No hace falta** | Nada — la web no usa cookies de rastreo ni analítica. Mantenerlo así (si algún día añades Google Analytics, tocará banner; mejor una analítica sin cookies tipo Plausible/Vercel) |

Notas importantes:

- **Sí, tu nombre y NIF tienen que aparecer** en el aviso legal aunque seas
  un particular haciendo un MVP: quien vende se identifica. Es lo que más
  pereza da y lo más básico que mirará cualquiera (incluida una inspección).
- **Derecho de desistimiento**: en suscripciones digitales el consumidor
  tiene 14 días naturales. Con nuestro modelo (sin permanencia, cancelas
  cuando quieras y ya está) cumplirlo es trivial: ante cualquier queja en
  los primeros 14 días, se reembolsa y listo. La plantilla de condiciones lo
  recoge.
- **Renovación automática**: hay que informarla claramente antes del pago
  (la landing ya lo hace: "6,95 €/mes · sin permanencia · cancelas cuando
  quieras") y en las condiciones.
- **No somos servicio sanitario**: el descargo ya está en FAQ, aviso legal y
  método. Mantener siempre: educación y hábitos, nunca diagnóstico ni
  tratamiento. Esto nos deja fuera de la regulación sanitaria.

### 1.2 RGPD en fase manual (coste 0 €)

- Base jurídica del envío diario: **ejecución del contrato** (el servicio ES
  recibir el mensaje). No hace falta consentimiento adicional para eso; sí
  lo haría falta para marketing (que no hacemos).
- **Minimización con datos de salud**: ya es política de producto (ver
  `ARQUITECTURA.md` §0.4): no construimos perfiles médicos; las menciones de
  salud generan atención humana, no fichas.
- En modo concierge usas tu WhatsApp personal: los chats con clientes son
  datos personales → no los compartas, no hagas capturas públicas, y cuando
  pases a Fase 3, la conversación "oficial" quedará en la BD (región UE).
- El **registro de actividades de tratamiento** (documento interno RGPD) es
  exigible pero es un documento que puedes tener hecho en una hora con
  plantilla; está en la lista de la Fase Legal 2 con plantilla pendiente.

### 1.3 Hacienda: la parte que NO conviene saltarse

Aquí está la distinción clave que mucha gente confunde. Son **dos altas
distintas**:

**a) Alta censal en Hacienda (modelo 036) — GRATIS.** Es "decirle a Hacienda
que tienes una actividad económica". Sin ella, técnicamente no puedes
facturar ni ingresar el IVA que ya estás cobrando (el precio de 6,95 € lleva
IVA del 21 % dentro). Es un formulario online, no cuesta nada, no te obliga
a pagar autónomos, y te pone en regla con lo básico.

> **Recomendación: hazla cuando cobres a tu primer cliente real** (los pagos
> de prueba con tu propia tarjeta no cuentan). Coste 0, riesgo eliminado.

Consecuencias de estar de alta censal: presentar IVA trimestral (modelo 303)
e incluir los ingresos en tu IRPF (con tu nómina, tributarán a tu tipo
marginal). Con 10 clientes son importes ridículos, pero se declaran. Un
gestor puede llevarte esto por 30-60 €/mes cuando el volumen lo justifique;
al principio puedes presentarlos tú (son cifras diminutas).

**b) Alta en autónomos / RETA (Seguridad Social) — ESTO es lo caro** (cuota
mensual). Aquí está la zona gris famosa:

- La ley exige alta en RETA cuando la actividad es **"habitual"**.
- Existe jurisprudencia consolidada (Tribunal Supremo) que interpreta que
  ingresos por debajo del **SMI anual** (~16.000 €/año, cifra orientativa)
  son un indicio de NO habitualidad. Mucha gente factura pequeñas cantidades
  solo con el alta censal, sin RETA, apoyándose en esa doctrina.
- **Esto no es una exención escrita en la ley: es una interpretación.**
  La Seguridad Social podría reclamar el alta (con cuotas atrasadas). En la
  práctica, con ingresos de decenas o pocos cientos de euros al mes, el
  riesgo real es bajo y esta es la vía que usa casi todo el mundo para
  validar — pero decide sabiéndolo, no creyendo que es 100 % seguro.
- A tu favor además: estás empleado (**pluriactividad**) — ya cotizas a la
  Seguridad Social por tu trabajo, lo que refuerza el argumento de actividad
  marginal y, cuando te des de alta, te da bonificaciones propias.

> **Recomendación honesta:** MVP con alta censal (a) y sin RETA (b) mientras
> los ingresos sean claramente marginales (< unos cientos de €/mes),
> sabiendo que es zona gris. En cuanto la curva suba o quieras dormir 100 %
> tranquilo: alta en RETA con **tarifa plana** (~80-90 €/mes el primer año,
> verificar cifra vigente).

### 1.4 Tu contrato de trabajo (5 minutos, importante)

Revisa si tu contrato tiene cláusula de **exclusividad** o de no
competencia. Si no la hay (lo normal), puedes tener actividad propia fuera
de tu horario sin permiso de la empresa, siempre que no compitas con ella ni
uses sus medios. Si la hay, valórala antes de facturar nada.

### 1.5 Stripe

Stripe te pedirá datos fiscales al activar pagos reales; como "individual/
autónomo" con tu NIF es suficiente para empezar. Los recibos que Stripe
envía valen como justificante; la factura formal solo si un cliente la pide
(simplificada, con tus datos del alta censal).

---

## FASE LEGAL 2 — Al validar (ingresos recurrentes creciendo)

En orden de prioridad:

1. **Alta en RETA** con tarifa plana + bonificación de pluriactividad si
   aplica. El disparador razonable: ingresos sostenidos varios meses o
   superar unos cientos de €/mes.
2. **Gestor** (30-60 €/mes): IVA, IRPF, y que el 036 esté fino. Se paga solo
   en tiempo ahorrado.
3. **Revisión profesional de los textos legales** (aviso, privacidad,
   condiciones) por abogado: 150-400 € una vez. Las plantillas del repo son
   dignas para MVP, no blindaje definitivo.
4. **Registro de actividades de tratamiento RGPD** + lista de encargados
   (Stripe, Supabase, Vercel, Meta cuando llegue) con sus DPAs. Una hora con
   plantilla.
5. **Consentimiento de términos en el checkout**: activar en Stripe la
   casilla de aceptación de condiciones (`consent_collection`) — cambio de
   código de 5 minutos, ya previsto.
6. **Seguro de responsabilidad civil** (~150-300 €/año): barato y prudente
   para un servicio de actividad física con mayores, aunque el riesgo real
   de nuestros ejercicios sea mínimo.
7. **Registrar la marca "A Tu Paso"** en la OEPM (~150 € una clase, 10
   años): la marca es parte del moat; protégela cuando el negocio respire.
8. **¿Sociedad (SL)?** Solo con ingresos serios (orientativamente >40-50
   k€/año) o si entra un socio/inversión. Antes de eso, autónomo es más
   simple y barato. La vía B2B (residencias) sí suele empujar a SL.

---

## Chuleta: qué hacer y cuándo

| Momento | Acción | Coste |
|---|---|---|
| **Ya** | Rellenar datos reales en `/aviso-legal`, `/privacidad`, `/condiciones` | 0 € |
| **Ya** | Revisar contrato laboral (exclusividad) | 0 € |
| **Primer cliente real** | Alta censal (modelo 036) online | 0 € |
| **Cada trimestre** | Modelo 303 (IVA) — importes mínimos | 0 € (tu tiempo) |
| **Renta anual** | Incluir ingresos en IRPF | según tu tipo |
| **Ingresos sostenidos** | RETA tarifa plana + gestor | ~80-90 + 30-60 €/mes |
| **Al escalar** | Revisión legal, seguro RC, marca OEPM | ~500-800 € una vez |

## Los tres errores que sí serían graves (evitarlos siempre)

1. **Cobrar sin identificarte en la web** (aviso legal vacío): es lo primero
   que se sanciona y lo más fácil de arreglar.
2. **Prometer resultados de salud o aconsejar médicamente**: nos sacaría del
   terreno "educación/bienestar" al terreno regulado sanitario. La marca ya
   lo prohíbe; que siga así.
3. **Ignorar el IVA cobrado**: el precio incluye un 21 % que no es tuyo. Con
   alta censal y el 303 trimestral, resuelto — y son importes pequeños.

---

*Documento vivo. Cuando se ejecute una acción de esta lista, márcala aquí en
el mismo commit. Ante cualquier duda con dinero real en juego: gestor.*
