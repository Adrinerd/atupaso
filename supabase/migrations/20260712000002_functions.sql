-- ============================================================
-- A Tu Paso — Migración 002: funciones, triggers y lógica
-- ============================================================

-- ---------- updated_at automático ----------
create function fn_set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger trg_users_updated before update on users
  for each row execute function fn_set_updated_at();
create trigger trg_subscriptions_updated before update on subscriptions
  for each row execute function fn_set_updated_at();
create trigger trg_exercises_updated before update on exercises
  for each row execute function fn_set_updated_at();

-- ---------- Emisión de eventos ----------
create function fn_emit_event(p_user uuid, p_type text, p_payload jsonb default '{}')
returns bigint language plpgsql as $$
declare v_id bigint;
begin
  insert into events (user_id, type, payload) values (p_user, p_type, p_payload)
  returning id into v_id;
  return v_id;
end $$;

-- ---------- Máquina de estados del recorrido ----------
-- Única puerta de entrada para cambiar journey_status.
create function fn_transition_journey(p_user uuid, p_to journey_status, p_reason text)
returns void language plpgsql as $$
declare
  v_from journey_status;
  v_allowed jsonb := '{
    "pendiente_onboarding": ["en_analisis","baja"],
    "en_analisis":          ["activo","baja"],
    "activo":               ["inactivo","en_pausa","baja"],
    "en_pausa":             ["activo","baja"],
    "inactivo":             ["en_recuperacion","activo","baja"],
    "en_recuperacion":      ["activo","dormido","baja"],
    "dormido":              ["activo","baja"],
    "baja":                 ["pendiente_onboarding"]
  }';
begin
  select journey_status into v_from from users where id = p_user for update;
  if v_from is null then
    raise exception 'Usuario % no existe', p_user;
  end if;
  if v_from = p_to then
    return; -- transición nula: no hacer nada, no fallar
  end if;
  if not (v_allowed -> v_from::text) ? p_to::text then
    raise exception 'Transición no permitida: % -> % (usuario %)', v_from, p_to, p_user;
  end if;

  update users set journey_status = p_to where id = p_user;
  insert into journey_history (user_id, from_status, to_status, reason)
    values (p_user, v_from, p_to, p_reason);
  perform fn_emit_event(p_user, 'journey.transition',
    jsonb_build_object('from', v_from, 'to', p_to, 'reason', p_reason));
end $$;

-- ---------- Nivel inicial ----------
-- p_score: suma del cuestionario de onboarding (0-6).
create function fn_assign_initial_level(p_user uuid, p_score integer)
returns smallint language plpgsql as $$
declare v_level smallint;
begin
  v_level := case
    when p_score <= 2 then 1  -- sentado
    when p_score <= 4 then 2  -- de pie
    else 3                    -- activo
  end;

  update users set current_level_id = v_level where id = p_user;
  insert into user_level_history (user_id, from_level_id, to_level_id, reason, changed_by)
    values (p_user, null, v_level, 'onboarding score=' || p_score, 'system');
  perform fn_emit_event(p_user, 'level.assigned',
    jsonb_build_object('level', v_level, 'score', p_score));
  return v_level;
end $$;

-- ---------- Cambio de nivel (manual o automático, siempre con historial) ----------
create function fn_change_level(p_user uuid, p_to smallint, p_reason text, p_by text)
returns void language plpgsql as $$
declare v_from smallint;
begin
  select current_level_id into v_from from users where id = p_user for update;
  if v_from = p_to then return; end if;
  update users set current_level_id = p_to where id = p_user;
  insert into user_level_history (user_id, from_level_id, to_level_id, reason, changed_by)
    values (p_user, v_from, p_to, p_reason, p_by);
  perform fn_emit_event(p_user, 'level.changed',
    jsonb_build_object('from', v_from, 'to', p_to, 'reason', p_reason, 'by', p_by));
end $$;

-- ---------- Contador de días (solo suma, nunca resta) ----------
create function fn_refresh_care_days() returns trigger
language plpgsql as $$
begin
  if new.result in ('done','done_easier','done_harder')
     and (old.result is distinct from new.result) then
    update users
      set care_days_total = (
        select count(*) from user_exercises
        where user_id = new.user_id
          and result in ('done','done_easier','done_harder')
      ),
      last_completed_at = coalesce(new.responded_at, now())
    where id = new.user_id;
  end if;
  return new;
end $$;

create trigger trg_care_days after update on user_exercises
  for each row execute function fn_refresh_care_days();

-- ---------- Selección del ejercicio del día ----------
-- Reglas: nivel del usuario, sin repetir en 14 días, dependencias dominadas,
-- sin repetir categoría de ayer, el menos enviado recientemente.
create function fn_pick_exercise(p_user uuid)
returns uuid language plpgsql as $$
declare
  v_level smallint;
  v_yesterday_cat text;
  v_exercise uuid;
