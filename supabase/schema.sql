-- ============================================================================
-- Portfolio — Supabase schema untuk list project & experience (siap di-loop)
-- ----------------------------------------------------------------------------
-- Cara pakai (Supabase Dashboard > SQL Editor):
--   1. Jalankan file ini sekali (DDL + RLS + views).
--   2. Jalankan supabase/seed.sql untuk data awal (id + en, idempoten).
--
-- Contoh loop dari Next.js (@supabase/supabase-js):
--   // satu query -> langsung .map() seperti data lokal sekarang
--   const { data: projects } = await supabase
--     .from("project_list").select("*")
--     .eq("locale", lang).order("sort_order");
--   const { data: experiences } = await supabase
--     .from("experience_list").select("*")
--     .eq("locale", lang).order("sort_order");
-- ============================================================================

-- ---------- helper updated_at ----------
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

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  image text not null default '',
  demo_url text,
  repository_url text,
  featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_sort_idx on public.projects (sort_order);
create trigger projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

-- Teks per locale (di-loop sebagai field project.title, .tagline, dst.)
create table public.project_translations (
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
create index project_translations_lookup_idx
  on public.project_translations (project_id, locale);

-- Array technologies (sama semua locale) -> di-loop TechList
create table public.project_technologies (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  sort_order int not null default 0
);
create index project_technologies_lookup_idx
  on public.project_technologies (project_id, sort_order);

-- Array highlights per locale -> di-loop <ul>
create table public.project_highlights (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  body text not null,
  sort_order int not null default 0
);
create index project_highlights_lookup_idx
  on public.project_highlights (project_id, locale, sort_order);

-- Array metrics per locale -> di-loop <dl>
create table public.project_metrics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  label text not null,
  value text not null,
  sort_order int not null default 0
);
create index project_metrics_lookup_idx
  on public.project_metrics (project_id, locale, sort_order);

-- Array decisions per locale -> di-loop <Card>
create table public.project_decisions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  title text not null,
  detail text not null default '',
  sort_order int not null default 0
);
create index project_decisions_lookup_idx
  on public.project_decisions (project_id, locale, sort_order);

-- ============================================================================
-- EXPERIENCES
-- ============================================================================

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9-]+$'),
  sort_order int not null default 0,
  start_date date,   -- opsional, untuk sorting. NULL = tidak tahu
  end_date date,     -- NULL = masih berjalan (Present/Sekarang)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index experiences_sort_idx on public.experiences (sort_order);
create trigger experiences_updated_at
  before update on public.experiences
  for each row execute function public.handle_updated_at();

-- Teks per locale (di-loop sebagai e.role, e.org, dst.)
create table public.experience_translations (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  period text not null default '',  -- label display: "2023 — Sekarang"
  role text not null,
  org text not null,
  context text not null default '',
  unique (experience_id, locale)
);
create index experience_translations_lookup_idx
  on public.experience_translations (experience_id, locale);

-- Array points per locale -> di-loop <ul>
create table public.experience_points (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences (id) on delete cascade,
  locale text not null check (locale in ('id', 'en')),
  body text not null,
  sort_order int not null default 0
);
create index experience_points_lookup_idx
  on public.experience_points (experience_id, locale, sort_order);

-- Array stack (sama semua locale) -> di-loop e.stack.join(" · ")
create table public.experience_stacks (
  id uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences (id) on delete cascade,
  name text not null,
  sort_order int not null default 0
);
create index experience_stacks_lookup_idx
  on public.experience_stacks (experience_id, sort_order);

-- ============================================================================
-- VIEWS siap-loop: bentuk barisnya 1:1 dengan tipe Project / Experience
-- ============================================================================

create or replace view public.project_list as
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

create or replace view public.experience_list as
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

-- ============================================================================
-- RLS: public read (anon + authenticated), write hanya authenticated
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

create policy "public read projects"
  on public.projects for select to anon, authenticated using (true);
create policy "public read project_translations"
  on public.project_translations for select to anon, authenticated using (true);
create policy "public read project_technologies"
  on public.project_technologies for select to anon, authenticated using (true);
create policy "public read project_highlights"
  on public.project_highlights for select to anon, authenticated using (true);
create policy "public read project_metrics"
  on public.project_metrics for select to anon, authenticated using (true);
create policy "public read project_decisions"
  on public.project_decisions for select to anon, authenticated using (true);
create policy "public read experiences"
  on public.experiences for select to anon, authenticated using (true);
create policy "public read experience_translations"
  on public.experience_translations for select to anon, authenticated using (true);
create policy "public read experience_points"
  on public.experience_points for select to anon, authenticated using (true);
create policy "public read experience_stacks"
  on public.experience_stacks for select to anon, authenticated using (true);

create policy "auth write projects"
  on public.projects for all to authenticated using (true) with check (true);
create policy "auth write project_translations"
  on public.project_translations for all to authenticated using (true) with check (true);
create policy "auth write project_technologies"
  on public.project_technologies for all to authenticated using (true) with check (true);
create policy "auth write project_highlights"
  on public.project_highlights for all to authenticated using (true) with check (true);
create policy "auth write project_metrics"
  on public.project_metrics for all to authenticated using (true) with check (true);
create policy "auth write project_decisions"
  on public.project_decisions for all to authenticated using (true) with check (true);
create policy "auth write experiences"
  on public.experiences for all to authenticated using (true) with check (true);
create policy "auth write experience_translations"
  on public.experience_translations for all to authenticated using (true) with check (true);
create policy "auth write experience_points"
  on public.experience_points for all to authenticated using (true) with check (true);
create policy "auth write experience_stacks"
  on public.experience_stacks for all to authenticated using (true) with check (true);
