-- ============================================================
-- A Tu Paso — Datos semilla
-- Niveles, configuración, plantillas de mensaje y biblioteca
-- inicial de 45 ejercicios (15 por nivel).
--
-- El contenido vive en la base de datos, nunca en el código:
-- editar un ejercicio o una plantilla no requiere ningún deploy.
-- ============================================================

-- ---------- Configuración inicial ----------
insert into app_config (key, value) values
  ('channel_mode',        '"manual"'),
  ('wa_phone_number_id',  '"CAMBIAR_POR_EL_ID_DE_META"'),
  ('send_hour_local',     '8'),
  ('level_up_threshold',  '5'),
  ('level_down_threshold','4'),
  ('inactive_after_days', '5'),
  ('dormant_after_days',  '21')
on conflict (key) do nothing;

-- ---------- Niveles ----------
insert into levels (id, code, name, description, sort_order) values
  (1, 'sentado', 'Sentado',  'Empezamos desde la silla: fuerza, movilidad y respiración con apoyo total.', 1),
  (2, 'de_pie',  'De pie',   'De pie con apoyo cerca: equilibrio, pasos y fuerza suave.', 2),
  (3, 'activo',  'Activo',   'Sin apoyo: paseos, escaleras y fuerza funcional del día a día.', 3)
on conflict (id) do nothing;

-- ---------- Plantillas de mensaje ----------
-- meta_template solo en las que pueden salir fuera de la ventana de 24 h
-- (hay que aprobarlas en el panel de Meta con ese mismo nombre).
insert into message_templates (code, body, meta_template) values
  ('bienvenida',
   E'Hola, {{nombre}} 🌱 Soy A Tu Paso. A partir de mañana te acompañaré cada día con un pequeño momento para tu cuerpo, de unos tres minutos.\n\nPara empezar donde estás tú, ¿me respondes a tres preguntas rápidas?\n\nLa primera: ¿puedes levantarte de una silla sin usar las manos? (responde: sí / a veces / no)',
   'atupaso_bienvenida'),

  ('momento_diario',
   E'Buenos días, {{nombre}} 🌱 Tu momento de hoy, cuando te venga bien:\n\n{{ejercicio}}\n\n{{variante_facil}}\nY si te resulta fácil: {{variante_viva}}\n\nCuando lo hagas, responde «Hecho».',
   'atupaso_momento_diario'),

  ('celebracion',
   E'¡Hecho! 🌱 Ya llevas {{dias}} días cuidándote. Mañana seguimos, a tu paso. 🤍',
   null),

  ('sin_culpa',
   E'No pasa nada, de verdad. Tu cuenta sigue igual, esperándote: aquí no hay nada que se rompa. Mañana te llega un momento nuevo. 🤍',
   null),

  ('vuelta_amable',
   E'Hola, {{nombre}} 🤍 Hace unos días que no sabemos de ti y solo queríamos decirte una cosa: tu cuenta sigue en {{dias}} días. No se ha borrado nada.\n\nCuando quieras, tu momento te estará esperando. Sin prisa.',
   'atupaso_vuelta_amable'),

  ('cambio_nivel_sube',
   E'Tenemos una buena noticia: tus últimos momentos te están saliendo con soltura, así que a partir de mañana notarás que van un pasito más allá. Siempre a tu ritmo, como todo aquí. 🌱',
   null),

  ('cambio_nivel_ajuste',
   E'Hemos visto que los últimos momentos estaban costando un poco más de la cuenta, así que vamos a afinarlos para que encajen mejor contigo. Empezar donde estás tú: de eso va esto. 🤍',
   null),

  ('pago_fallido',
   E'Hola, {{nombre}}. No hemos podido renovar tu suscripción — a veces pasa, por la tarjeta o el banco. Lo reintentaremos automáticamente estos días.\n\nSi quieres revisarlo, escríbenos y te ayudamos. Mientras tanto, tus momentos siguen llegando con normalidad.',
   'atupaso_pago_fallido'),

  ('despedida',
   E'Tu suscripción queda cancelada, tal y como pediste. Sin letra pequeña y sin reproches: ha sido un placer acompañarte estos {{dias}} días.\n\nSi algún día quieres volver, tu cuenta seguirá aquí, esperándote. A tu paso. 🤍',
   'atupaso_despedida'),

  ('reactivacion',
   E'¡Qué alegría verte de vuelta, {{nombre}}! 🌱 Tu cuenta sigue en {{dias}} días — aquí nada se pierde. Mañana por la mañana te llega tu momento. A tu paso.',
   'atupaso_reactivacion'),

  ('recordatorio_suave',
   E'Sin prisa y sin agobio: tu momento de hoy sigue disponible si te apetece. Y si hoy no toca, mañana hay otro. 🤍',
   null)
