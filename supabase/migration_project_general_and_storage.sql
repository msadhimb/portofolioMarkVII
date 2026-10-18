-- ============================================================================
-- Migrasi: Project General Data (tagline, role, period, context) & Storage Bucket
-- Jalankan file ini di Supabase SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SETUP STORAGE BUCKET: 'projects'
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'projects',
  'projects',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];

-- Kebijakan Storage (RLS):
-- Publik bisa membaca file gambar
drop policy if exists "Public read project images" on storage.objects;
create policy "Public read project images"
  on storage.objects for select to public
  using (bucket_id = 'projects');

-- User terotentikasi (admin) bisa upload file
drop policy if exists "Authenticated upload project images" on storage.objects;
create policy "Authenticated upload project images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'projects');

-- User terotentikasi (admin) bisa update file
drop policy if exists "Authenticated update project images" on storage.objects;
create policy "Authenticated update project images"
  on storage.objects for update to authenticated
  using (bucket_id = 'projects');

-- User terotentikasi (admin) bisa hapus file
drop policy if exists "Authenticated delete project images" on storage.objects;
create policy "Authenticated delete project images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'projects');


-- ----------------------------------------------------------------------------
-- 2. TAMBAH KOLOM UMUM PADA TABEL 'projects'
-- ----------------------------------------------------------------------------
alter table public.projects
  add column if not exists tagline text not null default '',
  add column if not exists role text not null default '',
  add column if not exists period text not null default '',
  add column if not exists start_date date,
  add column if not exists end_date date,
  add column if not exists context text not null default '';


-- ----------------------------------------------------------------------------
-- 3. PERBARUI VIEW 'project_list'
--    Drop view terlebih dahulu agar tidak ada konflik tipe data, lalu buat ulang.
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

-- Berikan izin akses select view
grant select on public.project_list to anon, authenticated;
