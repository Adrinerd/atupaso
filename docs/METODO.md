# El Método A Tu Paso — Sistema de ejercicio y progresión

> **Versión 0.1 — borrador para discusión.** Este documento es el core del
> producto: qué ejercicios enviamos, a quién, en qué orden, y cómo decide el
> sistema que alguien progresa. Está escrito con criterio de especialista en
> ejercicio para personas mayores, siendo crítico con nuestras propias
> limitaciones. Se iterará antes de considerarse definitivo; los cambios que
> exija en la base de datos están listados al final (§13) y no se implementan
> hasta aprobar el diseño.

---

## 1. Principios rectores (el porqué antes del qué)

1. **Adherencia primero, capacidad después.** En este público, el mejor
   programa no es el que más mejora por sesión: es el que la persona sigue
   haciendo en el mes 4. Toda decisión de diseño se subordina a esto. Un
   ejercicio óptimo que se abandona vale cero; uno modesto que se repite 300
   días cambia una vida.
2. **Empezar siempre demasiado fácil.** El coste de empezar bajo es
   aburrimiento leve durante una semana (recuperable). El coste de empezar
   alto es dolor, miedo o fracaso (a menudo terminal: este público no
   reintenta, confirma que "esto no es para mí"). Ante la duda, **siempre el
   nivel inferior**.
3. **Lo funcional manda.** No entrenamos músculos, entrenamos *vida*:
   levantarse del sofá, subir escaleras, agacharse a coger algo, no caerse,
   llegar caminando. Cada ejercicio del catálogo existe porque transfiere a
   un gesto de la vida real, y ese gesto se comunica ("esto te sirve para…").
4. **La seguridad es arquitectura, no letra pequeña.** Las reglas de dolor,
   los apoyos en equilibrio y las señales de alarma están integradas en el
   contenido de cada mensaje, no en un descargo legal.
5. **Honestidad de dosis.** Tres minutos al día no cumplen las
   recomendaciones de la OMS (150 min/semana + fuerza + equilibrio). No lo
   fingiremos. Tres minutos son (a) la **puerta de entrada** que rompe la
   barrera emocional, (b) una dosis que **sí produce mejoras medibles en
   personas desacondicionadas** (en sedentarios, el salto de 0 a algo es el
   más rentable de toda la curva dosis-respuesta), y (c) un **hábito ancla**
   sobre el que crecer. El método está diseñado para que la dosis real crezca
   con la persona sin que se le exija.

## 2. Marco científico (en qué nos apoyamos)

Las capacidades que predicen independencia, calidad de vida y mortalidad en
55-75 años están bien establecidas en la literatura geriátrica y de ejercicio:

| Capacidad | Por qué importa | Referencia funcional que adaptamos |
|---|---|---|
| **Fuerza de piernas** | Predictor nº1 de independencia; levantarse de una silla es LA bisagra de la autonomía | Test de levantarse de la silla 30 s (CDC/STEADI, protocolo Rikli-Jones) |
| **Equilibrio** | Las caídas son el mayor riesgo real y el mayor miedo del público; el equilibrio se entrena y las revierte | Test de 4 posiciones (pies juntos → semi-tándem → tándem → una pierna) |
| **Capacidad de marcha** | La velocidad de la marcha es el "sexto signo vital"; caminar es el ejercicio con más evidencia total | Minutos de marcha continua sin parar |
| **Movilidad articular** | Tobillo, cadera y hombro rígidos degradan la marcha, las escaleras y el vestirse | Rangos funcionales por gesto (agacharse, girarse, alcanzar) |
| **Fuerza de agarre** | Proxy validado de fuerza global y fragilidad; además es práctica (botes, barandillas) | Gestos de agarre cotidianos |
| **Función respiratoria y calma** | Regula el esfuerzo percibido, reduce ansiedad al ejercicio, mejora el sueño | Respiración diafragmática, ritmos espiración > inspiración |
| **Carga ósea** | Osteopenia/osteoporosis: el hueso responde a impacto suave y a la fuerza | Impactos de talón dosificados (niveles 2-3) |
| **Levantarse del suelo** | Doble función: autonomía + supervivencia tras una caída (quedarse en el suelo horas es lo que mata) | Transferencia al suelo por etapas (nivel 3) |

Dos apuntes críticos del especialista:

- **El equilibrio solo mejora si se desafía**, y desafiarlo implica riesgo.
  Nuestra resolución: en niveles 1-2 el equilibrio se trabaja SIEMPRE con
  apoyo disponible (silla/encimera/pared a un palmo), y la progresión reduce
  el apoyo (dos manos → una → un dedo → sin tocar), nunca lo elimina de
  entrada. Jamás ojos cerrados fuera del nivel 3, y aun ahí, opcional.
- **La fuerza requiere intensidad suficiente.** El error típico de los
  programas "suaves" para mayores es quedarse eternamente en gimnasia de
  mantenimiento que no genera adaptación. Nuestra resolución: el tempo lento,
  las pausas isométricas y la reducción de apoyo permiten alcanzar intensidad
  efectiva sin material y sin impacto. "Suave" en tono, no en estímulo.

## 3. Los cinco dominios de trabajo

Todo momento pertenece a un dominio. La rotación semanal entre dominios es la
que garantiza un programa completo aunque cada día sean solo 3 minutos.

1. **Fuerza** — piernas sobre todo (sentarse/levantarse, subir), también
   empuje, tracción y agarre.