on conflict (code) do nothing;

-- ---------- Biblioteca de ejercicios ----------
do $$
declare
  eval_std jsonb := '{
    "done":        ["hecho","echo","ya esta","ya está","listo","lista","👍","✅","💪","si","sí"],
    "done_easier": ["me apoye","me apoyé","con ayuda","version facil","versión fácil","apoyandome","apoyándome"],
    "done_harder": ["facil","fácil","muy facil","muy fácil","version viva","versión viva","sin problema"],
    "struggled":   ["me costo","me costó","dificil","difícil","no pude","no he podido","duele","dolor","cansa mucho"]
  }';
  succ_std jsonb := '{"template":"celebracion"}';
  fail_std jsonb := '{"template":"sin_culpa","flag_review":false}';
begin

-- ===== NIVEL 1 · SENTADO =====
insert into exercises (code, name, objective, category, level_id, message_body, easier_variant, harder_variant, evaluation, on_success, on_failure) values
('silla_levantarse_5','Levantarse de la silla','fuerza de piernas','fuerza',1,
 'Siéntate en una silla firme. Levántate y vuelve a sentarte, despacio, 5 veces. Descansa entre una y otra.',
 'Si te cuesta, apoya las manos en los reposabrazos o en tus muslos.',
 'hazlo aún más despacio, contando 3 segundos al bajar.',
 eval_std, succ_std, fail_std),

('hombros_circulos','Círculos de hombros','movilidad de hombros','movilidad',1,
 'Sentado, con la espalda cómoda, dibuja círculos lentos con los hombros: 8 hacia atrás y 8 hacia delante.',
 'Hazlos más pequeños, como si encogieras los hombros suavemente.',
 'estira los brazos en cruz y dibuja los círculos con los brazos enteros.',
 eval_std, succ_std, fail_std),

('tobillos_bombeo','Despertar los tobillos','circulación y tobillos','movilidad',1,
 'Sentado, estira una pierna y mueve el pie arriba y abajo 15 veces, como si aceleraras. Luego la otra.',
 'Hazlo con el pie apoyado en el suelo, levantando solo la punta.',
 'añade 10 círculos con cada tobillo, en los dos sentidos.',
 eval_std, succ_std, fail_std),

('respiracion_4_6','Respirar despacio','calma y capacidad pulmonar','respiracion',1,
 'Siéntate cómodo. Coge aire por la nariz contando hasta 4, y suéltalo por la boca contando hasta 6. Repítelo 5 veces.',
 'Cuenta hasta 3 y hasta 4: lo importante es soltar el aire despacio.',
 'repítelo 8 veces con los ojos cerrados.',
 eval_std, succ_std, fail_std),

('rodilla_extension','Estirar la rodilla','fuerza de muslos','fuerza',1,
 'Sentado, estira una pierna hasta dejarla recta, aguanta 3 segundos y bájala despacio. 8 veces con cada pierna.',
 'Estírala solo hasta donde llegue sin molestia, sin aguantar.',
 'aguanta 5 segundos con la pierna estirada.',
 eval_std, succ_std, fail_std),

('cuello_suave','Cuello amable','movilidad de cuello','movilidad',1,
 'Sentado, gira la cabeza despacio hacia un lado, como mirando por encima del hombro. Vuelve al centro y gira al otro. 5 veces a cada lado.',
 'Gira solo un poquito, hasta donde no notes tirantez.',
 'añade 5 inclinaciones suaves, llevando la oreja hacia el hombro.',
 eval_std, succ_std, fail_std),

