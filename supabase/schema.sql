-- ============================================================================
-- Portfolio — Supabase schema untuk konten list (siap di-loop dari Next.js)
-- ----------------------------------------------------------------------------
-- Cara pakai (Supabase Dashboard > SQL Editor):
--   1. Jalankan file ini sekali (aman dijalankan ulang = idempoten).
--   2. Jalankan supabase/seed.sql untuk data awal (id + en, idempoten).
--
-- Tabel yang dicakup (1:1 dengan tipe di src/data):
--   projects     + translations/highlights/metrics/decisions/technologies
--     -> tipe Project            (src/data/projects.ts)
--   experiences  + translations/points/stacks
--     -> tipe Experience         (src/data/profile.ts)
--   skill_groups + translations/items
--     -> tipe SkillGroup         (src/data/profile.ts)
--   principles   + translations
--     -> tipe Principle          (src/data/localized.ts)
--
-- Contoh loop dari Next.js (@supabase/supabase-js):
--   // npm i @supabase/supabase-js  (belum ada di package.json saat ini)
--   const { data: projects } = await supabase
--     .from("project_list").select("*")
--     .eq("locale", lang).order("sort_order");
--   const { data: experiences } = await supabase
--     .from("experience_list").select("*")
--     .eq("locale", lang).order("sort_order");
--   const { data: skillGroups } = await supabase
--     .from("skill_group_list").select("*")
--     .eq("locale", lang).order("sort_order");
--   const { data: principles } = await supabase
--     .from("principle_list").select("*")
--     .eq("locale", lang).order("sort_order");
-- ============================================================================

-- ---------- extension untuk gen_random_uuid() ----------
create extension if not exists "pgcrypto";

-- ---------- helper updated_at (idempoten) ----------
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- PROJECTS
-- ============================================================================

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  image text not null default '',
  demo_url text,
  repository_url text,
  featured boolean not null default false,
  sort_order int not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_sort_idx on public.projects (sort_order);
drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

-- Teks per locale (di-loop sebagai field project.title, .tagline, dst.)
create table if not exists public.project_translations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  title text not null,
  tagline text not null default '',
  description text not null default '',
  problem text not null default '',
  role text not null default '',
  period text not null default '',
  context text not null default '',
  unique (project_id, locale)
);
create index if not exists project_translations_lookup_idx
  on public.project_translations (project_id, locale);

-- Array technologies (sama semua locale) -> di-loop TechList
create table if not exists public.project_technologies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  sort_order int not null default 0 check (sort_order >= 0)
);
create index if not exists project_technologies_lookup_idx
  on public.project_technologies (project_id, sort_order);

-- Array highlights per locale -> di-loop <ul>
create table if not exists public.project_highlights (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  body text not null,
  sort_order int not null default 0 check (sort_order >= 0)
);
create index if not exists project_highlights_lookup_idx
  on public.project_highlights (project_id, locale, sort_order);

-- Array metrics per locale -> di-loop <dl>
create table if not exists public.project_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  label text not null,
  value text not null,
  sort_order int not null default 0 check (sort_order >= 0)
);
create index if not exists project_metrics_lookup_idx
  on public.project_metrics (project_id, locale, sort_order);

-- Array decisions per locale -> di-loop <Card>
create table if not exists public.project_decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  title text not null,
  detail text not null default '',
  sort_order int not null default 0 check (sort_order >= 0)
);
create index if not exists project_decisions_lookup_idx
  on public.project_decisions (project_id, locale, sort_order);

-- ============================================================================
-- EXPERIENCES
-- ============================================================================

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  sort_order int not null default 0 check (sort_order >= 0),
  start_date date,   -- opsional, untuk sorting. NULL = tidak tahu
  end_date date,     -- NULL = masih berjalan (Present/Sekarang)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists experiences_sort_idx on public.experiences (sort_order);
drop trigger if exists experiences_updated_at on public.experiences;
create trigger experiences_updated_at
  before update on public.experiences
  for each row execute function public.handle_updated_at();