2. **Equilibrio** — estático y dinámico, siempre con apoyo decreciente.
3. **Movilidad** — tobillo, cadera, columna, hombro; rangos que la vida pide.
4. **Marcha** *(nuevo dominio propuesto)* — caminar como ejercicio con dosis
   propia: duración continua, ritmo, cuestas, escaleras. Es el dominio con
   más evidencia y el más natural para este público; merece identidad propia
   y no diluirse en "fuerza".
5. **Respiración y calma** — diafragmática, ritmos, descarga de tensión.
   También cumple función de "día fácil" (recuperación percibida) y de
   pequeño regalo (la marca).

## 4. El mapa: 3 niveles × 3 fases = 9 etapas del camino

Tres niveles se quedan cortos para cubrir desde "no puedo levantarme de la
silla sin ayuda" hasta "estoy en forma y quiero mantenerme con poco tiempo".
Pero multiplicar niveles rompería la simplicidad (y el copy). La resolución
profesional: **mantener los 3 niveles como identidad visible** y añadir **3
fases internas por nivel** (A, B, C). Para el usuario, las fases son "etapas
de tu camino" con nombre cálido; para el sistema, son 9 escalones de
programación con criterios de entrada y salida.

### Nivel 1 — SENTADO ("Tus primeros pasos")

Perfil de entrada: no puede (o teme) levantarse de una silla sin usar las
manos; puede pasar la mayor parte del día sentado; posible miedo a caerse.

| Fase | Nombre para el usuario | Qué se trabaja | Criterio para pasar de fase |
|---|---|---|---|
| 1A | "Despertar el cuerpo" | Todo sentado: bombeos de tobillo, marcha sentada, fuerza de manos, respiración, movilidad de hombros/cuello | Completa ≥4 momentos/semana durante 2 semanas sin señales de dificultad sostenida |
| 1B | "La silla y tú" | El gesto rey: levantarse. Sentadilla asistida con manos, tempo lento, extensiones de rodilla, inclinaciones de tronco | Se levanta 5 veces seguidas usando las manos, sin dolor y sin ahogo |
| 1C | "De pie, con apoyo" | Primeros momentos de pie con dos manos apoyadas: puntillas, peso de un pie a otro, mini-marcha; sigue la fuerza sentada | **Puerta de nivel G1** (ver §7): 10 levantarse-sentarse en 30 s sin manos + 60 s de pie cómodo |

### Nivel 2 — DE PIE ("Tu cuerpo responde")

Perfil de entrada: se levanta sin manos (aunque cueste); puede estar de pie y
caminar por casa; el mundo de pie con apoyo cercano es su zona de trabajo.

| Fase | Nombre para el usuario | Qué se trabaja | Criterio para pasar de fase |
|---|---|---|---|
| 2A | "Suelo firme" | Equilibrio con apoyo (semi-tándem, un pie con mano apoyada), sentadilla a silla, puntillas, marcha 5-10 min | Un pie 10 s con un dedo de apoyo, cada lado; marcha 10 min continua |
| 2B | "Cada paso cuenta" | Reduce apoyo (un dedo), tándem, pasos laterales, escalón con barandilla, bisagra de cadera (recoger cosas del suelo), talones al suelo (hueso) | Tándem 15 s; 8 escalones seguidos con barandilla; marcha 15 min |
| 2C | "Más fuerte que ayer" | Sentadilla completa a silla con tempo 3-0-3, equilibrio sin tocar apoyo, carga (bolsa de la compra), marcha 20 min con tramos ligeros | **Puerta de nivel G2**: 12 levantarse-sentarse en 30 s + un pie 10 s sin apoyo cada lado + 15 min de marcha sin parar |

### Nivel 3 — ACTIVO ("A tu ritmo, más lejos")

Perfil de entrada: autonomía funcional completa; el objetivo es construir
reserva (fuerza, hueso, equilibrio fino) o mantenerla con eficiencia.

| Fase | Nombre para el usuario | Qué se trabaja | Criterio para pasar de fase |
|---|---|---|---|
| 3A | "Reserva" | Sentadillas libres, zancadas cortas, puente de cadera, transferencia al suelo asistida, un pie con giros de cabeza, marcha 20-30 min | 10 sentadillas libres tempo 3s; suelo y de vuelta con un apoyo |
| 3B | "Sólido" | Suelo sin apoyo, zancada plena, impactos de talón, carga asimétrica (maleta), tándem con ojos cerrados (opcional, junto a pared), cuestas/escaleras | 14+ levantarse-sentarse en 30 s; suelo sin apoyos; 30 min marcha con cuestas |
| 3C | "Mantenimiento eficiente" | El modo "estoy en forma y tengo poco tiempo": momentos de alta densidad (circuitos de 3 min), variedad amplia, énfasis en lo que la edad erosiona (potencia suave, equilibrio fino, hueso) | No hay salida: es el destino. El sistema sostiene y varía |

**Regla de identidad**: el usuario ve el nombre de su etapa y su número de
días. Nunca ve "1A" ni "nivel 2". El camino se cuenta como viaje, no como
puntuación (guía de marca).

## 5. Evaluación inicial (colocar a la persona en su escalón)

Cuestionario de onboarding por WhatsApp, 5 preguntas, lenguaje llano. Entre
paréntesis, la puntuación.