begin
  select current_level_id into v_level from users where id = p_user;
  if v_level is null then return null; end if;

  select e.category into v_yesterday_cat
  from user_exercises ue join exercises e on e.id = ue.exercise_id
  where ue.user_id = p_user and ue.scheduled_for = current_date - 1;

  select e.id into v_exercise
  from exercises e
  where e.is_active
    and e.level_id = v_level
    -- no repetido en los últimos 14 días
    and not exists (
      select 1 from user_exercises ue
      where ue.user_id = p_user and ue.exercise_id = e.id
        and ue.scheduled_for > current_date - 14)
    -- dependencias dominadas (completadas al menos una vez)
    and not exists (
      select 1 from exercise_dependencies d
      where d.exercise_id = e.id
        and not exists (
          select 1 from user_exercises ue2
          where ue2.user_id = p_user and ue2.exercise_id = d.depends_on_id
            and ue2.result in ('done','done_easier','done_harder')))
  order by
    (e.category = coalesce(v_yesterday_cat, '')) asc,  -- variar categoría
    (select count(*) from user_exercises ue3
      where ue3.user_id = p_user and ue3.exercise_id = e.id) asc,
    random()
  limit 1;

  -- Red de seguridad: si el filtro de 14 días agota la biblioteca, relajarlo.
  if v_exercise is null then
    select e.id into v_exercise from exercises e
    where e.is_active and e.level_id = v_level
    order by random() limit 1;
  end if;

  return v_exercise;
end $$;

-- ---------- W3: programar el momento diario de todos los activos ----------
-- La invoca pg_cron cada mañana. Idempotente: se puede ejecutar dos veces.
create function fn_schedule_daily_moments()
returns integer language plpgsql as $$
declare
  r record;
  v_exercise uuid;
  v_count integer := 0;
begin
  for r in
    select u.id, u.full_name, u.care_days_total
    from users u
    where u.journey_status = 'activo'
      and u.subscription_status = 'active'
      and u.deleted_at is null
  loop
    v_exercise := fn_pick_exercise(r.id);
    if v_exercise is null then continue; end if;

    insert into user_exercises (user_id, exercise_id, scheduled_for)
      values (r.id, v_exercise, current_date)
      on conflict (user_id, scheduled_for) do nothing;

    insert into scheduled_messages (user_id, template_id, exercise_id, payload, due_at, idempotency_key)
      values (
        r.id,
        (select id from message_templates where code = 'momento_diario'),
        v_exercise,
        jsonb_build_object(
          'nombre', coalesce(split_part(r.full_name, ' ', 1), ''),
          'dias', r.care_days_total),
        now(),
        'daily:' || r.id || ':' || current_date)
      on conflict (idempotency_key) do nothing;

    v_count := v_count + 1;
  end loop;

  perform fn_emit_event(null, 'cron.daily_moments', jsonb_build_object('scheduled', v_count));
  return v_count;
end $$;

-- ---------- W5: mantenimiento nocturno ----------
-- Auto-ajuste de nivel + detección de inactividad. Umbrales en app_config.
create function fn_nightly_maintenance()
returns void language plpgsql as $$
declare
  r record;
  v_up_threshold int := coalesce((select (value)::int from app_config where key = 'level_up_threshold'), 5);
  v_down_threshold int := coalesce((select (value)::int from app_config where key = 'level_down_threshold'), 4);
  v_inactive_days int := coalesce((select (value)::int from app_config where key = 'inactive_after_days'), 5);
  v_dormant_days int := coalesce((select (value)::int from app_config where key = 'dormant_after_days'), 21);
  v_harder int; v_struggled int;
