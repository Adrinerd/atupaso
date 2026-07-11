/**
 * Preguntas frecuentes.
 *
 * Viven en un archivo de datos porque se usan en dos sitios:
 * la sección visible de la landing y el JSON-LD (FAQPage) para SEO.
 * Así el contenido nunca puede quedar desincronizado.
 */
export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "Hace muchos años que no hago ejercicio. ¿Podré seguirlo?",
    answer:
      "Sí. A Tu Paso está pensado justo para eso. No empezamos donde están los demás: empezamos donde estás tú. Levantarte de una silla con calma, mover los hombros, respirar mejor. Si puedes con tu día a día, puedes con esto.",
  },
  {
    question: "¿Tengo que instalar alguna aplicación?",
    answer:
      "No. Todo llega por WhatsApp, la misma aplicación que ya usas para hablar con tu familia. No hay nada que descargar, ninguna contraseña nueva que recordar y ningún aparato que comprar.",
  },
  {
    question: "Tengo dolores, una prótesis o problemas de rodilla. ¿Es seguro?",
    answer:
      "Las acciones son suaves, se explican paso a paso y siempre incluyen una versión más fácil por si ese día lo necesitas. Aun así, tu cuerpo manda: si tienes una lesión o una condición médica, consúltalo antes con tu médico. A Tu Paso te acompaña, pero no sustituye a un profesional sanitario.",
  },
  {
    question: "¿Qué pasa si un día no lo hago?",
    answer:
      "No pasa nada. No hay rachas que perder, ni puntos, ni nadie que te riña. Al día siguiente te llega tu momento de hoy, como siempre. La constancia se construye con amabilidad, no con culpa.",
  },
  {
    question: "¿A qué hora llega el mensaje?",
    answer:
      "Por la mañana, a primera hora. Así tienes todo el día por delante para encontrar tu momento: después del desayuno, a media tarde, cuando mejor te venga. El mensaje no caduca.",
  },
  {
    question: "¿Puedo regalarlo a mi madre o a mi padre?",
    answer:
      "Claro, y es una forma preciosa de cuidar desde la distancia. Solo necesitas su número de WhatsApp para que empecemos a acompañarle. Nuestro consejo: avísale antes de que le va a escribir alguien con buenas intenciones.",
  },
  {
    question: "¿Cómo se cancela?",
    answer:
      "Cuando quieras y al momento, sin llamadas ni explicaciones. No hay permanencia: si un mes no te encaja, lo dejas y no se te vuelve a cobrar. Y si algún día quieres volver, aquí estaremos.",
  },
];