('manos_punos','Manos despiertas','fuerza y movilidad de manos','movilidad',1,
 'Abre las manos todo lo que puedas, sepáralos dedos, y ciérralas en un puño suave. 15 veces.',
 'Hazlo 8 veces, sin apretar el puño.',
 'hazlo con los brazos estirados hacia delante.',
 eval_std, succ_std, fail_std),

('marcha_sentado','Marcha sentada','activar piernas y corazón','fuerza',1,
 'Sentado, marcha en el sitio levantando las rodillas de una en una, a tu ritmo, durante 30 segundos. Descansa y repite otra vez.',
 'Levanta los pies solo un par de dedos del suelo.',
 'acompaña la marcha moviendo los brazos, un minuto seguido.',
 eval_std, succ_std, fail_std),

('brazos_techo','Brazos al techo','movilidad de hombros y espalda','movilidad',1,
 'Sentado, sube los dos brazos hacia el techo mientras coges aire, y bájalos despacio mientras lo sueltas. 8 veces.',
 'Sube los brazos solo hasta la altura de los hombros.',
 'al llegar arriba, estírate un poquito más, como si quisieras tocar el techo.',
 eval_std, succ_std, fail_std),

('respiracion_hombros','Soltar los hombros','soltar tensión','respiracion',1,
 'Coge aire subiendo los hombros hacia las orejas, aguanta un segundo, y suéltalo dejando caer los hombros de golpe. 8 veces.',
 'Hazlo 5 veces, subiendo los hombros solo un poco.',
 'al soltar, imagina que sueltas también el peso del día.',
 eval_std, succ_std, fail_std),

('tronco_giro','Girar el tronco','movilidad de espalda','movilidad',1,
 'Sentado, cruza los brazos sobre el pecho y gira el tronco despacio hacia un lado, vuelve al centro y gira al otro. 6 veces a cada lado.',
 'Gira solo hasta donde estés cómodo, sin forzar.',
 'apoya la mano en el respaldo al girar y mantén 2 segundos.',
 eval_std, succ_std, fail_std),

('talones_puntas','Talones y puntas','fuerza de piernas y circulación','fuerza',1,
 'Sentado, con los pies en el suelo: levanta los talones dejando las puntas apoyadas, baja, y levanta las puntas dejando los talones. 15 veces cada uno.',
 'Hazlo con un pie cada vez.',
 'hazlo con los dos pies a la vez y más despacio.',
 eval_std, succ_std, fail_std),

('inclinacion_adelante','Inclinarse y volver','control del tronco','equilibrio',1,
 'Sentado, sin apoyar las manos, inclínate despacio hacia delante como si fueras a levantarte, y vuelve a la posición inicial. 6 veces.',
 'Apoya las manos en los muslos para acompañarte.',
 'al inclinarte, aguanta 2 segundos antes de volver.',
 eval_std, succ_std, fail_std),

('respiracion_abdomen','Respirar con la tripa','respiración profunda','respiracion',1,
 'Pon una mano en el abdomen. Coge aire por la nariz notando cómo la tripa empuja tu mano, y suéltalo despacio. 5 respiraciones.',
 'Hazlo recostado en el respaldo, más cómodo.',
 'haz 8 respiraciones, alargando cada vez más la salida del aire.',
 eval_std, succ_std, fail_std),

('empuje_palmas','Empujar las palmas','fuerza de brazos y pecho','fuerza',1,
 'Junta las palmas de las manos delante del pecho y empuja una contra otra durante 5 segundos. Descansa. 5 veces.',
 'Empuja más flojito, 3 segundos.',
 'sube las manos juntas a la altura de la cara y repite.',
 eval_std, succ_std, fail_std);