1. **"¿Puedes levantarte de una silla sin usar las manos?"**
   No, necesito ayuda o me da miedo (0) · Con esfuerzo, usando las manos (1)
   · Sí, sin problema (2)
2. **"¿Cuánto puedes caminar seguido, sin parar a descansar?"**
   Menos de 10 minutos (0) · Entre 10 y 30 (1) · Más de 30 (2)
3. **"¿Puedes sostenerte sobre un solo pie unos segundos, cerca de un apoyo?"**
   No / no me atrevo (0) · Unos pocos segundos (1) · Sí, con soltura (2)
4. **"En el último año, ¿te has caído o has sentido miedo de caerte?"**
   Sí (flag de precaución) · No
5. **"¿Tu médico te ha limitado el ejercicio por algo del corazón, mareos u
   otra causa?"** Sí (flag médico) · No

**Colocación** (suma de P1-P3, 0-6): 0-2 → Nivel 1 · 3-4 → Nivel 2 · 5-6 →
Nivel 3. Siempre en fase A del nivel asignado.

**Reglas críticas de colocación:**
- **Empate o duda → nivel inferior.** (Principio 2. Nadie se ofende porque la
  primera semana sea fácil; la marca convierte lo fácil en bienvenida.)
- **Flag de caídas** → entra una fase por debajo de lo que diga su puntuación
  (mínimo 1A) y su programación sobre-pondera equilibrio.
- **Flag médico** → mensaje específico: "consúltalo con tu médico antes de
  empezar; nuestros momentos son suaves, pero tu médico te conoce". No
  bloqueamos (no somos médicos ni al contrario), pero registramos el flag y
  el tono de sus momentos evita picos de intensidad.
- La colocación inicial es una hipótesis, no una sentencia: las 2 primeras
  semanas el sistema escucha señales con sensibilidad extra y corrige rápido.

## 6. Programación semanal (qué se envía cada día)

La rotación por dominios convierte 7 momentos sueltos en un programa. Patrón
canónico semanal por nivel (el motor lo aplica con flexibilidad, no como
calendario rígido):

| Día | Nivel 1 | Nivel 2 | Nivel 3 |
|---|---|---|---|
| 1 | Fuerza | Fuerza | Fuerza |
| 2 | Movilidad | Equilibrio | Marcha (ritmo) |
| 3 | Respiración | Marcha | Equilibrio fino |
| 4 | Fuerza | Fuerza | Fuerza |
| 5 | Equilibrio (sentado/apoyo) | Movilidad | Marcha (cuestas/escaleras) |
| 6 | Marcha suave (casa) | Marcha o hueso | Movilidad + hueso |
| 7 | Respiración / regalo | Respiración / regalo | Respiración / regalo |

Racionales: fuerza 2-3×/semana en días no consecutivos (síntesis proteica y
recuperación en mayores es más lenta); equilibrio 2×+ (la evidencia de
prevención de caídas pide frecuencia); el día 7 siempre es amable (ancla el
domingo como día de calma y baja la fricción percibida de "todos los días").

**Progresión de dosis dentro de una fase** (sin cambiar de ejercicio): el
motor tiene cinco diales, en este orden de uso: repeticiones (+2) → tempo
(más lento = más duro) → pausas isométricas (2-3 s) → rango (más profundo,
más lejos) → apoyo (menos manos). Así un mismo ejercicio dura 4-6 semanas
sin estancarse y sin necesitar material.

## 7. Progresión entre fases y niveles: señales, puertas y reglas

### 7.1 Las tres corrientes de información

1. **Señales diarias** (ya implementadas): `done`, `done_easier`,
   `done_harder`, `struggled`, ausencia de respuesta. Son ruidosas una a una;
   en ventanas de 7-14 días dibujan tendencia.
2. **Puertas funcionales ("hoy contamos")** — la pieza nueva clave: cada 2-3
   semanas, un momento del día ES un test disfrazado de momento normal:
   *"Hoy es especial: ¿cuántas veces puedes levantarte y sentarte en 30
   segundos, a tu ritmo? Cuéntalas y dímelo. Sea el número que sea, está
   bien."* El número reportado se guarda como medida objetiva (auto-informada)
   y alimenta las decisiones de nivel. Esto convierte los tests validados
   (Rikli-Jones, apoyo monopodal) en contenido gamificado: el usuario ve su
   propio número crecer con las semanas — la comparación es consigo mismo,
   nunca con otros.
3. **Palabra del usuario (override manual)**: "más fácil" / "más suave" se
   obedece HOY (el siguiente momento baja un escalón de dosis) y sin
   preguntas. "Quiero más" acelera la elegibilidad de subida. La autonomía
   percibida es adherencia; el sistema propone, la persona dispone.

### 7.2 Triggers de subida (fase o nivel)

Subir fase (dentro del nivel) requiere **las dos** condiciones:
- **Elegibilidad por señales**: en los últimos 14 días, ≥10 momentos
  completados y ≥4 con señal `done_harder` (hizo la variante viva), con 0
  señales de dolor.
- **Confirmación por puerta**: pasa el criterio de la fase (tabla §4) en un
  momento "hoy contamos".

Subir **nivel** (1→2, 2→3) exige además la puerta de nivel (G1/G2) y dispara
el mensaje de celebración de etapa. **Nunca se sube más de una fase de
golpe**, aunque los números lo permitieran: la adaptación de tejidos
(tendón, hueso) va semanas por detrás de la sensación de facilidad. Esta
regla anti-entusiasmo previene la lesión del "me encuentro genial".

