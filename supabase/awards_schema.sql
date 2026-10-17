-- ============================================================================
-- Schema: Sertifikat, Award & Honor (Supabase / PostgreSQL)
-- ----------------------------------------------------------------------------
-- Menampung data sertifikat profesional, penghargaan, dan honor/prestasi
-- yang mendukung multilingual (ID & EN), siap di-loop atau diakses lewat API.
-- ============================================================================

create extension if not exists "pgcrypto";

-- Helper updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 1. TABEL UTAMA: AWARDS
create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  category text not null check (category in ('certificate', 'award', 'honor')),
  sort_order int not null default 0 check (sort_order >= 0),
  issue_date text not null default '',
  expiry_date text,
  credential_id text,
  credential_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists awards_sort_idx on public.awards (sort_order);
create index if not exists awards_category_idx on public.awards (category);

drop trigger if exists awards_updated_at on public.awards;
create trigger awards_updated_at
  before update on public.awards
  for each row execute function public.handle_updated_at();

-- 2. TABEL TRANSLATIONS: PER LOCALE (ID & EN)
create table if not exists public.award_translations (
  id uuid primary key default gen_random_uuid(),
  award_id uuid not null references public.awards (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  title text not null,
  issuer text not null default '',
  description text not null default '',
  unique (award_id, locale)
);

create index if not exists award_translations_lookup_idx
  on public.award_translations (award_id, locale);

-- 3. TABEL SKILLS / TAGS TERKAIT
create table if not exists public.award_skills (
  id uuid primary key default gen_random_uuid(),
  award_id uuid not null references public.awards (id) on delete cascade,
  name text not null,
  sort_order int not null default 0 check (sort_order >= 0)
);

create index if not exists award_skills_lookup_idx
  on public.award_skills (award_id, sort_order);

-- 4. VIEW LIST PER LOCALE (AGREGASI JSON SIAP KONSUMSI FRONTEND)
create or replace view public.award_list as
select
  a.id,
  a.slug,
  a.category,
  a.sort_order,
  a.issue_date,
  a.expiry_date,
  a.credential_id,
  a.credential_url,
  t.locale,
  t.title,
  t.issuer,
  t.description,
  coalesce(
    (
      select array_agg(s.name order by s.sort_order)
      from public.award_skills s
      where s.award_id = a.id
    ),
    array[]::text[]
  ) as skills,
  a.created_at
from public.awards a
join public.award_translations t on t.award_id = a.id;

grant select on public.award_list to anon, authenticated;

-- 5. ROW LEVEL SECURITY (RLS)
alter table public.awards enable row level security;
alter table public.award_translations enable row level security;
alter table public.award_skills enable row level security;

create policy "Public can read awards"
  on public.awards for select using (true);

create policy "Public can read award translations"
  on public.award_translations for select using (true);

create policy "Public can read award skills"
  on public.award_skills for select using (true);

create policy "Admins can manage awards"
  on public.awards for all to authenticated using (true);

create policy "Admins can manage award translations"
  on public.award_translations for all to authenticated using (true);

create policy "Admins can manage award skills"
  on public.award_skills for all to authenticated using (true);
