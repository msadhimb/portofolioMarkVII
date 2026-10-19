-- ============================================================================
-- Migrasi: ganti kolom `period` (teks) menjadi `start_date` & `end_date`
-- dengan tipe timestamptz. Hanya bulan & tahun yang dipakai di UI.
-- Jalankan di Supabase SQL Editor SETELAH migration_project_single_title.sql.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TAMBAH kolom start_date & end_date (timestamptz)
-- ----------------------------------------------------------------------------
alter table public.projects
  add column if not exists start_date timestamptz,
  add column if not exists end_date timestamptz;

-- ----------------------------------------------------------------------------
-- 2. BACKFILL dari kolom `period` lama (format: "Mon YYYY - Mon YYYY")
-- ----------------------------------------------------------------------------
with parsed as (
  select
    id,
    regexp_match(trim(period), '^([A-Za-z]{3,9})\s+(\d{4})') as start_parts,
    regexp_match(trim(period), '(?:-|—|–|to|s/d)\s*([A-Za-z]{3,9})\s+(\d{4})') as end_parts,
    trim(period) ~* '(present|sekarang|current|now)' as is_present,
    regexp_match(trim(period), '^(\d{4})') as start_year_only,
    regexp_match(trim(period), '(?:-|—|–|to|s/d)\s*(\d{4})') as end_year_only
  from public.projects
  where coalesce(period, '') <> ''
)
update public.projects p
set
  start_date = case
    when parsed.start_parts is not null
      then to_timestamp(parsed.start_parts[1] || ' ' || parsed.start_parts[2], 'Mon YYYY')
    when parsed.start_year_only is not null
      then to_timestamp(parsed.start_year_only[1], 'YYYY')
    else p.start_date
  end,
  end_date = case
    when parsed.is_present then null
    when parsed.end_parts is not null
      then to_timestamp(parsed.end_parts[1] || ' ' || parsed.end_parts[2], 'Mon YYYY')
    when parsed.end_year_only is not null
      then to_timestamp(parsed.end_year_only[1], 'YYYY')
    else p.end_date
  end
from parsed
where p.id = parsed.id
  and p.start_date is null;

-- ----------------------------------------------------------------------------
-- 3. HAPUS kolom period lama
-- ----------------------------------------------------------------------------
alter table public.projects
  drop column if exists period;

-- ----------------------------------------------------------------------------
-- 4. RECREATE view project_list — `period` diturunkan dari start/end date
-- ----------------------------------------------------------------------------
drop view if exists public.project_list;

create or replace view public.project_list
with (security_invoker = true) as
select
  p.id,
  p.slug,
  p.title,
  p.tagline,
  p.role,
  case
    when p.start_date is null then ''
    when p.end_date is null
      then trim(to_char(p.start_date, 'Mon YYYY')) || ' — Present'
    else trim(to_char(p.start_date, 'Mon YYYY')) || ' — ' || trim(to_char(p.end_date, 'Mon YYYY'))
  end as period,
  p.context,
  p.image,
  p.demo_url,
  p.repository_url,
  p.featured,
  p.sort_order,
  p.created_at,
  p.updated_at,
  t.locale,
  t.description,
  t.problem,
  coalesce((
    select jsonb_agg(x.name order by x.sort_order)
    from public.project_technologies x
    where x.project_id = p.id
  ), '[]'::jsonb) as technologies
from public.projects p
join public.project_translations t on t.project_id = p.id;

grant select on public.project_list to anon, authenticated;
