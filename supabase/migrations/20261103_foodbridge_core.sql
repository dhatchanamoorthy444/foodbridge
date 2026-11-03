-- ============================================================================
-- FoodBridge — Canonical Database Migration (ADDITIVE, IDEMPOTENT)
-- Version: 2026_11_03
--
-- Review before running. This script:
--   * NEVER drops, truncates or recreates existing tables
--   * Adds missing columns (IF NOT EXISTS), constraints for NEW tables only
--   * Creates RLS policies, atomic RPCs, storage bucket and realtime publication
--   * Is safe to re-run (uses IF NOT EXISTS / schema-qualified upserts)
--
-- Run in Supabase SQL Editor as a single transaction.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- 0. Helper: safe column-add already handled by ADD COLUMN IF NOT EXISTS.
--    Extension for UUID generation (usually present).
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. PROFILES — identity + role committed at signup via trigger.
-- ----------------------------------------------------------------------------
alter table public.profiles
  add column if not exists role            text not null default 'recipient',
  add column if not exists full_name       text,
  add column if not exists phone           text,
  add column if not exists organization    text,
  add column if not exists account_type    text,            -- donor subtype / recipient type
  add column if not exists address         text,
  add column if not exists city            text,
  add column if not exists postal_code     text,
  add column if not exists latitude        numeric,
  add column if not exists longitude       numeric,
  add column if not exists beneficiary_count integer,
  add column if not exists avatar_url      text,
  add column if not exists created_at      timestamptz not null default now(),
  add column if not exists updated_at      timestamptz not null default now();

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'profiles_role_check') then
    alter table public.profiles add constraint profiles_role_check
      check (role in ('donor','recipient','admin','volunteer'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_id_fkey') then
    alter table public.profiles add constraint profiles_id_fkey
      foreign key (id) references auth.users(id) on delete cascade;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'profiles_email_key') then
    alter table public.profiles add constraint profiles_email_key unique (email);
  end if;
end $$;

create unique index if not exists profiles_email_uq on public.profiles (email);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role, phone, organization, account_type,
                               address, city, postal_code, beneficiary_count)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    coalesce(nullif(lower(new.raw_user_meta_data->>'role'), ''), 'recipient'),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'organization',
    new.raw_user_meta_data->>'account_type',
    new.raw_user_meta_data->>'address',
    new.raw_user_meta_data->>'city',
    new.raw_user_meta_data->>'postal_code',
    nullif(new.raw_user_meta_data->>'beneficiary_count','')::integer
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. ROLE HELPERS (SECURITY DEFINER — avoid RLS recursion)
-- ----------------------------------------------------------------------------
create or replace function public.current_role()
returns text language sql stable security definer set search_path = public as
$$ select role from public.profiles where id = auth.uid() $$;

create or replace function public.is_donor()
returns boolean language sql stable security definer set search_path = public as
$$ select coalesce((select role = 'donor' from public.profiles where id = auth.uid()), false) $$;

create or replace function public.is_recipient()
returns boolean language sql stable security definer set search_path = public as
$$ select coalesce((select role = 'recipient' from public.profiles where id = auth.uid()), false) $$;

-- ----------------------------------------------------------------------------
-- 3. FOOD_DONATIONS — add required listing columns
-- ----------------------------------------------------------------------------
alter table public.food_donations
  add column if not exists donor_id              uuid references auth.users(id) on delete cascade,
  add column if not exists food_name             text,
  add column if not exists food_category         text,
  add column if not exists description           text,
  add column if not exists image_path            text,
  add column if not exists quantity              numeric  not null default 0,
  add column if not exists available_quantity    numeric  not null default 0,
  add column if not exists unit                  text not null default 'kg',
  add column if not exists prepared_at           timestamptz,
  add column if not exists expires_at            timestamptz,
  add column if not exists storage_requirement   text default 'room_temperature',
  add column if not exists temperature_category  text,
  add column if not exists packaging_condition   text,
  add column if not exists is_vegetarian         boolean,
  add column if not exists allergen_info         text,
  add column if not exists pickup_address        text,
  add column if not exists area                  text,
  add column if not exists city                  text,
  add column if not exists postal_code           text,
  add column if not exists latitude              numeric,
  add column if not exists longitude             numeric,
  add column if not exists pickup_window         text,
  add column if not exists pickup_instructions   text,
  add column if not exists donor_business_name   text,
  add column if not exists contact_name          text,
  add column if not exists contact_phone         text,
  add column if not exists alternate_contact     text,
  add column if not exists status                text not null default 'available',
  add column if not exists created_at            timestamptz not null default now(),
  add column if not exists updated_at            timestamptz not null default now();