-- Teks per locale (di-loop sebagai e.role, e.org, dst.)
create table if not exists public.experience_translations (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  period text not null default '',  -- label display: "2023 — Sekarang"
  role text not null,
  org text not null,
  context text not null default '',
  unique (experience_id, locale)
);
create index if not exists experience_translations_lookup_idx
  on public.experience_translations (experience_id, locale);

-- Array points per locale -> di-loop <ul>
create table if not exists public.experience_points (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  body text not null,
  sort_order int not null default 0 check (sort_order >= 0)
);
create index if not exists experience_points_lookup_idx
  on public.experience_points (experience_id, locale, sort_order);

-- Array stack (sama semua locale) -> di-loop e.stack.join(" · ")
create table if not exists public.experience_stacks (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences (id) on delete cascade,
  name text not null,
  sort_order int not null default 0 check (sort_order >= 0)
);
create index if not exists experience_stacks_lookup_idx
  on public.experience_stacks (experience_id, sort_order);

-- ============================================================================
-- SKILL GROUPS (1:1 dengan tipe SkillGroup: { title, note, items })
-- ============================================================================

create table if not exists public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  sort_order int not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists skill_groups_sort_idx on public.skill_groups (sort_order);
drop trigger if exists skill_groups_updated_at on public.skill_groups;
create trigger skill_groups_updated_at
  before update on public.skill_groups
  for each row execute function public.handle_updated_at();

