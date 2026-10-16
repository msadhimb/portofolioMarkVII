-- ============================================================================
-- site_settings: status availability global (1 baris singleton id=1).
-- Dibaca publik oleh Hero & Contact, ditulis hanya oleh authenticated (admin).
-- Jalankan SETELAH supabase/schema.sql. Idempoten.
-- ============================================================================

create table if not exists public.site_settings (
  id int primary key default 1 check (id = 1),
  is_available boolean not null default true,
  available_label_id text not null default 'Terbuka untuk proyek',
  available_label_en text not null default 'Available for projects',
  updated_at timestamptz not null default now()
);

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.handle_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings"
  on public.site_settings for select to anon, authenticated using (true);

drop policy if exists "auth write site_settings" on public.site_settings;
create policy "auth write site_settings"
  on public.site_settings for all to authenticated using (true) with check (true);

insert into public.site_settings (id, is_available, available_label_id, available_label_en)
values (1, true, 'Terbuka untuk proyek', 'Available for projects')
on conflict (id) do nothing;