### 7.3 Triggers de ajuste a la baja (nunca se llama "bajar")

- **Por señales**: ≥4 `struggled`/`done_easier` en 7 días → baja un escalón
  de dosis; si persiste otra semana → fase anterior. Mensaje: "vamos a afinar
  tus momentos" (guía de marca: jamás "bajas de nivel", jamás culpa).
- **Por ausencia (re-entrada)**: 4-7 días sin respuesta → se retoma con la
  misma fase pero dosis −1 y un momento amable. 8-21 días → fase anterior
  durante 1 semana. Más de 21 días → mini-reevaluación (2 preguntas del
  cuestionario) y colocación de nuevo, con el mensaje de que sus días
  acumulados siguen intactos. El desentrenamiento es fisiología, no fracaso,
  y el sistema lo trata como tal sin decírselo con esas palabras.
- **Por evento de salud** (mención de dolor/caída/médico → alerta humana ya
  implementada): el humano decide; el sistema por defecto pausa la
  progresión y ofrece momentos de respiración/movilidad suave mientras tanto.

### 7.4 Mantener (el estado por defecto)

Sin triggers activos, el sistema mantiene fase y progresa dosis con los cinco
diales. La variedad la garantiza la rotación de dominios y la biblioteca
amplia; el motor evita repetir ejercicio en 14 días (ya implementado).

### 7.5 Reglas anti yo-yo

Mínimo 2 semanas en una fase antes de subir; tras un ajuste a la baja,
mínimo 3 semanas antes de reevaluar subida; máximo un cambio de fase por
semana en cualquier dirección. Un sistema que oscila destruye la confianza
("esto no sabe lo que hace") y la adaptación fisiológica necesita tiempo de
permanencia.

## 8. Catálogo de ejercicios (biblioteca v0.1 ampliada)

Formato: **Nombre** — qué trabaja · dosis de partida · ↓ más suave · ↑ más
vivo · ⚠ seguridad si aplica · 🎯 para qué te sirve (transferencia que se
comunica al usuario). Los 45 ya sembrados en la BD están incluidos y
marcados con ◆; el resto amplía la biblioteca a ~95.

### NIVEL 1 — SENTADO (fases 1A-1C)

**Fuerza**
1. ◆ Levantarse de la silla (asistido) — cuádriceps/glúteo · 5 reps con manos
   · ↓ desde silla alta con cojín · ↑ solo rozar el asiento al bajar ·
   🎯 el sofá, el váter, el coche. *El ejercicio más importante del método.*
2. ◆ Extensión de rodilla sentada — cuádriceps · 8/pierna, 3 s arriba ·
   ↓ media extensión · ↑ pausa 5 s + tobillo en flexión · 🎯 escalones, frenar al sentarse.
3. ◆ Marcha sentada — flexores de cadera, ritmo cardíaco suave · 30 s ×2 ·
   ↓ pies sin despegar, solo talones · ↑ 60 s con brazos · 🎯 caminar con paso vivo.
4. ◆ Talones y puntas — gemelo/tibial · 15+15 · ↓ un pie por vez · ↑ los dos
   pies, tempo lento · 🎯 tropezar menos (el tibial levanta la puntera).
5. ◆ Empuje de palmas — pecho/brazos isométrico · 5×5 s · ↓ 3 s suave ·
   ↑ a la altura de la cara · ⚠ no aguantar la respiración (evitar Valsalva) · 🎯 empujar puertas, incorporarse.
6. Apretar pelota o toalla enrollada — agarre · 10×3 s por mano · ↓ menos
   fuerza · ↑ 5 s y más vueltas de toalla · 🎯 abrir botes, agarrarse a la barandilla.
7. Remo con toalla — espalda alta · sentado, toalla tensa entre manos, tirar
   codos atrás 8 reps · ↓ sin tensión · ↑ pausa 3 s omóplatos juntos · 🎯 postura, cargar bolsas.
8. Puntera contra el suelo (tibial) — tibial anterior · 12 reps · ↓ menos reps
   · ↑ pausa arriba · 🎯 no arrastrar los pies.
9. Glúteo activo en silla — apretar glúteos sentado 8×5 s · ↓ 3 s · ↑ inclinado
   levemente adelante · 🎯 despegar del asiento con menos esfuerzo.
10. Elevación de rodilla con pausa — flexor de cadera · 6/pierna con 2 s ·
    ↓ sin pausa · ↑ 4 s y tronco erguido · 🎯 meter la pierna en el pantalón, subir al autobús.

**Equilibrio (base sentada / preparación)**
11. ◆ Inclinarse y volver — control de tronco · 6 reps sin manos · ↓ con manos
    en muslos · ↑ pausa 2 s inclinado · 🎯 alcanzar la mesilla sin sustos.
12. Alcances laterales sentado — tronco/estabilidad · 5/lado tocando lejos ·
    ↓ más cerca · ↑ cruzando la línea media · 🎯 coger el cinturón del coche.
13. Sentado sin respaldo — postura/core · 60 s erguido al borde de la silla ·
    ↓ 30 s · ↑ con movimientos de brazos · 🎯 la base de todo lo demás.
14. Peso de un glúteo a otro — pelvis/control · 10 transferencias · ↓ pequeñas
    · ↑ levantando levemente el glúteo libre · 🎯 preparar el paso.