-- Teks per locale (di-loop sebagai g.title, g.note)
create table if not exists public.skill_group_translations (
  id uuid primary key default gen_random_uuid(),
  skill_group_id uuid not null references public.skill_groups (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  title text not null,
  note text not null default '',
  unique (skill_group_id, locale)
);
create index if not exists skill_group_translations_lookup_idx
  on public.skill_group_translations (skill_group_id, locale);

-- Array items (sama semua locale) -> di-loop g.items
create table if not exists public.skill_group_items (
  id uuid primary key default gen_random_uuid(),
  skill_group_id uuid not null references public.skill_groups (id) on delete cascade,
  name text not null,
  sort_order int not null default 0 check (sort_order >= 0)
);
create index if not exists skill_group_items_lookup_idx
  on public.skill_group_items (skill_group_id, sort_order);

-- ============================================================================
-- PRINCIPLES (1:1 dengan tipe Principle: { title, note })
-- ============================================================================

create table if not exists public.principles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  sort_order int not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists principles_sort_idx on public.principles (sort_order);
drop trigger if exists principles_updated_at on public.principles;
create trigger principles_updated_at
  before update on public.principles
  for each row execute function public.handle_updated_at();

-- Teks per locale (di-loop sebagai p.title, p.note)
create table if not exists public.principle_translations (
  id uuid primary key default gen_random_uuid(),
  principle_id uuid not null references public.principles (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  title text not null,
  note text not null default '',
  unique (principle_id, locale)
);
create index if not exists principle_translations_lookup_idx
  on public.principle_translations (principle_id, locale);

-- ============================================================================
-- VIEWS siap-loop: bentuk barisnya 1:1 dengan tipe Project / Experience /
-- SkillGroup / Principle. security_invoker = true agar RLS tabel base
-- tetap dihormati (tanpa ini Supabase memberi security warning dan view
-- berpotensi bypass RLS).
-- ============================================================================

create or replace view public.project_list
with (security_invoker = true) as
select
  p.slug,
  p.image,
  p.demo_url,
  p.repository_url,
  p.featured,
  p.sort_order,
  t.locale,
  t.title,
  t.tagline,
  t.description,
  t.problem,
  t.role,
  t.period,
  t.context,
  coalesce((
    select jsonb_agg(x.name order by x.sort_order)
    from public.project_technologies x
    where x.project_id = p.id
  ), '[]'::jsonb) as technologies,
  coalesce((
    select jsonb_agg(x.body order by x.sort_order)
    from public.project_highlights x
    where x.project_id = p.id and x.locale = t.locale
  ), '[]'::jsonb) as highlights,
  coalesce((
    select jsonb_agg(jsonb_build_object('label', x.label, 'value', x.value) order by x.sort_order)
    from public.project_metrics x
    where x.project_id = p.id and x.locale = t.locale
  ), '[]'::jsonb) as metrics,
  coalesce((
    select jsonb_agg(jsonb_build_object('title', x.title, 'detail', x.detail) order by x.sort_order)
    from public.project_decisions x
    where x.project_id = p.id and x.locale = t.locale
  ), '[]'::jsonb) as decisions
from public.projects p
join public.project_translations t on t.project_id = p.id;

create or replace view public.experience_list
with (security_invoker = true) as
select
  e.slug,
  e.sort_order,
  e.start_date,
  e.end_date,
  t.locale,
  t.period,
  t.role,
  t.org,
  t.context,
  coalesce((
    select jsonb_agg(x.body order by x.sort_order)
    from public.experience_points x
    where x.experience_id = e.id and x.locale = t.locale
  ), '[]'::jsonb) as points,
  coalesce((
    select jsonb_agg(x.name order by x.sort_order)
    from public.experience_stacks x
    where x.experience_id = e.id
  ), '[]'::jsonb) as stack
from public.experiences e
join public.experience_translations t on t.experience_id = e.id;

create or replace view public.skill_group_list
with (security_invoker = true) as
select
  g.slug,
  g.sort_order,
  t.locale,
  t.title,
  t.note,
  coalesce((
    select jsonb_agg(x.name order by x.sort_order)
    from public.skill_group_items x
    where x.skill_group_id = g.id
  ), '[]'::jsonb) as items
from public.skill_groups g
join public.skill_group_translations t on t.skill_group_id = g.id;

create or replace view public.principle_list
with (security_invoker = true) as
select
  p.slug,
  p.sort_order,
  t.locale,
  t.title,
  t.note
from public.principles p
join public.principle_translations t on t.principle_id = p.id;

-- Views dibaca langsung oleh anon/authenticated (RLS tetap jalan
-- via security_invoker ke tabel base di atas).
grant select on public.project_list to anon, authenticated;
grant select on public.experience_list to anon, authenticated;
grant select on public.skill_group_list to anon, authenticated;
grant select on public.principle_list to anon, authenticated;

-- ============================================================================
-- RLS: public read (anon + authenticated), write hanya authenticated.
-- DROP POLICY IF EXISTS dulu agar file aman dijalankan ulang.
-- ============================================================================

alter table public.projects enable row level security;
alter table public.project_translations enable row level security;
alter table public.project_technologies enable row level security;
alter table public.project_highlights enable row level security;
alter table public.project_metrics enable row level security;
alter table public.project_decisions enable row level security;
alter table public.experiences enable row level security;
alter table public.experience_translations enable row level security;
alter table public.experience_points enable row level security;
alter table public.experience_stacks enable row level security;
alter table public.skill_groups enable row level security;
alter table public.skill_group_translations enable row level security;
alter table public.skill_group_items enable row level security;
alter table public.principles enable row level security;
alter table public.principle_translations enable row level security;

drop policy if exists "public read projects" on public.projects;
create policy "public read projects"
  on public.projects for select to anon, authenticated using (true);
drop policy if exists "public read project_translations" on public.project_translations;
create policy "public read project_translations"
  on public.project_translations for select to anon, authenticated using (true);
drop policy if exists "public read project_technologies" on public.project_technologies;
create policy "public read project_technologies"
  on public.project_technologies for select to anon, authenticated using (true);
drop policy if exists "public read project_highlights" on public.project_highlights;
create policy "public read project_highlights"
  on public.project_highlights for select to anon, authenticated using (true);
drop policy if exists "public read project_metrics" on public.project_metrics;
create policy "public read project_metrics"
  on public.project_metrics for select to anon, authenticated using (true);
drop policy if exists "public read project_decisions" on public.project_decisions;
create policy "public read project_decisions"
  on public.project_decisions for select to anon, authenticated using (true);
drop policy if exists "public read experiences" on public.experiences;
create policy "public read experiences"
  on public.experiences for select to anon, authenticated using (true);
drop policy if exists "public read experience_translations" on public.experience_translations;
create policy "public read experience_translations"
  on public.experience_translations for select to anon, authenticated using (true);
drop policy if exists "public read experience_points" on public.experience_points;
create policy "public read experience_points"
  on public.experience_points for select to anon, authenticated using (true);
drop policy if exists "public read experience_stacks" on public.experience_stacks;
create policy "public read experience_stacks"
  on public.experience_stacks for select to anon, authenticated using (true);
drop policy if exists "public read skill_groups" on public.skill_groups;
create policy "public read skill_groups"
  on public.skill_groups for select to anon, authenticated using (true);
drop policy if exists "public read skill_group_translations" on public.skill_group_translations;
create policy "public read skill_group_translations"
  on public.skill_group_translations for select to anon, authenticated using (true);
drop policy if exists "public read skill_group_items" on public.skill_group_items;
create policy "public read skill_group_items"
  on public.skill_group_items for select to anon, authenticated using (true);
drop policy if exists "public read principles" on public.principles;
create policy "public read principles"
  on public.principles for select to anon, authenticated using (true);
drop policy if exists "public read principle_translations" on public.principle_translations;
create policy "public read principle_translations"
  on public.principle_translations for select to anon, authenticated using (true);

drop policy if exists "auth write projects" on public.projects;
create policy "auth write projects"
  on public.projects for all to authenticated using (true) with check (true);
drop policy if exists "auth write project_translations" on public.project_translations;
create policy "auth write project_translations"
  on public.project_translations for all to authenticated using (true) with check (true);
drop policy if exists "auth write project_technologies" on public.project_technologies;
create policy "auth write project_technologies"
  on public.project_technologies for all to authenticated using (true) with check (true);
drop policy if exists "auth write project_highlights" on public.project_highlights;
create policy "auth write project_highlights"
  on public.project_highlights for all to authenticated using (true) with check (true);
drop policy if exists "auth write project_metrics" on public.project_metrics;
create policy "auth write project_metrics"
  on public.project_metrics for all to authenticated using (true) with check (true);
drop policy if exists "auth write project_decisions" on public.project_decisions;
create policy "auth write project_decisions"
  on public.project_decisions for all to authenticated using (true) with check (true);
drop policy if exists "auth write experiences" on public.experiences;
create policy "auth write experiences"
  on public.experiences for all to authenticated using (true) with check (true);
drop policy if exists "auth write experience_translations" on public.experience_translations;
create policy "auth write experience_translations"
  on public.experience_translations for all to authenticated using (true) with check (true);
drop policy if exists "auth write experience_points" on public.experience_points;
create policy "auth write experience_points"
  on public.experience_points for all to authenticated using (true) with check (true);
drop policy if exists "auth write experience_stacks" on public.experience_stacks;
create policy "auth write experience_stacks"
  on public.experience_stacks for all to authenticated using (true) with check (true);
drop policy if exists "auth write skill_groups" on public.skill_groups;
create policy "auth write skill_groups"
  on public.skill_groups for all to authenticated using (true) with check (true);
drop policy if exists "auth write skill_group_translations" on public.skill_group_translations;
create policy "auth write skill_group_translations"
  on public.skill_group_translations for all to authenticated using (true) with check (true);
drop policy if exists "auth write skill_group_items" on public.skill_group_items;
create policy "auth write skill_group_items"
  on public.skill_group_items for all to authenticated using (true) with check (true);
drop policy if exists "auth write principles" on public.principles;
create policy "auth write principles"
  on public.principles for all to authenticated using (true) with check (true);
drop policy if exists "auth write principle_translations" on public.principle_translations;
create policy "auth write principle_translations"
  on public.principle_translations for all to authenticated using (true) with check (true);
