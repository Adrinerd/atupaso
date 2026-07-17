-- ============================================================
-- A Tu Paso — Migración 003: tareas programadas (pg_cron)
--
-- ⚠️ SOLO PARA SUPABASE (o Postgres con pg_cron y pg_net).
-- En local/pruebas puede omitirse: las funciones se pueden
-- invocar a mano (select fn_schedule_daily_moments(); …).
--
-- NOTA de zona horaria: pg_cron corre en UTC.
--   07:30 en Madrid = 05:30 UTC en verano, 06:30 UTC en invierno.
--   Usamos 06:00 UTC como término medio estable (07:00/08:00 local).
-- ============================================================

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- W3: momento diario de todos los usuarios activos
select cron.schedule(
  'daily-moments',
  '0 6 * * *',
  $$select fn_schedule_daily_moments()$$
);

-- W5: mantenimiento nocturno (niveles, inactividad)
select cron.schedule(
  'nightly-maintenance',
  '30 2 * * *',
  $$select fn_nightly_maintenance()$$
);

-- Dispatcher: procesar la cola de salida cada minuto.
-- Invoca la Edge Function por HTTP. Sustituir <PROJECT_REF> por el
-- identificador del proyecto de Supabase, y guardar antes el service key:
--   select vault.create_secret('<SERVICE_ROLE_KEY>', 'service_role_key');
select cron.schedule(
  'dispatcher',
  '* * * * *',
  $$
  select net.http_post(
    url     := 'https://<PROJECT_REF>.supabase.co/functions/v1/dispatcher',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'service_role_key')
    ),
    body    := '{}'::jsonb
  )
  $$
);