create index if not exists food_donations_donor_idx     on public.food_donations (donor_id);
create index if not exists food_donations_status_idx    on public.food_donations (status, expires_at);
create index if not exists food_donations_category_idx  on public.food_donations (food_category);
create index if not exists food_donations_city_idx      on public.food_donations (city);

-- ----------------------------------------------------------------------------
-- 4. FOOD_REQUESTS
-- ----------------------------------------------------------------------------
alter table public.food_requests
  add column if not exists donation_id        uuid references public.food_donations(id) on delete cascade,
  add column if not exists recipient_id       uuid references auth.users(id) on delete cascade,
  add column if not exists requested_quantity numeric not null default 0,
  add column if not exists unit               text not null default 'kg',
  add column if not exists contact_name       text,
  add column if not exists contact_phone      text,
  add column if not exists pickup_address     text,
  add column if not exists latitude           numeric,
  add column if not exists longitude          numeric,
  add column if not exists preferred_time     timestamptz,
  add column if not exists people_to_feed     integer,
  add column if not exists instructions       text,
  add column if not exists status             text not null default 'pending',
  add column if not exists decided_by         uuid references auth.users(id) on delete set null,
  add column if not exists decided_at         timestamptz,
  add column if not exists created_at         timestamptz not null default now(),
  add column if not exists updated_at         timestamptz not null default now();

create index if not exists food_requests_recipient_idx on public.food_requests (recipient_id);
create index if not exists food_requests_donation_idx  on public.food_requests (donation_id);

-- ----------------------------------------------------------------------------
-- 5. ALLOCATIONS
-- ----------------------------------------------------------------------------
alter table public.allocations
  add column if not exists donation_id     uuid references public.food_donations(id) on delete cascade,
  add column if not exists request_id      uuid references public.food_requests(id) on delete set null,
  add column if not exists response_id     uuid,
  add column if not exists donor_id        uuid references auth.users(id) on delete cascade,
  add column if not exists recipient_id    uuid references auth.users(id) on delete cascade,
  add column if not exists quantity        numeric not null default 0,
  add column if not exists unit            text not null default 'kg',
  add column if not exists status          text not null default 'confirmed',
  add column if not exists created_at      timestamptz not null default now(),
  add column if not exists updated_at      timestamptz not null default now();

create index if not exists allocations_donation_idx   on public.allocations (donation_id);
create index if not exists allocations_request_idx    on public.allocations (request_id);
create index if not exists allocations_recipient_idx  on public.allocations (recipient_id);
create index if not exists allocations_donor_idx      on public.allocations (donor_id);

-- ----------------------------------------------------------------------------
-- 6. PICKUPS
-- ----------------------------------------------------------------------------
alter table public.pickups
  add column if not exists allocation_id     uuid references public.allocations(id) on delete cascade,
  add column if not exists donation_id       uuid references public.food_donations(id) on delete set null,
  add column if not exists response_id       uuid,
  add column if not exists donor_id          uuid references auth.users(id) on delete cascade,
  add column if not exists recipient_id      uuid references auth.users(id) on delete cascade,
  add column if not exists scheduled_at      timestamptz,
  add column if not exists pickup_address    text,
  add column if not exists pickup_instructions text,
  add column if not exists status            text not null default 'scheduled',
  add column if not exists completed_at      timestamptz,
  add column if not exists created_at        timestamptz not null default now(),
  add column if not exists updated_at        timestamptz not null default now();

create index if not exists pickups_donor_idx     on public.pickups (donor_id);
create index if not exists pickups_recipient_idx on public.pickups (recipient_id);
create index if not exists pickups_status_idx    on public.pickups (status);

-- ----------------------------------------------------------------------------
-- 7. NOTIFICATIONS
-- ----------------------------------------------------------------------------
alter table public.notifications
  add column if not exists user_id    uuid references auth.users(id) on delete cascade,
  add column if not exists type       text not null default 'system_alert',
  add column if not exists title      text not null,
  add column if not exists message    text not null default '',
  add column if not exists read       boolean not null default false,
  add column if not exists data       jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now();

create index if not exists notifications_user_idx      on public.notifications (user_id, read);
-- idempotent-notification backstop: one row per (user,event_key); rows without
-- an event_key are exempt via the partial predicate.
create unique index if not exists notifications_user_event_uq
  on public.notifications (user_id, md5(data->>'event_key'))
  where data->>'event_key' is not null;

