-- ============================================================
-- A Tu Paso — Migración 001: esquema base
-- Fuente de verdad única. Ver docs/ARQUITECTURA.md
-- ============================================================

-- ============ CONFIGURACIÓN ============
create table app_config (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

comment on table app_config is
  'Parámetros del sistema: número de WhatsApp, umbrales de nivel, hora de envío… Cambiar aquí, no en código.';

-- ============ CATÁLOGOS ============
create table levels (
  id          smallint primary key,
  code        text unique not null,
  name        text not null,
  description text,
  sort_order  smallint not null
);

create table exercises (
  id                uuid primary key default gen_random_uuid(),
  code              text unique not null,
  name              text not null,
  objective         text not null,
  category          text not null check (category in ('fuerza','movilidad','equilibrio','respiracion')),
  level_id          smallint not null references levels(id),
  duration_minutes  smallint not null default 3,
  message_body      text not null,
  easier_variant    text not null,
  harder_variant    text not null,
  expected_response text not null default 'confirmacion',
  evaluation        jsonb not null default '{}',
  on_success        jsonb not null default '{}',
  on_failure        jsonb not null default '{}',
  is_active         boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);
create index exercises_level_active_idx on exercises (level_id) where is_active;

create table exercise_dependencies (
  exercise_id   uuid not null references exercises(id) on delete cascade,
  depends_on_id uuid not null references exercises(id) on delete cascade,
  primary key (exercise_id, depends_on_id),
  check (exercise_id <> depends_on_id)
);

create table message_templates (
  id            uuid primary key default gen_random_uuid(),
  code          text unique not null,
  body          text not null,
  meta_template text,
  is_active     boolean not null default true
);

comment on column message_templates.meta_template is
  'Nombre de la plantilla aprobada en Meta. Solo necesario si el mensaje puede salir fuera de la ventana de 24 h.';

-- ============ PERSONAS ============
create type subscription_status as enum
  ('incomplete','active','past_due','canceled');

create type journey_status as enum
  ('pendiente_onboarding','en_analisis','activo','en_pausa',
   'inactivo','en_recuperacion','dormido','baja');

create table users (
  id                  uuid primary key default gen_random_uuid(),
  full_name           text,
  whatsapp_e164       text unique not null,
  timezone            text not null default 'Europe/Madrid',
  is_gift             boolean not null default false,
  buyer_name          text,
  buyer_email         text,
  stripe_customer_id  text unique,
  subscription_status subscription_status not null default 'incomplete',
  journey_status      journey_status not null default 'pendiente_onboarding',
  current_level_id    smallint references levels(id),
  care_days_total     integer not null default 0,
  last_inbound_at     timestamptz,
  last_completed_at   timestamptz,
  consent_at          timestamptz,
  deleted_at          timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index users_journey_idx on users (journey_status) where deleted_at is null;
create index users_subscription_idx on users (subscription_status) where deleted_at is null;

create table subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references users(id),
  stripe_subscription_id text unique not null,
  status                 subscription_status not null,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index subscriptions_user_idx on subscriptions (user_id);

create table payments (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references users(id),
  stripe_invoice_id text unique not null,
  amount_cents      integer not null,
  currency          text not null default 'eur',
  status            text not null check (status in ('paid','failed','refunded')),
  paid_at           timestamptz,
  created_at        timestamptz not null default now()
);
create index payments_user_idx on payments (user_id, created_at desc);

-- ============ CONVERSACIÓN ============
create type msg_direction as enum ('in','out');
create type msg_status as enum
  ('received','queued','sent','delivered','read','failed');

create table messages (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references users(id),
  direction     msg_direction not null,
  wa_message_id text unique,
  template_id   uuid references message_templates(id),
  body          text not null,
  status        msg_status not null,
  error         text,
  created_at    timestamptz not null default now()
);
create index messages_user_idx on messages (user_id, created_at desc);

create table scheduled_messages (
  id              bigint generated always as identity primary key,
  user_id         uuid not null references users(id),
  template_id     uuid references message_templates(id),
  exercise_id     uuid references exercises(id),
  payload         jsonb not null default '{}',
  due_at          timestamptz not null,
  status          text not null default 'pending'
                  check (status in ('pending','processing','sent','cancelled','failed')),
  attempts        smallint not null default 0,
  last_error      text,
  idempotency_key text unique not null,
  created_at      timestamptz not null default now()
);
create index scheduled_due_idx on scheduled_messages (due_at) where status = 'pending';

-- ============ ACTIVIDAD ============
create type exercise_result as enum
  ('pending','done','done_easier','done_harder','skipped','struggled');

create table user_exercises (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references users(id),
  exercise_id   uuid not null references exercises(id),
  scheduled_for date not null,
  sent_at       timestamptz,
  responded_at  timestamptz,
  result        exercise_result not null default 'pending',
  response_text text,
  evaluated_by  text check (evaluated_by in ('rule','ai','human')),
  created_at    timestamptz not null default now(),
  unique (user_id, scheduled_for)
);
create index user_exercises_user_idx on user_exercises (user_id, scheduled_for desc);

create table user_level_history (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references users(id),
  from_level_id smallint references levels(id),
  to_level_id   smallint not null references levels(id),
  reason        text not null,
  changed_by    text not null check (changed_by in ('system','ai','human')),
  created_at    timestamptz not null default now()
);

create table journey_history (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references users(id),
  from_status journey_status,
  to_status   journey_status not null,
  reason      text not null,
  created_at  timestamptz not null default now()
);

-- ============ EVENTOS Y ALERTAS ============
create table events (
  id         bigint generated always as identity primary key,
  user_id    uuid references users(id),
  type       text not null,
  payload    jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index events_type_idx on events (type, created_at desc);
create index events_user_idx on events (user_id, created_at desc);

comment on table events is 'Append-only. Nunca se actualiza ni se borra.';

create table alerts (
  id          bigint generated always as identity primary key,
  user_id     uuid references users(id),
  type        text not null,
  severity    text not null default 'media' check (severity in ('baja','media','alta')),
  status      text not null default 'abierta' check (status in ('abierta','resuelta')),
  payload     jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);
create index alerts_open_idx on alerts (status, severity);

-- Idempotencia de webhooks externos (Stripe, Meta)
create table webhook_events (
  provider    text not null,
  external_id text not null,
  received_at timestamptz not null default now(),
  primary key (provider, external_id)
);

-- ============ SEGURIDAD: RLS deny-by-default ============
-- Solo el rol de servicio (Edge Functions) accede. Sin políticas públicas.
alter table app_config            enable row level security;
alter table levels                enable row level security;
alter table exercises             enable row level security;
alter table exercise_dependencies enable row level security;
alter table message_templates     enable row level security;
alter table users                 enable row level security;
alter table subscriptions         enable row level security;
alter table payments              enable row level security;
alter table messages              enable row level security;
alter table scheduled_messages    enable row level security;
alter table user_exercises        enable row level security;
alter table user_level_history    enable row level security;
alter table journey_history       enable row level security;
alter table events                enable row level security;
alter table alerts                enable row level security;
alter table webhook_events        enable row level security;
