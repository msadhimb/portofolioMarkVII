-- ============================================================================
-- Migrasi: sort_order jadi auto-increment (identity) + created_at di view
-- Jalankan file ini di Supabase SQL Editor SETELAH schema dasar dibuat.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. UBAH sort_order MENJADI AUTO-INCREMENT (IDENTITY)
--    Nilai yang sudah ada dipertahankan; sequence disinkronkan ke MAX(sort_order).
-- ----------------------------------------------------------------------------
alter table public.projects
  alter column sort_order drop default;

alter table public.projects
  drop constraint if exists projects_sort_order_check;

alter table public.projects
  alter column sort_order add generated always as identity;

-- Sinkronkan sequence agar tidak bentrok dengan data yang sudah ada.
select setval(
  pg_get_serial_sequence('public.projects', 'sort_order'),
  coalesce((select max(sort_order) from public.projects), 1)
);

-- ----------------------------------------------------------------------------
-- 2. TAMBAH created_at KE VIEW project_list (untuk sorting terbaru)
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
  t.locale,
  t.title,
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
