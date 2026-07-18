-- ============================================================
-- A Tu Paso — Migración 004: modo de canal (Fase 2, concierge)
--
-- El canal de salida es un interruptor de configuración:
--   'manual' → el fundador envía con su WhatsApp; el panel /operador
--              muestra el guion diario y registra los resultados.
--   'meta'   → el dispatcher envía solo por la Cloud API (Fase 3).
-- ============================================================

insert into app_config (key, value) values ('channel_mode', '"manual"')
on conflict (key) do nothing;

-- Guion del día para el panel del operador: qué enviar, a quién, con el
-- texto ya compuesto (mismas variables que usa el dispatcher).
create or replace view v_guion_de_hoy as
select
  sm.id              as scheduled_id,
  u.id               as user_id,
  coalesce(split_part(u.full_name, ' ', 1), '') as nombre,
  u.whatsapp_e164,
  u.care_days_total,
  mt.code            as template_code,
  e.code             as exercise_code,
  -- Cuerpo final, con las variables resueltas
  replace(replace(replace(replace(replace(
    coalesce(mt.body, sm.payload->>'body', ''),
    '{{nombre}}', coalesce(sm.payload->>'nombre', split_part(coalesce(u.full_name,''), ' ', 1))),
    '{{dias}}',   coalesce(sm.payload->>'dias', u.care_days_total::text)),
    '{{ejercicio}}',      coalesce(e.message_body, '')),
    '{{variante_facil}}', coalesce(e.easier_variant, '')),
    '{{variante_viva}}',  coalesce(e.harder_variant, ''))
                     as body,
  sm.due_at,
  sm.status
from scheduled_messages sm
join users u  on u.id = sm.user_id and u.deleted_at is null
left join message_templates mt on mt.id = sm.template_id
left join exercises e          on e.id  = sm.exercise_id
where sm.status = 'pending'
  and sm.due_at <= now()
order by sm.due_at;