**Movilidad**
15. ◆ Círculos de hombros — 8+8 · ↓ encogimientos · ↑ brazos enteros · 🎯 abrocharse, alcanzar armarios.
16. ◆ Bombeo de tobillos — 15/pie · ↓ apoyado · ↑ +círculos · 🎯 circulación, primer paso al levantarse.
17. ◆ Cuello amable — 5/lado · ↓ rango corto · ↑ +inclinaciones · ⚠ despacio siempre, sin llevar al límite · 🎯 mirar al cruzar la calle.
18. ◆ Manos despiertas — 15 aperturas · ↓ 8 sin apretar · ↑ brazos estirados · 🎯 destreza diaria.
19. ◆ Brazos al techo — 8 con respiración · ↓ hasta los hombros · ↑ estirar +2 cm · 🎯 armarios altos, vestirse.
20. ◆ Giro de tronco sentado — 6/lado · ↓ rango corto · ↑ pausa 2 s · 🎯 girarse en la cama, mirar atrás.
21. Gato-vaca sentado — columna · 6 ciclos lentos con respiración · ↓ rango
    mínimo · ↑ ciclos más amplios · 🎯 rigidez matutina de espalda.
22. Apertura de pecho en silla — manos detrás, pecho al frente · 5×5 s ·
    ↓ manos en la cintura · ↑ +alcance · 🎯 respirar más ancho, postura.
23. Tobillo cruzado, círculos y alfabeto — 1 min/pie · ↓ solo círculos ·
    ↑ "dibujar" letras · 🎯 terreno irregular sin torcerse.

**Marcha (preparación en casa)**
24. ◆ Paseo interior por habitaciones — 2-3 min seguidos por casa · ↓ 1 min ×2 ·
    ↑ añadir 1 min/semana · 🎯 la base de la libertad.
25. Pasos junto a la encimera — 20 pasos laterales con dos manos · ↓ 10 ·
    ↑ una mano · 🎯 moverse por la cocina con seguridad.

**Respiración y calma**
26. ◆ Respirar 4-6 — 5 ciclos · ↓ 3-4 · ↑ 8 ciclos ojos cerrados · 🎯 calma, tensión arterial, sueño.
27. ◆ Respiración con la tripa — 5 ciclos mano en abdomen · 🎯 respirar "de verdad", no con el cuello.
28. ◆ Soltar hombros — 8 ciclos subir-soltar · 🎯 descargar el día.
29. Suspiro fisiológico — doble inhalación nasal + espiración larga, 3 ciclos ·
    🎯 el botón de calma más rápido que existe.
30. Contar respiraciones (1 min) — atención · 🎯 dormir mejor; el "regalo" del domingo.

### NIVEL 2 — DE PIE (fases 2A-2C)

**Fuerza**
31. ◆ Sentadilla a la silla — 8 reps rozando asiento · ↓ sentarse del todo ·
    ↑ tempo 3-0-3 · 🎯 el gesto rey, ya sin manos.
32. ◆ Puntillas con apoyo — 10 · ↓ rango corto · ↑ pausa 2 s arriba ·
    🎯 impulso al caminar, escaleras.
33. ◆ Flexión a la pared — 8 · ↓ más cerca · ↑ medio paso atrás ·
    🎯 empujar, levantarse del suelo algún día.
34. ◆ Pierna al lado con apoyo — glúteo medio · 8/lado · ↓ un palmo ·
    ↑ pausa 2 s · 🎯 estabilidad de cadera = no tambalearse al pisar.
35. ◆ El escalón — 8 subidas alternas con barandilla · ↓ 4 · ↑ cambiar pie líder ·
    🎯 escaleras, bordillos, autobús.
36. Bisagra de cadera con apoyo — glúteo/espalda segura · 8 llevando cadera
    atrás, espalda larga · ↓ rango corto · ↑ sin manos, hasta rodillas ·
    ⚠ la espalda no se redondea; el movimiento nace en la cadera ·
    🎯 **recoger cosas del suelo sin hacerse daño** (de los gestos más valiosos).
37. Elevación de talones + puntas de pie (pared) — pantorrilla/tibial · 10+10 ·
    🎯 paso elástico, menos tropiezos.
38. Media sentadilla isométrica en pared — 2×15 s · ↓ más alto · ↑ 30 s ·
    ⚠ respirar siempre; evitar si hay hipertensión mal controlada (los
    isométricos suben la tensión transitoriamente) · 🎯 bajar escaleras con control.
39. Levantar la compra — con una bolsa ligera, sentadilla parcial + llevarla
    5 pasos · ↓ sin peso · ↑ bolsa en cada mano · 🎯 la compra real.
40. Empuje de cadera de pie (contra encimera) — glúteo · 8×3 s · 🎯 potencia
    del paso.

**Equilibrio**
41. ◆ Un pie con apoyo — 10 s/lado, mano apoyada · ↓ dos manos, pie apenas
    despegado · ↑ un dedo · 🎯 vestirse de pie, ducharse.
42. ◆ Talón-punta junto a la pared — 10 pasos · ↓ separación de un palmo ·
    ↑ sin tocar pared · 🎯 caminar por sitios estrechos.
43. ◆ Pasos laterales — 10+10 · ↓ 5 tocando pared · ↑ sin tocar, más largos ·
    🎯 esquivar, moverse entre muebles.
