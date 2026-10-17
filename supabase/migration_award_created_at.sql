-- ============================================================================
-- Migrasi: tambah kolom created_at ke view public.award_list
-- ----------------------------------------------------------------------------
-- API publik & chat mengurutkan award berdasarkan created_at (terbaru dulu),
-- tetapi view award_list belum mengekspos kolom tersebut. Jalankan manual di
-- Supabase SQL Editor.
-- ============================================================================

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