-- ===== NIVEL 2 · DE PIE =====
insert into exercises (code, name, objective, category, level_id, message_body, easier_variant, harder_variant, evaluation, on_success, on_failure) values
('puntillas_apoyo','De puntillas','fuerza de gemelos','fuerza',2,
 'De pie, con las manos apoyadas en el respaldo de una silla, ponte de puntillas despacio y baja. 10 veces.',
 'Sube solo un poquito los talones.',
 'aguanta 2 segundos arriba en cada subida.',
 eval_std, succ_std, fail_std),

('equilibrio_un_pie_apoyo','Un pie, con apoyo','equilibrio','equilibrio',2,
 'De pie junto a una silla o encimera, apoya una mano y levanta un pie del suelo. Aguanta 10 segundos. Cambia de pie. 2 veces con cada uno.',
 'Apoya las dos manos y levanta el pie solo un dedo del suelo.',
 'apoya solo un dedo de la mano.',
 eval_std, succ_std, fail_std),

('sentadilla_silla','Sentadilla con silla','fuerza de piernas','fuerza',2,
 'Ponte de pie delante de una silla, como si fueras a sentarte: baja hasta rozar el asiento y sube sin llegar a sentarte. 8 veces.',
 'Siéntate del todo y levántate, usando las manos si hace falta.',
 'baja contando 3 segundos.',
 eval_std, succ_std, fail_std),

('paseo_casa','Paseo por casa','moverse y activar el cuerpo','movilidad',2,
 'Camina por tu casa o por el pasillo durante 3 minutos seguidos, a un ritmo cómodo. Puedes poner la radio.',
 'Camina 1 minuto, descansa, y camina otro minuto.',
 'sal al portal o da una vuelta a la manzana.',
 eval_std, succ_std, fail_std),

('cadera_circulos','Círculos de cadera','movilidad de cadera','movilidad',2,
 'De pie, con las manos en la cintura y los pies separados, dibuja círculos lentos con la cadera: 5 hacia cada lado.',
 'Hazlo con una mano apoyada en la pared.',
 'dibuja los círculos más amplios.',
 eval_std, succ_std, fail_std),

('marcha_sitio','Marcha en el sitio','piernas y corazón','fuerza',2,
 'De pie, cerca de un apoyo por si acaso, marcha en el sitio levantando las rodillas durante 1 minuto, a tu ritmo.',
 'Marcha 30 segundos, descansa, y otros 30.',
 'acompaña con los brazos, como en un desfile tranquilo.',
 eval_std, succ_std, fail_std),

('flexion_pared','Empujar la pared','fuerza de brazos y pecho','fuerza',2,
 'De pie frente a una pared, apoya las palmas a la altura de los hombros. Acerca el pecho a la pared doblando los codos, y empuja para volver. 8 veces.',
 'Ponte más cerca de la pared: cuesta menos.',
 'da medio paso más atrás.',
 eval_std, succ_std, fail_std),

('talon_punta_pared','Caminar talón-punta','equilibrio','equilibrio',2,
 'Junto a una pared (para apoyarte si hace falta), camina 10 pasos poniendo un pie justo delante del otro, talón contra punta.',
 'Deja un palmo de separación entre pie y pie.',
 'hazlo sin tocar la pared en ningún paso.',
 eval_std, succ_std, fail_std),

('respiracion_ventana','Aire de la mañana','respirar y empezar el día','respiracion',2,
 'Abre la ventana, ponte de pie frente a ella, y haz 6 respiraciones lentas y profundas mirando fuera.',
 'Hazlo sentado junto a la ventana.',
 'acompaña cada inspiración subiendo los brazos.',
 eval_std, succ_std, fail_std),

('pierna_lateral','Pierna al lado','fuerza de cadera','fuerza',2,
 'De pie, con una mano apoyada en una silla, lleva una pierna estirada hacia el lado y vuelve, sin inclinarte. 8 veces con cada pierna.',
 'Sepárala solo un palmo del suelo.',
 'aguanta 2 segundos con la pierna separada.',
 eval_std, succ_std, fail_std),