44. Semi-tándem estático — un pie medio paso adelante, 20 s/lado · ↓ pies más
    separados · ↑ tándem completo · 🎯 la cola del súper sin balanceo.
45. Transferencias de peso — de pie, pasar el peso de pierna a pierna 10 veces
    lento · ↓ con apoyo · ↑ levantando el pie libre · 🎯 el paso seguro.
46. Marcha en el sitio con apoyo decreciente — 30 s · ↓ dos manos · ↑ sin manos,
    rodillas más altas · 🎯 arrancar a andar con confianza.
47. Giro de 180º controlado — girar en 4-5 pasos, no en uno · 2/lado ·
    ⚠ girar en bloque es la causa nº1 de caída doméstica; enseñamos a girar
    por pasos · 🎯 darse la vuelta en la cocina, en el baño.

**Movilidad**
48. ◆ Círculos de cadera — 5+5 · 🎯 fluidez del paso.
49. ◆ Molinos suaves de brazos — 8+8 · 🎯 hombros vivos.
50. ◆ Estirar la espalda en la pared — 3×15 s · 🎯 desplegarse tras el sofá.
51. Flexor de cadera en el borde de la silla — sentado al borde, pierna atrás
    estirada, 15 s/lado · 🎯 zancada más larga, menos "andar de viejo" (el
    acortamiento del psoas encoge el paso).
52. Gemelo en pared — 20 s/lado · 🎯 tobillo que permite bajar escaleras.
53. Apertura de brazos en esquina/puerta — pecho · 2×15 s · 🎯 postura, respiración.
54. Rotación de columna de pie (manos en pecho) — 6/lado · 🎯 mirar atrás al aparcar.

**Marcha**
55. ◆ Paseo por casa 3 min → **paseo exterior** — empezar 5 min · ↓ 3 min ·
    ↑ +2 min/semana hasta 15-20 · 🎯 el mundo de fuera.
56. ◆ Marcha en el sitio 1 min ×2 — días de lluvia · 🎯 no perder el día.
57. Paseo con cambios de ritmo — 6 min: 1 normal / 30 s "un pelín más vivo" ·
    ↓ todo suave · ↑ tramos vivos de 1 min · 🎯 llegar al paso de cebra en verde.
58. Talones firmes (hueso) — de puntillas, dejar caer talones al suelo con
    golpecito seco, 2×10 · ↓ bajar despacio · ↑ un poco más de altura ·
    ⚠ no con prótesis reciente o dolor agudo; empezar muy suave ·
    🎯 huesos que se cargan, huesos que aguantan.
59. Subir escaleras como ejercicio — 1 tramo con barandilla, bajar en
    ascensor si lo hay · ↑ 2 tramos · 🎯 la escalera deja de ser enemiga.

**Respiración y calma**
60. ◆ Aire de la mañana (ventana) — 6 ciclos · 🎯 empezar el día en calma.
61. ◆ Pasos que respiran — 2 min coordinando · 🎯 caminar sin ahogo.
62. Respiración 4-6 de pie con apoyo — 5 ciclos · 🎯 calma disponible en cualquier sitio.

### NIVEL 3 — ACTIVO (fases 3A-3C)

**Fuerza**
63. ◆ Sentadillas libres — 10 · ↓ a la silla · ↑ tempo 4 s bajada · 🎯 reserva para todo.
64. ◆ Zancada tranquila — 6/lado · ↓ corta con apoyo · ↑ más profunda ·
    🎯 atarse un zapato con el pie subido, jardinería.
65. ◆ El puente — 10 · ↓ rango parcial · ↑ pausa 3 s / una pierna (3C) ·
    🎯 cadera fuerte = espalda protegida.
66. ◆ Bajar al suelo y volver — 1-3 transferencias · ↓ con silla al lado ·
    ↑ sin apoyos, por ambos lados · 🎯 **jugar con los nietos en el suelo y
    levantarse después. Y si algún día te caes, saber levantarte.** El
    ejercicio-seguro-de-vida del método.
67. ◆ Fuerza con botellas — 10 elevaciones · ↑ por encima de la cabeza ·
    🎯 maletas al altillo.
68. ◆ Rodillas arriba — 2×1 min · ↑ ritmo vivo · 🎯 corazón y agilidad.
69. Flexión inclinada (encimera → más bajo) — 8 · ↓ pared · ↑ apoyo más bajo ·
    🎯 levantarse del suelo, empuje real.
70. Remo con mochila — mochila con peso en una mano, tronco inclinado apoyado
    en silla, 8/lado · 🎯 espalda que carga sin quejarse.
71. Sentadilla + alcance alto — 8, subiendo brazos al techo al levantarse ·
    🎯 gesto completo de vida (agacharse + alcanzar).
72. Paseo del granjero — bolsa/garrafa en una mano, 20 pasos, cambiar ·
    ⚠ hombros lejos de las orejas, tronco recto · 🎯 la compra, la maleta,
    el agarre (la carga asimétrica es oro para el core).
73. Subida a escalón sin manos, con pausa — 8/lado · ↑ escalón más alto ·
    🎯 senderos, bordillos altos.
74. Sentarse en el suelo y levantarse con peso ligero (3C) — 2-3 ciclos ·
    🎯 la versión avanzada del 66.

