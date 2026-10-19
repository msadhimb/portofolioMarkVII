-- Bucket 'cv' untuk unduhan CV (Supabase / PostgreSQL)
-- Jalankan manual di Supabase SQL Editor. Idempoten (aman dijalankan berulang).
--
-- Masalah yang diperbaiki: bucket 'cv' belum ada di project, sehingga
-- GET /api/v1/cv selalu 404 dan tombol "Download CV" di Hero gagal.

-- 1. Bucket 'cv' (publik agar bisa diunduh tanpa login, hanya PDF, maks 10 MB)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cv',
  'cv',
  true,
  10485760, -- 10 MB
  array['application/pdf']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array['application/pdf'];

-- 2. Siapa pun boleh membaca isi bucket cv (unduh)
drop policy if exists "Public read CV" on storage.objects;
create policy "Public read CV"
  on storage.objects for select to public
  using (bucket_id = 'cv');

-- 3. Hanya user login (admin) yang boleh mengunggah / mengganti CV
drop policy if exists "Authenticated upload CV" on storage.objects;
create policy "Authenticated upload CV"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'cv');

drop policy if exists "Authenticated update CV" on storage.objects;
create policy "Authenticated update CV"
  on storage.objects for update to authenticated
  using (bucket_id = 'cv');

drop policy if exists "Authenticated delete CV" on storage.objects;
create policy "Authenticated delete CV"
  on storage.objects for delete to authenticated
  using (bucket_id = 'cv');