-- ----------------------------------------------------------------------------
-- 8. RECIPIENT_PREFERENCES + AUDIT_LOGS (presence only)
-- ----------------------------------------------------------------------------
alter table public.recipient_preferences
  add column if not exists user_id       uuid references auth.users(id) on delete cascade,
  add column if not exists city          text,
  add column if not exists categories    text[] default '{}',
  add column if not exists max_capacity  numeric,
  add column if not exists updated_at    timestamptz not null default now();

create index if not exists recipient_prefs_user_idx on public.recipient_preferences (user_id);

alter table public.audit_logs
  add column if not exists actor_id  uuid references auth.users(id) on delete set null,
  add column if not exists action    text not null default 'unknown',
  add column if not exists entity    text not null default 'unknown',
  add column if not exists entity_id text,
  add column if not exists details   jsonb not null default '{}'::jsonb,
  add column if not exists created_at timestamptz not null default now();

create index if not exists audit_logs_entity_idx on public.audit_logs (entity, entity_id);

-- ----------------------------------------------------------------------------
-- 9. UPDATED_AT triggers
-- ----------------------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $fn$ begin new.updated_at = now(); return new; $fn$;

do $$ begin
  execute 'create or replace function public.touch_updated_at() returns trigger
           language plpgsql as $fn$ begin new.updated_at = now(); return new; $fn$;';

  execute 'drop trigger if exists set_updated_at on public.food_donations';
  execute 'create trigger set_updated_at before update on public.food_donations
           for each row execute function public.touch_updated_at()';
  execute 'drop trigger if exists set_updated_at on public.food_requests';
  execute 'create trigger set_updated_at before update on public.food_requests
           for each row execute function public.touch_updated_at()';
  execute 'drop trigger if exists set_updated_at on public.allocations';
  execute 'create trigger set_updated_at before update on public.allocations
           for each row execute function public.touch_updated_at()';
  execute 'drop trigger if exists set_updated_at on public.pickups';
  execute 'create trigger set_updated_at before update on public.pickups
           for each row execute function public.touch_updated_at()';
  execute 'drop trigger if exists set_updated_at on public.profiles';
  execute 'create trigger set_updated_at before update on public.profiles
           for each row execute function public.touch_updated_at()';
end $$;

-- ----------------------------------------------------------------------------
-- 10. EMERGENCY_ALERTS — public listing + private contacts table
-- ----------------------------------------------------------------------------
create table if not exists public.emergency_food_alerts (
  id                   uuid primary key default gen_random_uuid(),
  recipient_id         uuid not null references auth.users(id) on delete cascade,
  food_name            text not null,
  food_category        text not null,
  required_quantity    numeric not null check (required_quantity > 0),
  fulfilled_quantity   numeric not null default 0 check (fulfilled_quantity >= 0),
  unit                 text not null default 'kg',
  people_to_feed       integer check (people_to_feed > 0),
  required_by          timestamptz not null,
  emergency_location   text,
  area                 text,
  city                 text,
  recipient_org_name   text,
  reason               text not null,
  additional_requirements text,
  image_path           text,
  status               text not null default 'open'
                       check (status in ('open','partially_fulfilled','fulfilled','cancelled','expired')),
  cancelled_at         timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  constraint alert_remaining_ck check (fulfilled_quantity <= required_quantity)
);

create index if not exists emergency_alerts_recipient_idx on public.emergency_food_alerts (recipient_id);
create index if not exists emergency_alerts_status_idx    on public.emergency_food_alerts (status, required_by);

create table if not exists public.emergency_alert_contacts (
  alert_id      uuid primary key references public.emergency_food_alerts(id) on delete cascade,
  contact_name  text not null,
  contact_phone text not null,
  confidence    text,
  address_exact text,
  created_at    timestamptz not null default now()
);