('brazos_circulos_pie','Molinos suaves','movilidad de hombros','movilidad',2,
 'De pie, dibuja círculos amplios y lentos con los dos brazos a la vez, como un molino tranquilo: 8 hacia atrás y 8 hacia delante.',
 'Hazlo con un brazo cada vez.',
 'hazlos más grandes y más lentos.',
 eval_std, succ_std, fail_std),

('pasos_laterales','Pasos de lado','equilibrio y coordinación','equilibrio',2,
 'En el pasillo o el salón, da 10 pasos laterales hacia un lado y 10 de vuelta, con la mano cerca de la pared.',
 'Da 5 pasos a cada lado, tocando la pared.',
 'hazlo dos veces, sin tocar la pared.',
 eval_std, succ_std, fail_std),

('espalda_pared','Estirar la espalda','movilidad de espalda','movilidad',2,
 'Apoya las manos en la pared a la altura del pecho, da dos pasos atrás y deja caer el tronco entre los brazos, notando el estiramiento. Aguanta 15 segundos, 3 veces.',
 'Da solo un paso atrás.',
 'aguanta 20 segundos y suelta el cuello.',
 eval_std, succ_std, fail_std),

('respirar_caminando_casa','Pasos que respiran','coordinar respiración y paso','respiracion',2,
 'Camina despacio por casa: coge aire durante 2 pasos y suéltalo durante 3 pasos. Un par de minutos, sin agobio.',
 'Hazlo de pie, quieto, marcando los pasos en el sitio.',
 'alarga a 3 pasos de entrada y 4 de salida.',
 eval_std, succ_std, fail_std),

('escalon_apoyo','El escalón','fuerza de piernas','fuerza',2,
 'En un escalón (o en el primer peldaño de casa), con la mano en la barandilla: sube un pie, sube el otro, baja uno, baja el otro. 8 veces.',
 'Hazlo 4 veces, sin prisa.',
 'cambia el pie con el que empiezas en cada ronda.',
 eval_std, succ_std, fail_std);

-- ===== NIVEL 3 · ACTIVO =====
insert into exercises (code, name, objective, category, level_id, message_body, easier_variant, harder_variant, evaluation, on_success, on_failure) values
('paseo_5min','Paseo corto','resistencia y aire libre','movilidad',3,
 'Sal a la calle y camina 5 minutos a un ritmo que te haga respirar un poco más fuerte, pero que te deje hablar.',
 'Camina a tu ritmo normal de siempre.',
 'alarga a 10 minutos o busca una cuesta suave.',
 eval_std, succ_std, fail_std),

('sentadillas_libres','Sentadillas','fuerza de piernas','fuerza',3,
 'De pie, con los pies separados al ancho de los hombros, baja como si fueras a sentarte en una silla imaginaria y sube. 10 veces.',
 'Hazlas delante de una silla real, por si acaso.',
 'baja contando 3 segundos en cada una.',
 eval_std, succ_std, fail_std),

('equilibrio_un_pie','Un pie, sin apoyo','equilibrio','equilibrio',3,
 'De pie, cerca de algo donde apoyarte si hace falta, levanta un pie y aguanta 15 segundos. Cambia. 2 veces con cada pie.',
 'Mantén un dedo apoyado en la pared.',
 'cruza los brazos sobre el pecho mientras aguantas.',
 eval_std, succ_std, fail_std),

('zancada_corta','Zancada tranquila','fuerza y estabilidad','fuerza',3,
 'Da un paso largo hacia delante, baja un poco el cuerpo, y vuelve a la posición inicial. 6 veces con cada pierna. Puedes tener una silla al lado.',
 'Da el paso más corto y baja menos.',
 'baja un poco más, siempre sin dolor.',
 eval_std, succ_std, fail_std),

('escaleras_dos_pisos','Las escaleras','piernas y corazón','fuerza',3,
 'Sube dos pisos de escaleras a tu ritmo, usando la barandilla si la necesitas. Baja en ascensor si quieres: lo que suma es subir.',
 'Sube un piso, o descansa en el descansillo.',
 'sube los dos pisos sin pararte en el descansillo.',
 eval_std, succ_std, fail_std),