begin
  -- Auto-ajuste de nivel (últimos 7 días)
  for r in select id, current_level_id from users
           where journey_status = 'activo' and deleted_at is null
             and current_level_id is not null
  loop
    select
      count(*) filter (where result = 'done_harder'),
      count(*) filter (where result in ('struggled','done_easier'))
    into v_harder, v_struggled
    from user_exercises
    where user_id = r.id and scheduled_for > current_date - 7;

    if v_harder >= v_up_threshold and r.current_level_id < (select max(id) from levels) then
      perform fn_change_level(r.id, (r.current_level_id + 1)::smallint, 'auto: 7d con variante viva', 'system');
      insert into scheduled_messages (user_id, template_id, payload, due_at, idempotency_key)
        values (r.id, (select id from message_templates where code = 'cambio_nivel_sube'),
                '{}', now() + interval '5 minutes',
                'levelup:' || r.id || ':' || current_date)
        on conflict (idempotency_key) do nothing;
    elsif v_struggled >= v_down_threshold and r.current_level_id > 1 then
      perform fn_change_level(r.id, (r.current_level_id - 1)::smallint, 'auto: 7d con dificultad', 'system');
      insert into scheduled_messages (user_id, template_id, payload, due_at, idempotency_key)
        values (r.id, (select id from message_templates where code = 'cambio_nivel_ajuste'),
                '{}', now() + interval '5 minutes',
                'leveladj:' || r.id || ':' || current_date)
        on conflict (idempotency_key) do nothing;
    end if;
  end loop;

  -- Activo -> inactivo (N días sin mensaje entrante)
  for r in select id from users
           where journey_status = 'activo' and deleted_at is null
             and coalesce(last_inbound_at, created_at) < now() - (v_inactive_days || ' days')::interval
  loop
    perform fn_transition_journey(r.id, 'inactivo', 'auto: ' || v_inactive_days || ' días sin respuesta');
  end loop;

  -- Inactivo -> en_recuperacion (se programa la vuelta amable, una sola vez)
  for r in select id from users where journey_status = 'inactivo' and deleted_at is null
  loop
    insert into scheduled_messages (user_id, template_id, payload, due_at, idempotency_key)
      values (r.id, (select id from message_templates where code = 'vuelta_amable'),
              '{}', now() + interval '10 minutes',
              'recovery:' || r.id)
      on conflict (idempotency_key) do nothing;
    perform fn_transition_journey(r.id, 'en_recuperacion', 'auto: enviada vuelta amable');
  end loop;

  -- En recuperación -> dormido (dejamos de insistir: es la marca)
  for r in select id from users
           where journey_status = 'en_recuperacion' and deleted_at is null
             and coalesce(last_inbound_at, created_at) < now() - (v_dormant_days || ' days')::interval
  loop
    perform fn_transition_journey(r.id, 'dormido', 'auto: ' || v_dormant_days || ' días sin respuesta');
  end loop;

  perform fn_emit_event(null, 'cron.nightly_maintenance', '{}');
end $$;

-- ---------- Cola de salida: reclamar mensajes de forma segura ----------
-- El dispatcher la llama. SKIP LOCKED permite varios workers en paralelo.
create function fn_claim_scheduled_messages(p_batch integer default 50)
returns setof scheduled_messages language plpgsql as $$
begin
  return query
  update scheduled_messages sm
  set status = 'processing', attempts = sm.attempts + 1
  where sm.id in (
    select id from scheduled_messages
    where status = 'pending' and due_at <= now()
    order by due_at
    for update skip locked
    limit p_batch)
  returning sm.*;
end $$;

-- ---------- RGPD: derecho de supresión ----------
-- Anonimiza al usuario conservando agregados y obligaciones contables.
create function fn_forget_user(p_user uuid)
returns void language plpgsql as $$
begin
  update users set
    full_name = null,
    whatsapp_e164 = 'borrado:' || p_user,
    buyer_name = null,
    buyer_email = null,
    deleted_at = now()
  where id = p_user;

  update messages set body = '[suprimido a petición del usuario]'
    where user_id = p_user;
  update user_exercises set response_text = null where user_id = p_user;
  update scheduled_messages set status = 'cancelled'
    where user_id = p_user and status = 'pending';

  perform fn_emit_event(p_user, 'gdpr.forgotten', '{}');
end $$;

-- ---------- Vistas para el dashboard (Metabase, solo lectura) ----------
create view v_kpis as
select
  (select count(*) from users where journey_status = 'activo' and deleted_at is null)            as activos,
  (select count(*) from users where created_at > now() - interval '7 days')                      as nuevos_7d,
  (select count(*) from users where subscription_status = 'past_due')                            as con_impago,
  (select count(*) from users where journey_status in ('inactivo','en_recuperacion'))            as en_riesgo,
  (select count(*) from alerts where status = 'abierta')                                         as alertas_abiertas,
  (select coalesce(sum(amount_cents),0)/100.0 from payments
     where status = 'paid' and paid_at > date_trunc('month', now()))                             as ingresos_mes_eur,
  (select round(avg(current_level_id), 2) from users
     where journey_status = 'activo' and current_level_id is not null)                           as nivel_medio;

create view v_engagement_diario as
select
  scheduled_for,
  count(*)                                                          as enviados,
  count(*) filter (where result in ('done','done_easier','done_harder')) as completados,
  round(100.0 * count(*) filter (where result in ('done','done_easier','done_harder'))
        / nullif(count(*), 0), 1)                                   as pct_completado
from user_exercises
group by scheduled_for
order by scheduled_for desc;

create view v_usuarios_atencion as
select u.id, u.full_name, u.whatsapp_e164, u.journey_status,
       u.subscription_status, u.care_days_total, u.last_inbound_at
from users u
where u.deleted_at is null
  and (u.journey_status in ('inactivo','en_recuperacion')
       or u.subscription_status = 'past_due'
       or exists (select 1 from alerts a where a.user_id = u.id and a.status = 'abierta'))
order by u.last_inbound_at asc nulls first;