**Equilibrio**
75. ◆ Un pie sin apoyo — 15 s/lado · ↑ 30 s / brazos cruzados · 🎯 reserva de estabilidad.
76. ◆ La cuerda floja (tándem libre) — 12 pasos · ↑ hacia atrás · 🎯 confianza plena.
77. ◆ Puntillas sin apoyo — 15 · ↑ pausa 3 s · 🎯 impulso y tobillo fino.
78. Un pie + giros de cabeza — 10 s mirando izquierda-derecha · ⚠ junto a
    pared las primeras veces · 🎯 mirar el tráfico sin perder pie (el
    equilibrio real de la calle exige cabeza en movimiento).
79. Tándem con ojos cerrados (opcional, 3B+) — 10 s junto a pared ·
    ⚠ siempre con pared a un palmo; es el único ojos-cerrados del método ·
    🎯 el sistema vestibular también se entrena.
80. Ocho pasos hacia atrás — despacio, junto a encimera · 🎯 apartarse de una
    puerta que se abre, del perro, del nieto en bici.
81. Equilibrio con tarea doble — un pie mientras cuentas hacia atrás desde 30
    de 3 en 3 · 🎯 el equilibrio de verdad es el que funciona mientras piensas
    en otra cosa (la marcha con distracción es donde ocurren las caídas).

**Movilidad**
82. ◆ Lados que se estiran — 6/lado · 🎯 alcanzar lejos.
83. Sentadilla profunda sostenida con apoyo — 15-30 s agarrado a algo firme ·
    🎯 el rango que la silla te fue robando.
84. El mejor estiramiento del mundo (adaptado) — zancada + rotación de tronco,
    4/lado · 🎯 todo el cuerpo en un gesto.
85. Movilidad de hombro con palo/paraguas — 8 pases · 🎯 abrocharse atrás, nadar.
86. Perro boca abajo contra la pared — 20 s · 🎯 hombros y cadenas posteriores largas.

**Marcha**
87. ◆ Paseo 5-10 min a ritmo que hable-pero-note — ↑ 20-30 min · 🎯 el mejor
    medicamento que existe, gratis.
88. ◆ Las escaleras (2 pisos) — ↑ sin pausa, ritmo · 🎯 la prueba del algodón.
89. Intervalos suaves — 10-15 min: 2 normal / 1 vivo · 🎯 corazón con reserva.
90. Cuestas — incluir una cuesta en el paseo, subir "conversando" ·
    🎯 potencia real de piernas.
91. Marcha rápida con brazos — 5 min técnica: talón-planta-impulso, brazos al
    ritmo · 🎯 caminar joven.
92. Impactos de talón + saltitos mínimos (3B-3C) — 2×8 despegando 2-3 cm ·
    ⚠ solo sin dolor articular; progresar de impacto de talón a saltito ·
    🎯 hueso denso, potencia que la edad se lleva primero.

**Respiración y calma**
93. ◆ Respiración de la calma (4-4-6) — 5 ciclos · 🎯 el freno de mano bueno.
94. ◆ Respirar caminando (3-4) — 🎯 resistencia tranquila.
95. ◆ Una canción entera bailada — 🎯 alegría; el mejor "cardio" es el que no
    parece ejercicio.

### El circuito 3C (mantenimiento eficiente, "mucho en poco")

Para el perfil en forma con poco tiempo, el momento diario adopta formato
circuito: 3 minutos, 3 ejercicios × 40-50 s con transición mínima, rotando
patrones (empuje + pierna + equilibrio; bisagra + carga + respiración…). El
tono sigue siendo A Tu Paso (nunca "no pain no gain"), pero la densidad es
real. Ejemplo: 45 s sentadillas tempo · 45 s flexión inclinada · 45 s un pie
con giros de cabeza · 45 s respiración 4-6. La honestidad de marca aquí es:
"tres minutos diarios bien elegidos mantienen mucho; para ganar más, un día
te propondremos dos momentos" (upsell natural de producto futuro).

## 9. Seguridad: el contrato del método