('puntillas_libres','Puntillas sin apoyo','fuerza y equilibrio','equilibrio',3,
 'De pie, sin apoyarte, ponte de puntillas y baja despacio. 15 veces.',
 'Apoya un dedo en la pared.',
 'aguanta 3 segundos arriba en cada una.',
 eval_std, succ_std, fail_std),

('respiracion_paseo','Respirar caminando','capacidad pulmonar','respiracion',3,
 'Durante un paseo, coge aire durante 3 pasos y suéltalo durante 4. Mantenlo un par de minutos.',
 'Hazlo parado, en el balcón o la ventana.',
 'alarga a 4 pasos de entrada y 6 de salida.',
 eval_std, succ_std, fail_std),

('suelo_levantarse','Bajar al suelo y volver','autonomía y fuerza global','fuerza',3,
 'Siéntate en el suelo (con la ayuda que necesites) y levántate. Una sola vez, con calma. Es de los gestos más valiosos que existen.',
 'Usa una silla o la cama como apoyo para bajar y subir.',
 'repítelo 3 veces, cambiando el lado por el que te apoyas.',
 eval_std, succ_std, fail_std),

('botellas_brazos','Fuerza con botellas','fuerza de brazos','fuerza',3,
 'Con una botella de agua pequeña en cada mano, sube los brazos hacia delante hasta los hombros y baja. 10 veces.',
 'Usa botellas vacías o hazlo sin peso.',
 'sube los brazos por encima de la cabeza.',
 eval_std, succ_std, fail_std),

('inclinaciones_laterales','Lados que se estiran','movilidad de tronco','movilidad',3,
 'De pie, con una mano en la cintura, sube el otro brazo y déjate caer suavemente hacia el lado contrario. 6 veces a cada lado.',
 'Hazlo sentado, con la espalda despegada del respaldo.',
 'aguanta 3 segundos en cada inclinación.',
 eval_std, succ_std, fail_std),

('rodillas_altas','Rodillas arriba','piernas y corazón','fuerza',3,
 'Marcha en el sitio levantando las rodillas hacia la cintura durante 1 minuto. Descansa 30 segundos y repite.',
 'Levanta las rodillas solo hasta donde llegues cómodo.',
 'acelera un poco el ritmo en la segunda ronda.',
 eval_std, succ_std, fail_std),

('talon_punta_libre','La cuerda floja','equilibrio fino','equilibrio',3,
 'Camina 12 pasos en línea recta poniendo un pie justo delante del otro, talón contra punta, sin apoyo.',
 'Hazlo junto a la pared, rozándola si hace falta.',
 'hazlo también hacia atrás, despacio.',
 eval_std, succ_std, fail_std),

('puente_cadera','El puente','fuerza de glúteo y espalda','fuerza',3,
 'Tumbado boca arriba (en la cama sirve), con las rodillas dobladas, sube la cadera hacia el techo y baja despacio. 10 veces.',
 'Sube solo un poco la cadera, sin despegar la espalda entera.',
 'aguanta 3 segundos arriba en cada subida.',
 eval_std, succ_std, fail_std),

('respiracion_478','Respiración de la calma','relajación profunda','respiracion',3,
 'Sentado y tranquilo: coge aire contando 4, retenlo contando 4, y suéltalo despacio contando 6. Repite 5 veces.',
 'No retengas el aire: solo entra 4, sale 6.',
 'hazlo con los ojos cerrados, 8 veces.',
 eval_std, succ_std, fail_std),

('bailar_cancion','Una canción entera','alegría en movimiento','movilidad',3,
 'Pon una canción que te guste de verdad y báilala entera, a tu manera, como nadie te viera. Eso es todo.',
 'Báilala sentado, moviendo brazos y pies.',
 'que sean dos canciones.',
 eval_std, succ_std, fail_std);

-- Dependencia de ejemplo: bajar al suelo requiere dominar la sentadilla
insert into exercise_dependencies (exercise_id, depends_on_id)
select a.id, b.id from exercises a, exercises b
where a.code = 'suelo_levantarse' and b.code = 'sentadillas_libres'
on conflict do nothing;

end $$;
