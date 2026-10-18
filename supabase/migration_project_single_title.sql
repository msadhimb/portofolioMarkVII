-- ============================================================================
-- Migrasi: Judul jadi satu field tunggal (tanpa translation)
-- - Tambah kolom `title` di tabel `projects` (data umum)
-- - Backfill dari project_translations (locale 'id')
-- - Hapus kolom `title` dari project_translations
-- - Recreate view project_list (p.title, bukan t.title)
-- Jalankan di Supabase SQL Editor SETELAH schema dasar.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TAMBAH kolom title di projects
-- ----------------------------------------------------------------------------
alter table public.projects
  add column if not exists title text not null default '';

-- ----------------------------------------------------------------------------
-- 2. BACKFILL title dari terjemahan Indonesia (fallback: English)
-- ----------------------------------------------------------------------------
update public.projects p
set title = coalesce(
  (select t.title from public.project_translations t
    where t.project_id = p.id and t.locale = 'id' and t.title <> ''
    limit 1),
  (select t.title from public.project_translations t
    where t.project_id = p.id and t.locale = 'en' and t.title <> ''
    limit 1),
  ''
);

-- ----------------------------------------------------------------------------
-- 3. DROP view dulu (view bergantung pada t.title), lalu hapus kolom title
-- ----------------------------------------------------------------------------
drop view if exists public.project_list;

alter table public.project_translations
  drop column if exists title;

-- ----------------------------------------------------------------------------
-- 4. RECREATE view project_list
-- ----------------------------------------------------------------------------
drop view if exists public.project_list;

create or replace view public.project_list
with (security_invoker = true) as
select
  p.slug,
  p.image,
  p.demo_url,
  p.repository_url,
  p.featured,
  p.sort_order,
  p.created_at,
  p.title,
  t.locale,
  coalesce(nullif(p.tagline, ''), t.tagline, '') as tagline,
  t.description,
  t.problem,
  coalesce(nullif(p.role, ''), t.role, '') as role,
  case
    when p.period is not null and p.period <> '' then p.period
    when p.start_date is not null then
      case
        when p.end_date is null then trim(to_char(p.start_date, 'Month YYYY')) || ' — Present'
        else trim(to_char(p.start_date, 'Month YYYY')) || ' — ' || trim(to_char(p.end_date, 'Month YYYY'))
      end
    else t.period
  end as period,
  coalesce(nullif(p.context, ''), t.context, '') as context,
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

grant select on public.project_list to anon, authenticated;