create table if not exists public.emergency_alert_responses (
  id                uuid primary key default gen_random_uuid(),
  alert_id          uuid not null references public.emergency_food_alerts(id) on delete cascade,
  donor_id          uuid not null references auth.users(id) on delete cascade,
  donation_id       uuid references public.food_donations(id) on delete set null,
  food_name         text not null,
  offered_quantity  numeric not null check (offered_quantity > 0),
  unit              text not null default 'kg',
  availability_note text,
  message           text,
  status            text not null default 'pending'
                    check (status in ('pending','accepted','declined','withdrawn')),
  decided_at        timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- one live response per donor per alert
create unique index if not exists emergency_resp_activation_uq
  on public.emergency_alert_responses (alert_id, donor_id)
  where status <> 'withdrawn';

create index if not exists emergency_resp_alert_idx on public.emergency_alert_responses (alert_id);
create index if not exists emergency_resp_donor_idx on public.emergency_alert_responses (donor_id);

-- late FK wiring: allocations.response_id / pickups.response_id -> emergency_alert_responses
do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'allocations_response_fkey') then
    alter table public.allocations
      add constraint allocations_response_fkey
      foreign key (response_id) references public.emergency_alert_responses(id) on delete set null;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'pickups_response_fkey') then
    alter table public.pickups
      add constraint pickups_response_fkey
      foreign key (response_id) references public.emergency_alert_responses(id) on delete set null;
  end if;
end $$;

-- ----------------------------------------------------------------------------
-- 11. ATOMIC ALLOCATION RPC  (PostgreSQL transaction, row-locked)
-- ----------------------------------------------------------------------------
create or replace function public.create_allocation(
  p_donation_id uuid,
  p_request_id  uuid,
  p_quantity    numeric
)
returns public.allocations
language plpgsql
security definer
set search_path = public
as $$
declare
  d public.food_donations%rowtype;
  r public.food_requests%rowtype;
  a public.allocations%rowtype;
  remaining numeric;
begin
  if p_quantity is null or p_quantity <= 0 then
    raise exception 'QUANTITY_INVALID: allocation quantity must be positive';
  end if;

  select * into d from public.food_donations where id = p_donation_id for update;
  if not found then raise exception 'NOT_FOUND: donation'; end if;
  if d.status not in ('available','partially_fulfilled') then
    raise exception 'DONATION_STATE: donation is %', d.status;
  end if;
  if d.expires_at is not null and d.expires_at < now() then
    raise exception 'DONATION_EXPIRED';
  end if;

  select * into r from public.food_requests where id = p_request_id for update;
  if not found then raise exception 'NOT_FOUND: request'; end if;
  if r.status <> 'pending' then
    raise exception 'REQUEST_STATE: request is %', r.status;
  end if;
  if r.donation_id is distinct from p_donation_id then
    raise exception 'MISMATCH: request does not belong to this donation';
  end if;

  remaining := d.available_quantity - p_quantity;
  if remaining < 0 then
    raise exception 'QUANTITY_EXCEEDS: only % % remaining', d.available_quantity, d.unit;
  end if;

  insert into public.allocations (donation_id, request_id, donor_id, recipient_id, quantity, unit, status)
  values (d.id, r.id, d.donor_id, r.recipient_id, p_quantity, r.unit, 'confirmed')
  returning * into a;

  update public.food_donations
     set available_quantity = remaining,
         status = case when remaining = 0 then 'completed' else 'partially_fulfilled' end
   where id = d.id;

  update public.food_requests
     set status = 'approved', decided_by = d.donor_id, decided_at = now()
   where id = r.id;

  insert into public.notifications (user_id, type, title, message, data)
  values (r.recipient_id, 'match_found', 'Food request approved',
          format('%s %s of "%s" has been allocated to you.', p_quantity, d.unit, d.food_name),
          jsonb_build_object('event_key','allocation:'||a.id,'allocation_id',a.id,'donation_id',d.id));
  insert into public.notifications (user_id, type, title, message, data)
  values (d.donor_id, 'match_found', 'Food allocated',
          format('You allocated %s %s from "%s".', p_quantity, d.unit, d.food_name),
          jsonb_build_object('event_key','allocation_donor:'||a.id,'allocation_id',a.id));

  return a;
end $$;

-- ----------------------------------------------------------------------------
-- 12. ATOMIC EMERGENCY-ACCEPT RPC
-- ----------------------------------------------------------------------------
create or replace function public.accept_emergency_response(p_response_id uuid)
returns public.allocations
language plpgsql security definer set search_path = public as $$
declare
  resp public.emergency_alert_responses%rowtype;
  alrt public.emergency_food_alerts%rowtype;
  d    public.food_donations%rowtype;
  a    public.allocations%rowtype;
  accept_qty numeric;
