# Guía de marca — A Tu Paso

> El sistema de marca completo: cómo suena, cómo se ve y qué nunca hacemos.
> Consultar **antes** de escribir copy o tocar diseño. Los tokens técnicos
> viven en `src/app/globals.css`; este documento es la razón detrás de ellos.

## Esencia

| | |
|---|---|
| **Emoción principal** | Alivio — "por fin algo para alguien como yo" |
| **Enemigo** | La cultura del "todo o nada" |
| **Sensaciones** | Calma · cercanía · confianza · humanidad |
| **Nunca parecer** | Una startup tecnológica · una app de fitness · una empresa agresiva |

---

## Voz y tono

- Hablar siempre de **tú**.
- Frases **cortas**. Lenguaje **sencillo**. Cero tecnicismos.
- **Nunca culpabilizar. Nunca exagerar. Nunca sonar como un coach.**
- Escribir como una persona que entiende de verdad a este público — no como
  un departamento de marketing.

### Palabras que SÍ usamos

moverse · caminar · respirar · tranquilidad · bienestar · constancia · hoy ·
tres minutos · a tu ritmo · pequeños pasos

### Palabras PROHIBIDAS

fitness · reto (de cara al público) · quemar grasa · transformación ·
operación bikini · machacar · hack · biohacking · disciplina extrema

> Regla práctica: si una palabra suena a gimnasio, a esfuerzo heroico o a
> tecnología, no va.

### La promesa (frase madre)

> No necesitas cambiar tu vida. Solo tres minutos hoy.

---

## Color

Nunca blanco puro. Nunca negro absoluto.

| Rol | Nombre | Hex | Uso |
|---|---|---|---|
| Principal | Verde salvia | `#7A9E7E` | Superficies, acentos grandes, ilustración |
| Acento | Terracota cálido | `#D98E73` | Detalles cálidos, énfasis puntual |
| Fondo | Crema | `#F5F1E8` | Fondo base de todo el sitio |
| Texto | Tinta | `#33302B` | Texto principal |

**Nota de accesibilidad (importante):** los tonos de marca `#7A9E7E` y
`#D98E73` **no cumplen contraste AA** sobre crema para texto pequeño. Por eso
en `globals.css` existen variantes más oscuras (`salvia-800/900`,
`terracota-700`) que se usan en texto y botones. El tono de marca se reserva
para superficies y acentos grandes. La marca se respeta; la legibilidad para
un público mayor, también. (Ver `DECISIONES.md`.)

---

## Tipografía

- **Titulares**: Fraunces (preferida). Alternativa: Lora.
- **Texto**: Inter.
- El público es mayor: **todo se ve grande**. Cuerpo mínimo **18 px**
  (en el sitio, la raíz está a 112,5 % para que 1rem = 18px).
- Botones grandes (área táctil ≥ 56 px). Espacios generosos. Nada apretado.

Ambas fuentes se sirven con `next/font` (sin peticiones externas en runtime).

---

## Estilo visual

**Usar**: esquinas redondeadas · mucho espacio en blanco · sombras suaves ·
iconografía sencilla de trazo · ilustraciones o placeholders naturales.

**Nunca**: degradados llamativos · neones · musculatura · mancuernas · cuerpos
perfectos · fotos de "antes/después".

La iconografía propia (`src/components/icons.tsx`) es de trazo y cálida:
hojas, escaleras, luna, sol, corazones, tazas. Nunca material de gimnasio.

---

## Aplicación en producto

- **Beneficios**: siempre de la vida real (subir escaleras, jugar con los
  nietos, dormir mejor), **nunca** estética ni báscula.
- **Constancia**: contador de días que solo suma; jamás "racha" ni nada que se
  rompa o se ponga a cero.
- **Personalización**: se promete "adaptado a tu punto de partida" y "a tu
  ritmo", no "plan 100 % personalizado". Honestidad sobre lo que se construye.
- **Fallar un día**: se responde sin culpa, con calidez. La ausencia nunca se
  reprocha.

---

## Checklist rápido antes de publicar copy

- [ ] ¿Hablo de tú, con frases cortas?
- [ ] ¿Alguna palabra prohibida se ha colado?
- [ ] ¿Suena a alivio, no a exigencia?
- [ ] ¿Prometo solo lo que de verdad hacemos?
- [ ] ¿Se lee grande y cómodo para alguien de 70 años?