- **Regla del semáforo (va en los mensajes, con lenguaje llano):** molestia
  muscular suave que desaparece al parar = verde, es normal. Dolor articular,
  punzada, chasquido con dolor = rojo: se para hoy y se cuenta ("responde
  DOLOR y te leemos"). Mareo, dolor u opresión en el pecho, ahogo
  desproporcionado, pérdida de visión = **se para y se llama al médico o
  emergencias; A Tu Paso no es un servicio médico.**
- **Equilibrio = apoyo disponible siempre** (niveles 1-2 sin excepción).
  Superficies despejadas, calzado o descalzo con agarre, nunca calcetines
  sobre suelo liso. Se repite en cada momento de equilibrio, con naturalidad.
- **Isométricos y respiración**: nunca aguantar el aire (Valsalva sube la
  tensión); instrucción de contar en voz alta como truco anti-apnea.
- **Flags personales** (caídas, médico, prótesis): sobre-ponderan seguridad
  en la selección; las menciones de salud en el chat ya generan alerta
  humana (implementado) y NUNCA respuesta automática de consejo médico.
- **Límites del servicio**: educación y hábitos de estilo de vida. No
  diagnóstico, no tratamiento, no rehabilitación. Está en la política de
  privacidad, en el aviso legal y en el tono de cada respuesta.

## 10. Gamificación al servicio de la marca (no al revés)

Lo ya construido (contador de días que solo suma) es la base. El método añade:

- **Las 9 etapas del camino** con nombres cálidos (§4): cambiar de etapa es
  el evento gamificado mayor. Se celebra capacidad, no obediencia: *"Hoy te
  has levantado 10 veces sin manos. Hace seis semanas usabas las dos. Eso no
  te lo quita ya nadie."*
- **"Hoy contamos"** (§7.1): el test como juego. Tu número contra tu número
  de hace 3 semanas. Nunca contra nadie más.
- **Hitos funcionales espontáneos**: la primera vez que reporta algo de la
  lista de deseos vitales (subió las escaleras sin parar, se sentó en el
  suelo con el nieto), el sistema —o el humano, vía alerta positiva— lo
  refleja. Son los momentos que fidelizan de verdad.
- **Resumen semanal (domingo)**: días sumados, un logro concreto de la
  semana, y qué viene ("la semana que viene tu camino sigue por…"). Cierre:
  siempre amable, jamás "esta semana has fallado X días".
- **Lo prohibido, por diseño**: rankings, comparación entre usuarios, rachas
  rompibles, presión por notificación, "¡no pierdas tu progreso!". Está en
  la guía de marca y aquí se refuerza: la retención que queremos es la del
  cuidado, no la de la ansiedad.

## 11. Autocrítica del especialista (límites reales de este diseño)

1. **Todo es auto-informado.** No vemos a la persona: un "hecho" puede ser
   un ejercicio mal ejecutado. Mitigaciones: ejercicios elegidos por ser
   difíciles de hacer peligrosamente mal, instrucciones con el error típico
   señalado ("la espalda larga, el movimiento nace en la cadera"), vídeos
   cortos en el futuro. Riesgo residual: existe y se asume; elegir ejercicios
   robustos ante mala ejecución es criterio de entrada al catálogo.
2. **Tres minutos son subterapéuticos para la mayoría de objetivos de
   salud** si se quedan en tres para siempre. El método responde con
   progresión de dosis (los paseos crecen: un momento de marcha de nivel 3
   ya no son 3 minutos) y con honestidad de copy. Aun así: no prometemos
   resultados clínicos, prometemos volver a moverse — y eso sí lo cumple.
3. **El cuestionario de 5 preguntas clasificará mal a algunas personas.**
   Asumido por diseño: colocación conservadora + corrección rápida en 2
   semanas por señales. El error queda sesgado hacia "demasiado fácil", que
   es el error barato.
4. **Las puertas dependen de que la persona cuente bien y quiera contar.**
   Los números auto-reportados se inflarán a veces. Contramedida: las
   puertas confirman, nunca sustituyen a las señales diarias; y el sistema
   siempre puede afinar a la baja después.
5. **Población heterogénea**: diabetes, artrosis, EPOC, párkinson temprano…
   No podemos (ni debemos) personalizar clínicamente. La respuesta es el
   sobre-margen de seguridad + flags + derivación al médico + humano en el
   bucle. B2B con residencias exigirá revisar esto con asesoría sanitaria.
6. **Qué validaremos con datos reales** (el moat de verdad): retención por
   ejercicio y por dominio, tasa de respuesta por hora de envío, curvas de
   señales antes del churn (¿cuántos `struggled` predicen abandono?),
   distribución real de las puertas (¿el 30 % pasa G1 en 6 semanas?). El
   método v1.0 se escribirá con estos datos; este v0.1 se escribe con
   literatura y criterio.

## 12. Preguntas abiertas para decidir (antes de implementar)

1. **Nombres de las 9 etapas**: propuestos en §4 — ¿validas los nombres o
   los trabajamos con la voz de marca?
2. **El dominio "marcha"**: implica migración pequeña de BD (§13). ¿Adelante?
3. **"Hoy contamos"**: ¿frecuencia quincenal o cada 3 semanas? Propongo cada
   3 para que el número siempre haya podido crecer (contar sin mejorar
   desmotiva).
4. **Momento doble** (producto futuro para 3C): ¿lo dejamos apuntado o lo
   descartamos de raíz?
5. **Vídeos**: el catálogo está escrito para funcionar solo con texto, pero
   ¿grabamos vídeos cortos de los 10-15 ejercicios donde la ejecución
   importa más (bisagra, transferencia al suelo)? Subiría seguridad y
   percepción de calidad.

## 13. Implicaciones técnicas (cuando se apruebe este diseño)

Cambios sobre lo ya construido — ninguno rompe la arquitectura:

1. `exercises.category`: añadir `'marcha'` al CHECK (migración de un ALTER).
2. Nueva columna `exercises.phase` (`A`/`B`/`C`) y `users.current_phase`;
   el selector diario filtra por nivel+fase con solapamiento (una fase puede
   usar ejercicios de la anterior como día suave).
3. Nueva tabla `assessments` (puertas "hoy contamos"): user_id, tipo de
   puerta, valor reportado, fecha — alimenta los triggers de §7.
4. Ampliar `fn_nightly_maintenance` con las reglas de §7 (elegibilidad +
   puerta, anti yo-yo, re-entrada por ausencia).
5. Sembrar los ~50 ejercicios nuevos del catálogo + plantillas nuevas
   ("hoy contamos", cambio de etapa, resumen dominical).
6. El patrón semanal (§6) sustituye a la rotación simple de categorías en
   `fn_pick_exercise`.

---

*Documento vivo. v0.1 — pendiente de revisión del fundador. Las decisiones
que se aprueben aquí se registrarán en `DECISIONES.md` y se implementarán
por fases en la BD.*