begin
  select * into resp from public.emergency_alert_responses where id = p_response_id for update;
  if not found then raise exception 'NOT_FOUND: response'; end if;
  if resp.status <> 'pending' then raise exception 'RESPONSE_STATE: response is %', resp.status; end if;

  select * into alrt from public.emergency_food_alerts where id = resp.alert_id for update;
  if not found then raise exception 'NOT_FOUND: alert'; end if;
  if alrt.status in ('fulfilled','cancelled','expired') then
    raise exception 'ALERT_STATE: alert is %', alrt.status;
  end if;

  accept_qty := least(resp.offered_quantity, alrt.required_quantity - alrt.fulfilled_quantity);
  if accept_qty <= 0 then
    update public.emergency_alert_responses set status='declined', decided_at=now() where id=resp.id;
    raise exception 'OVERFLOW: no remaining quantity';
  end if;

  if resp.donation_id is not null then
    select * into d from public.food_donations where id = resp.donation_id for update;
    if not found then raise exception 'NOT_FOUND: linked donation'; end if;
    if d.status not in ('available','partially_fulfilled') or d.available_quantity < accept_qty
       or (d.expires_at is not null and d.expires_at < now()) then
      raise exception 'DONATION_STATE: linked donation cannot supply % %', accept_qty, d.unit;
    end if;
  end if;

  insert into public.allocations (donation_id, response_id, donor_id, recipient_id, quantity, unit, status)
  values (resp.donation_id, resp.id, resp.donor_id, alrt.recipient_id, accept_qty, resp.unit, 'confirmed')
  returning * into a;

  update public.emergency_food_alerts
     set fulfilled_quantity = fulfilled_quantity + accept_qty,
         status = case when fulfilled_quantity + accept_qty >= required_quantity
                       then 'fulfilled' else 'partially_fulfilled' end,
         updated_at = now()
   where id = alrt.id;

  update public.emergency_alert_responses set status = 'accepted', decided_at = now(), updated_at = now() where id = resp.id;

  if resp.donation_id is not null then
    update public.food_donations
       set available_quantity = available_quantity - accept_qty,
           status = case when available_quantity - accept_qty = 0 then 'completed' else 'partially_fulfilled' end
     where id = resp.donation_id;
  end if;

  insert into public.notifications (user_id, type, title, message, data)
  values (resp.donor_id, 'match_found', 'Response accepted',
          format('"%s" accepted your offer of %s %s.', alrt.food_name, accept_qty, resp.unit),
          jsonb_build_object('event_key','alert_donor_accept:'||resp.id,'response_id',resp.id));
  insert into public.notifications (user_id, type, title, message, data)
  values (alrt.recipient_id, 'match_found', 'Donor response accepted',
          format('%s %s of %s allocated against "%s".', accept_qty, resp.unit, resp.food_name, alrt.food_name),
          jsonb_build_object('event_key','alert_recipient:'||resp.id,'response_id',resp.id));

  return a;
end $$;

-- ----------------------------------------------------------------------------
-- 13. RLS
-- ----------------------------------------------------------------------------
alter table public.profiles                  enable row level security;
alter table public.recipient_preferences     enable row level security;
alter table public.food_donations            enable row level security;
alter table public.food_requests             enable row level security;
alter table public.allocations               enable row level security;
alter table public.pickups                   enable row level security;
alter table public.notifications             enable row level security;
alter table public.audit_logs                enable row level security;
alter table public.emergency_food_alerts     enable row level security;
alter table public.emergency_alert_contacts  enable row level security;
alter table public.emergency_alert_responses enable row level security;

-- profiles: only your own profile
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles for select to authenticated using (id = auth.uid());
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated using (id = auth.uid())
  with check (id = auth.uid());

-- recipient_preferences: own
drop policy if exists rpref_own on public.recipient_preferences;
create policy rpref_own on public.recipient_preferences for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- food_donations
drop policy if exists fd_list on public.food_donations;
create policy fd_list on public.food_donations for select to authenticated using (true);
drop policy if exists fd_insert on public.food_donations;
create policy fd_insert on public.food_donations for insert to authenticated
  with check (public.is_donor() and donor_id = auth.uid());
drop policy if exists fd_update on public.food_donations;
create policy fd_update on public.food_donations for update to authenticated
  using (donor_id = auth.uid()) with check (donor_id = auth.uid());

-- food_requests
drop policy if exists fr_select on public.food_requests;
create policy fr_select on public.food_requests for select to authenticated
  using (recipient_id = auth.uid() or exists (
    select 1 from public.food_donations d
    where d.id = food_requests.donation_id and d.donor_id = auth.uid()));
drop policy if exists fr_insert on public.food_requests;
create policy fr_insert on public.food_requests for insert to authenticated
  with check (public.is_recipient() and recipient_id = auth.uid());
