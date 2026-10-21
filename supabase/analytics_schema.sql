-- ============================================================================
-- ANALYTICS — pengunjung unik + log pageview
-- ----------------------------------------------------------------------------
-- Jalankan sekali di Supabase SQL Editor. Aman dijalankan ulang.
-- Tulis hanya lewat RPC record_site_visit() memakai service role di server.
-- ============================================================================

-- ---------- pengunjung unik (1 baris per browser) ----------
create table if not exists public.site_visitors (
  visitor_id text primary key,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  visit_count integer not null default 1,
  pageview_count integer not null default 1,
  entry_path text,
  last_path text,
  device_type text not null default 'unknown'
    check (device_type in ('desktop', 'mobile', 'tablet', 'bot', 'unknown')),
  browser text,
  os text,
  country text,
  region text,
  city text,
  timezone text,
  language text,
  ip_hash text,
  user_agent text,
  is_bot boolean not null default false
);

-- ---------- log pageview (untuk tren & total kunjungan) ----------
create table if not exists public.site_visits (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  visitor_id text not null,
  session_id text not null,
  path text not null,
  referrer text,
  device_type text not null default 'unknown'
    check (device_type in ('desktop', 'mobile', 'tablet', 'bot', 'unknown')),
  browser text,
  os text,
  country text,
  region text,
  city text,
  timezone text,
  language text,
  screen_width integer,
  screen_height integer,
  ip_hash text,
  user_agent text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  is_bot boolean not null default false
);

create index if not exists site_visits_created_idx
  on public.site_visits (created_at desc);
create index if not exists site_visits_visitor_idx
  on public.site_visits (visitor_id, created_at desc);
create index if not exists site_visits_path_idx
  on public.site_visits (path);
create index if not exists site_visits_country_idx
  on public.site_visits (country);
create index if not exists site_visitors_last_seen_idx
  on public.site_visitors (last_seen desc);

-- ============================================================================
-- RPC: insert pageview + upsert pengunjung secara atomik
-- ============================================================================

create or replace function public.record_site_visit(
  p_visitor_id text,
  p_session_id text,
  p_new_session boolean,
  p_path text,
  p_referrer text,
  p_user_agent text,
  p_device_type text,
  p_browser text,
  p_os text,
  p_country text,
  p_region text,
  p_city text,
  p_timezone text,
  p_language text,
  p_screen_width integer,
  p_screen_height integer,
  p_ip_hash text,
  p_utm_source text,
  p_utm_medium text,
  p_utm_campaign text,
  p_is_bot boolean
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.site_visits (
    visitor_id, session_id, path, referrer, user_agent,
    device_type, browser, os, country, region, city, timezone,
    language, screen_width, screen_height, ip_hash,
    utm_source, utm_medium, utm_campaign, is_bot
  ) values (
    p_visitor_id, p_session_id, p_path, p_referrer, p_user_agent,
    p_device_type, p_browser, p_os, p_country, p_region, p_city, p_timezone,
    p_language, p_screen_width, p_screen_height, p_ip_hash,
    p_utm_source, p_utm_medium, p_utm_campaign, p_is_bot
  );

  insert into public.site_visitors (
    visitor_id, first_seen, last_seen, visit_count, pageview_count,
    entry_path, last_path, device_type, browser, os,
    country, region, city, timezone, language,
    ip_hash, user_agent, is_bot
  ) values (
    p_visitor_id, now(), now(), 1, 1,
    p_path, p_path, p_device_type, p_browser, p_os,
    p_country, p_region, p_city, p_timezone, p_language,
    p_ip_hash, p_user_agent, p_is_bot
  )
  on conflict (visitor_id) do update set
    last_seen = now(),
    visit_count = site_visitors.visit_count
      + case when p_new_session then 1 else 0 end,
    pageview_count = site_visitors.pageview_count + 1,
    last_path = excluded.last_path,
    device_type = excluded.device_type,
    browser = coalesce(excluded.browser, site_visitors.browser),
    os = coalesce(excluded.os, site_visitors.os),
    country = coalesce(excluded.country, site_visitors.country),
    region = coalesce(excluded.region, site_visitors.region),
    city = coalesce(excluded.city, site_visitors.city),
    timezone = coalesce(excluded.timezone, site_visitors.timezone),
    language = coalesce(excluded.language, site_visitors.language),
    ip_hash = coalesce(excluded.ip_hash, site_visitors.ip_hash),
    user_agent = coalesce(excluded.user_agent, site_visitors.user_agent),
    is_bot = excluded.is_bot;
end;
$$;

revoke all on function public.record_site_visit(
  text, text, boolean, text, text, text, text, text, text,
  text, text, text, text, text, integer, integer, text, text, text, text, boolean
) from public, anon, authenticated;

grant execute on function public.record_site_visit(
  text, text, boolean, text, text, text, text, text, text,
  text, text, text, text, text, integer, integer, text, text, text, text, boolean
) to service_role;

-- ---------- pembersihan data lama (opsional, panggil via pg_cron) ----------
create or replace function public.purge_site_visits(p_days integer default 180)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.site_visits
  where created_at < now() - make_interval(days => p_days);

  delete from public.site_visitors
  where last_seen < now() - make_interval(days => p_days);
end;
$$;

revoke all on function public.purge_site_visits(integer) from public, anon, authenticated;
grant execute on function public.purge_site_visits(integer) to service_role;

-- ============================================================================
-- RLS: hanya admin terautentikasi yang boleh membaca
-- ============================================================================

alter table public.site_visitors enable row level security;
alter table public.site_visits enable row level security;

revoke all on public.site_visitors, public.site_visits from anon, authenticated;
grant select on public.site_visitors, public.site_visits to authenticated;

drop policy if exists "auth read site_visitors" on public.site_visitors;
create policy "auth read site_visitors"
  on public.site_visitors for select to authenticated using (true);

drop policy if exists "auth read site_visits" on public.site_visits;
create policy "auth read site_visits"
  on public.site_visits for select to authenticated using (true);

-- ============================================================================
-- VIEW agregat harian (security_invoker agar RLS tabel dasar tetap berlaku)
-- ============================================================================

create or replace view public.site_visit_daily
with (security_invoker = true) as
select
  (created_at at time zone 'Asia/Jakarta')::date as day,
  count(*) as pageviews,
  count(distinct visitor_id) as visitors
from public.site_visits
group by 1;

create or replace view public.site_visit_page_daily
with (security_invoker = true) as
select
  (created_at at time zone 'Asia/Jakarta')::date as day,
  path,
  count(*) as pageviews,
  count(distinct visitor_id) as visitors
from public.site_visits
group by 1, 2;

create or replace view public.site_visit_country_daily
with (security_invoker = true) as
select
  (created_at at time zone 'Asia/Jakarta')::date as day,
  coalesce(country, 'unknown') as country,
  count(*) as pageviews,
  count(distinct visitor_id) as visitors
from public.site_visits
group by 1, 2;

create or replace view public.site_visit_device_daily
with (security_invoker = true) as
select
  (created_at at time zone 'Asia/Jakarta')::date as day,
  device_type,
  count(*) as pageviews,
  count(distinct visitor_id) as visitors
from public.site_visits
group by 1, 2;

revoke all on
  public.site_visit_daily,
  public.site_visit_page_daily,
  public.site_visit_country_daily,
  public.site_visit_device_daily
from anon;

grant select on
  public.site_visit_daily,
  public.site_visit_page_daily,
  public.site_visit_country_daily,
  public.site_visit_device_daily
to authenticated;
