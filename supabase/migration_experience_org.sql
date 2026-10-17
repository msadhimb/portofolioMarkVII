-- Migrasi experience: organisasi & periode dari data umum (tanggal)
-- Jalankan manual di Supabase SQL Editor. Tidak dieksekusi otomatis.

-- 1. Drop view yang bergantung pada experience_translations.period
--    (harus lebih dulu, kalau tidak drop column akan gagal / butuh CASCADE)
drop view if exists public.experience_list;

-- 2. Tambah kolom org pada tabel experiences (data umum)
alter table public.experiences
  add column if not exists org text not null default '';

-- 3. Hapus kolom period dan org dari experience_translations (tidak lagi per-locale)
alter table public.experience_translations
  drop column if exists period,
  drop column if exists org;

-- 4. Recreate view experience_list:
--    - org diambil dari experiences (umum)
--    - periode dihitung dari start_date / end_date (tidak disimpan terpisah)
create or replace view public.experience_list
with (security_invoker = true) as
select
  e.slug,
  e.sort_order,
  e.start_date,
  e.end_date,
  e.org,
  case
    when e.start_date is null then ''
    when e.end_date is null then trim(to_char(e.start_date, 'Month YYYY')) || ' — Present'
    else trim(to_char(e.start_date, 'Month YYYY')) || ' — ' || trim(to_char(e.end_date, 'Month YYYY'))
  end as period,
  t.locale,
  t.role,
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

-- 5. Drop view menghapus grant-nya, jadi beri ulang akses baca.
grant select on public.experience_list to anon, authenticated;