drop policy if exists fr_update on public.food_requests;
create policy fr_update on public.food_requests for update to authenticated
  using (recipient_id = auth.uid() or exists (
    select 1 from public.food_donations d where d.id = food_requests.donation_id and d.donor_id = auth.uid()))
  with check (true);

-- allocations
drop policy if exists alloc_select on public.allocations;
create policy alloc_select on public.allocations for select to authenticated
  using (donor_id = auth.uid() or recipient_id = auth.uid());

-- pickups
drop policy if exists pickups_select on public.pickups;
create policy pickups_select on public.pickups for select to authenticated
  using (donor_id = auth.uid() or recipient_id = auth.uid());
drop policy if exists pickups_write on public.pickups;
create policy pickups_write on public.pickups for all to authenticated
  using (donor_id = auth.uid() or recipient_id = auth.uid())
  with check (donor_id = auth.uid() or recipient_id = auth.uid());

-- notifications
drop policy if exists notif_select on public.notifications;
create policy notif_select on public.notifications for select to authenticated using (user_id = auth.uid());
drop policy if exists notif_update on public.notifications;
create policy notif_update on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- audit_logs: insert-only for authenticated, read own
drop policy if exists audit_read_own on public.audit_logs;
create policy audit_read_own on public.audit_logs for select to authenticated using (actor_id = auth.uid());
drop policy if exists audit_insert on public.audit_logs;
create policy audit_insert on public.audit_logs for insert to authenticated with check (actor_id = auth.uid());

-- emergency_food_alerts: public listing of active alerts for authenticated users
drop policy if exists alert_select on public.emergency_food_alerts;
create policy alert_select on public.emergency_food_alerts for select to authenticated using (true);
drop policy if exists alert_insert on public.emergency_food_alerts;
create policy alert_insert on public.emergency_food_alerts for insert to authenticated
  with check (public.is_recipient() and recipient_id = auth.uid());
drop policy if exists alert_update on public.emergency_food_alerts;
create policy alert_update on public.emergency_food_alerts for update to authenticated
  using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());

-- emergency contacts: creator only
drop policy if exists alert_contacts_on on public.emergency_alert_contacts;
create policy alert_contacts_on on public.emergency_alert_contacts for all to authenticated
  using (exists (select 1 from public.emergency_food_alerts a
                 where a.id = emergency_alert_contacts.alert_id and a.recipient_id = auth.uid()))
  with check (exists (select 1 from public.emergency_food_alerts a
                 where a.id = emergency_alert_contacts.alert_id and a.recipient_id = auth.uid()));

-- emergency responses
drop policy if exists resp_select on public.emergency_alert_responses;
create policy resp_select on public.emergency_alert_responses for select to authenticated
  using (donor_id = auth.uid() or exists (
    select 1 from public.emergency_food_alerts a where a.id = emergency_alert_responses.alert_id
    and a.recipient_id = auth.uid()));
drop policy if exists resp_insert on public.emergency_alert_responses;
create policy resp_insert on public.emergency_alert_responses for insert to authenticated
  with check (public.is_donor() and donor_id = auth.uid());
drop policy if exists resp_update on public.emergency_alert_responses;
create policy resp_update on public.emergency_alert_responses for update to authenticated
  using (donor_id = auth.uid() or exists (
    select 1 from public.emergency_food_alerts a where a.id = emergency_alert_responses.alert_id
    and a.recipient_id = auth.uid()))
  with check (true);

-- ----------------------------------------------------------------------------
-- 14. REALTIME PUBLICATION
-- ----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'food_donations','food_requests','allocations','pickups','notifications',
    'emergency_food_alerts','emergency_alert_responses'
  ]
  loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- 15. STORAGE — public bucket for donation images, donor-own uploads only
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('food-donation-images','food-donation-images', true)
on conflict (id) do update set public = true;

drop policy if exists fdi_insert_own on storage.objects;
create policy fdi_insert_own on storage.objects for insert to authenticated
  with check (bucket_id = 'food-donation-images'
              and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists fdi_select_all_auth on storage.objects;
create policy fdi_select_all_auth on storage.objects for select to authenticated
  using (bucket_id = 'food-donation-images');
drop policy if exists fdi_update_own on storage.objects;
create policy fdi_update_own on storage.objects for update to authenticated
  using (bucket_id = 'food-donation-images'
         and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'food-donation-images'
         and (storage.foldername(name))[1] = auth.uid()::text);

commit;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
