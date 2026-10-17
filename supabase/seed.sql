-- ============================================================================
-- Seed awal: 3 project + 3 experience (locale id + en).
-- Idempoten: aman dijalankan ulang (baris seed dihapus dulu via slug,
-- tabel anak ikut terhapus lewat ON DELETE CASCADE).
-- Jalankan SETELAH supabase/schema.sql.
-- ============================================================================

-- ---------- reset baris seed ----------
delete from public.projects
where slug in ('duitku', 'pln-pusmanpro', 'dna-wedding-invitation');

delete from public.experiences
where slug in ('pln-pusmanpro', 'duitku', 'freelance');

-- ============================================================================
-- PROJECTS (parent)
-- ============================================================================

insert into public.projects (slug, image, demo_url, repository_url, featured, sort_order) values
  ('duitku', '/images/duitku.svg', 'https://duitku.app', null, true, 1),
  ('pln-pusmanpro', '/images/pusmanpro.svg', null, null, false, 2),
  ('dna-wedding-invitation', '/images/dna.svg', 'https://dna-invitation.vercel.app', null, false, 3);

-- ---------- project_translations: id ----------
insert into public.project_translations
  (project_id, locale, title, tagline, description, problem, role, period, context)
values
  ((select id from public.projects where slug = 'duitku'), 'id',
    $$Duitku$$,
    $$Personal finance tracker yang menghormati kepemilikan data.$$,
    $$Aplikasi pelacak keuangan pribadi berbasis Next.js dan Supabase. Mencatat transaksi multi-wallet, mengelola kategori dan wishlist, menyajikan laporan serta chart, dan memantau portofolio — dengan prinsip data yang jelas.$$,
    $$Kebanyakan finance tracker mencampur data milik user dengan data pasar eksternal yang live, lalu menyimpannya tanpa alasan. Akibatnya skema membengkak, sulit diaudit, dan rawan basi. Duitku memisahkan keduanya: yang milik user dipersist dengan RLS yang ketat, yang eksternal live hanya di-fetch on-demand.$$,
    $$Solo builder — product, frontend, backend (Supabase), deployment$$,
    $$2024 — sekarang$$,
    $$Produk independen · Supabase + Next.js$$),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'id',
    $$PLN Pusmanpro$$,
    $$Sistem enterprise untuk workflow dan dashboard BUMN.$$,
    $$Aplikasi internal berbasis Next.js untuk lingkungan BUMN: dashboard operasional, alur approval berjenjang, pengelolaan data master, dan pelaporan PDF untuk kebutuhan audit dan manajemen.$$,
    $$Proses yang sebelumnya tersebar di spreadsheet dan dokumen manual sulit dilacak: siapa menyetujui apa, kapan, dan berdasarkan data versi mana. Dibutuhkan satu pintu dengan jejak audit yang bisa dipertanggungjawabkan.$$,
    $$Frontend Engineer — dashboard, workflow UI, data management$$,
    $$2023 — 2024$$,
    $$Enterprise · BUMN · tim lintas fungsi$$),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'id',
    $$DNA Wedding Invitation$$,
    $$Undangan digital sebagai visual storytelling.$$,
    $$Website undangan digital interaktif dengan narasi scroll: pembuka sinematik, galeri, hitung mundur, RSVP, dan amplop digital. Dibangun dengan Next.js, Tailwind, GSAP + ScrollTrigger.$$,
    $$Undangan digital kebanyakan terasa seperti template: berat, generik, dan tidak berkesan di HP. Tantangannya adalah membuat pengalaman yang ringan namun emosional — dibuka dalam 2 detik di koneksi seluler, tetap sinematik.$$,
    $$Frontend Engineer — motion, storytelling, performa$$,
    $$2023$$,
    $$Client work · mobile-first$$);

-- ---------- project_translations: en ----------
insert into public.project_translations
  (project_id, locale, title, tagline, description, problem, role, period, context)
values
  ((select id from public.projects where slug = 'duitku'), 'en',
    $$Duitku$$,
    $$A personal finance tracker that respects data ownership.$$,
    $$A personal finance tracking app built with Next.js and Supabase. Multi-wallet transactions, categories and wishlists, reports with charts, and portfolio monitoring — with clear data principles.$$,
    $$Most finance trackers mix user-owned data with live external market data, then persist both for no good reason. Schemas bloat, audits get hard, and data goes stale. Duitku separates the two: user data is persisted under strict RLS, live external data is only fetched on demand.$$,
    $$Solo builder — product, frontend, backend (Supabase), deployment$$,
    $$2024 — present$$,
    $$Independent product · Supabase + Next.js$$),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'en',
    $$PLN Pusmanpro$$,
    $$Enterprise system for state-company workflows and dashboards.$$,
    $$An internal Next.js application for a state-owned enterprise environment: operational dashboards, tiered approval flows, master data management, and PDF reporting for audit and management needs.$$,
    $$Processes previously scattered across spreadsheets and manual documents were hard to trace: who approved what, when, and against which version of the data. The organization needed a single front door with an accountable audit trail.$$,
    $$Frontend Engineer — dashboards, workflow UI, data management$$,
    $$2023 — 2024$$,
    $$Enterprise · State-owned · cross-functional team$$),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'en',
    $$DNA Wedding Invitation$$,
    $$A digital invitation as visual storytelling.$$,
    $$An interactive digital wedding invitation with scroll-driven narrative: a cinematic opening, gallery, countdown, RSVP, and digital envelope. Built with Next.js, Tailwind, GSAP + ScrollTrigger.$$,
    $$Most digital invitations feel templated: heavy, generic, and unimpressive on phones. The challenge was crafting an experience that feels light yet emotional — opening in 2 seconds on mobile data, still cinematic.$$,
    $$Frontend Engineer — motion, storytelling, performance$$,
    $$2023$$,
    $$Client work · mobile-first$$);

-- ---------- project_technologies (sama semua locale) ----------
insert into public.project_technologies (project_id, name, sort_order) values
  ((select id from public.projects where slug = 'duitku'), 'Next.js', 0),
  ((select id from public.projects where slug = 'duitku'), 'TypeScript', 1),
  ((select id from public.projects where slug = 'duitku'), 'Supabase', 2),
  ((select id from public.projects where slug = 'duitku'), 'PostgreSQL', 3),
  ((select id from public.projects where slug = 'duitku'), 'Row Level Security', 4),
  ((select id from public.projects where slug = 'duitku'), 'TanStack React Query', 5),
  ((select id from public.projects where slug = 'duitku'), 'Zustand', 6),
  ((select id from public.projects where slug = 'duitku'), 'React Hook Form', 7),
  ((select id from public.projects where slug = 'duitku'), 'Tailwind CSS', 8),
  ((select id from public.projects where slug = 'duitku'), 'shadcn/ui', 9),
  ((select id from public.projects where slug = 'duitku'), 'Vercel', 10),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'Next.js', 0),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'TypeScript', 1),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'TanStack React Query', 2),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'Zustand', 3),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'React Hook Form', 4),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'Axios', 5),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'Tailwind CSS', 6),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'Radix UI', 7),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'PDF tooling', 8),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'Next.js', 0),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'TypeScript', 1),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'Tailwind CSS', 2),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'GSAP', 3),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'ScrollTrigger', 4),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'Framer Motion', 5),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'Vercel', 6);

-- ---------- project_highlights: id ----------
insert into public.project_highlights (project_id, locale, body, sort_order) values
  ((select id from public.projects where slug = 'duitku'), 'id', $$Transaksi multi-wallet dengan transfer antar-dompet dan rekonsiliasi saldo$$, 0),
  ((select id from public.projects where slug = 'duitku'), 'id', $$Kategori + wishlist dengan alokasi anggaran dan progres$$, 1),
  ((select id from public.projects where slug = 'duitku'), 'id', $$Laporan bulanan, chart arus kas, dan ringkasan portofolio$$, 2),
  ((select id from public.projects where slug = 'duitku'), 'id', $$API key per-user untuk akses programmatic yang revocable$$, 3),
  ((select id from public.projects where slug = 'duitku'), 'id', $$Auth Supabase + RLS: user hanya bisa membaca tulis datanya sendiri$$, 4),
  ((select id from public.projects where slug = 'duitku'), 'id', $$Data eksternal (harga pasar) tidak dipersist — selalu live fetch dengan cache singkat$$, 5),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'id', $$Dashboard peran (role-based) dengan agregasi dan filter server-side$$, 0),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'id', $$Workflow approval bertingkat dengan status, komentar, dan riwayat$$, 1),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'id', $$Manajemen data master dengan validasi form yang ketat$$, 2),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'id', $$Ekspor laporan PDF siap cetak untuk kebutuhan formal$$, 3),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'id', $$Penanganan sesi, token refresh, dan error boundary yang konsisten$$, 4),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'id', $$Narasi scroll chapter-by-chapter dengan ScrollTrigger yang di-throttle$$, 0),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'id', $$Optimasi media agresif: gambar responsif, lazy section, preconnect font$$, 1),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'id', $$RSVP dan buku tamu dengan validasi dan anti-spam sederhana$$, 2),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'id', $$Amplop digital dan peta lokasi yang mobile-friendly$$, 3),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'id', $$Dukungan prefers-reduced-motion untuk aksesibilitas$$, 4);

-- ---------- project_highlights: en ----------
insert into public.project_highlights (project_id, locale, body, sort_order) values
  ((select id from public.projects where slug = 'duitku'), 'en', $$Multi-wallet transactions with inter-wallet transfers and balance reconciliation$$, 0),
  ((select id from public.projects where slug = 'duitku'), 'en', $$Categories + wishlists with budget allocation and progress$$, 1),
  ((select id from public.projects where slug = 'duitku'), 'en', $$Monthly reports, cash-flow charts, and portfolio summaries$$, 2),
  ((select id from public.projects where slug = 'duitku'), 'en', $$Per-user API keys for revocable programmatic access$$, 3),
  ((select id from public.projects where slug = 'duitku'), 'en', $$Supabase Auth + RLS: users can only read and write their own data$$, 4),
  ((select id from public.projects where slug = 'duitku'), 'en', $$External data (market prices) never persisted — always live-fetched with short cache$$, 5),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'en', $$Role-based dashboards with server-side aggregation and filtering$$, 0),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'en', $$Tiered approval workflows with statuses, comments, and history$$, 1),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'en', $$Master data management with strict form validation$$, 2),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'en', $$Print-ready PDF exports for formal reporting$$, 3),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'en', $$Consistent session handling, token refresh, and error boundaries$$, 4),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'en', $$Chapter-by-chapter scroll narrative with throttled ScrollTrigger$$, 0),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'en', $$Aggressive media optimization: responsive images, lazy sections, font preconnect$$, 1),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'en', $$RSVP and guestbook with validation and simple anti-spam$$, 2),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'en', $$Mobile-friendly digital envelope and venue map$$, 3),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'en', $$prefers-reduced-motion support for accessibility$$, 4);

-- ---------- project_metrics: id ----------
insert into public.project_metrics (project_id, locale, label, value, sort_order) values
  ((select id from public.projects where slug = 'duitku'), 'id', $$Query terpola$$, $$RLS-first$$, 0),
  ((select id from public.projects where slug = 'duitku'), 'id', $$State server$$, $$React Query$$, 1),
  ((select id from public.projects where slug = 'duitku'), 'id', $$State client$$, $$Zustand$$, 2),
  ((select id from public.projects where slug = 'duitku'), 'id', $$Persistensi eksternal$$, $$0 tabel$$, 3),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'id', $$Lingkungan$$, $$Enterprise$$, 0),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'id', $$Fokus$$, $$Workflow$$, 1),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'id', $$Output$$, $$Audit-ready$$, 2),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'id', $$Pendekatan$$, $$Mobile-first$$, 0),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'id', $$Motion$$, $$Scroll-driven$$, 1),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'id', $$Aksesibilitas$$, $$Reduced-motion$$, 2);

-- ---------- project_metrics: en ----------
insert into public.project_metrics (project_id, locale, label, value, sort_order) values
  ((select id from public.projects where slug = 'duitku'), 'en', $$Query pattern$$, $$RLS-first$$, 0),
  ((select id from public.projects where slug = 'duitku'), 'en', $$Server state$$, $$React Query$$, 1),
  ((select id from public.projects where slug = 'duitku'), 'en', $$Client state$$, $$Zustand$$, 2),
  ((select id from public.projects where slug = 'duitku'), 'en', $$External persistence$$, $$0 tables$$, 3),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'en', $$Environment$$, $$Enterprise$$, 0),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'en', $$Focus$$, $$Workflow$$, 1),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'en', $$Output$$, $$Audit-ready$$, 2),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'en', $$Approach$$, $$Mobile-first$$, 0),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'en', $$Motion$$, $$Scroll-driven$$, 1),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'en', $$Accessibility$$, $$Reduced-motion$$, 2);

-- ---------- project_decisions: id ----------
insert into public.project_decisions (project_id, locale, title, detail, sort_order) values
  ((select id from public.projects where slug = 'duitku'), 'id',
    $$RLS sebagai garis pertahanan, bukan sekadar filter UI$$,
    $$Setiap tabel user-scoped memakai policy auth.uid() = user_id. Service role tidak pernah terekspos ke client. API key disimpan sebagai hash dan diverifikasi di Edge Function.$$,
    0),
  ((select id from public.projects where slug = 'duitku'), 'id',
    $$React Query untuk server state, Zustand untuk UI state$$,
    $$Cache, invalidasi, dan optimistic update milik React Query. Zustand hanya menyimpan filter tanggal, wallet aktif, dan preferensi tampilan — tidak ada duplikasi source of truth.$$,
    1),
  ((select id from public.projects where slug = 'duitku'), 'id',
    $$Data pasar tidak disimpan$$,
    $$Harga portofolio di-fetch client-side saat halaman dibuka dengan stale-time pendek. Tidak ada cron sync, tidak ada tabel prices yang basi. Prinsipnya: persist hanya yang user buat.$$,
    2),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'id',
    $$Kontrak API dulu, UI kemudian$$,
    $$Setiap layar workflow dipetakan ke state machine yang eksplisit (draft → review → approved → published) sebelum komponen dibangun, sehingga edge case penolakan dan revisi tidak jadi if-else dadakan.$$,
    0),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'id',
    $$Form sebagai data, bukan sekadar input$$,
    $$React Hook Form + skema validasi terpusat membuat aturan yang sama dipakai di create, edit, dan review — mengurangi bug inkonsistensi antar peran.$$,
    1),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'id',
    $$GSAP untuk scroll, Framer Motion untuk micro-interaction$$,
    $$ScrollTrigger menangani koreografi chapter yang presisi; Framer Motion untuk fade/scale kecil pada tombol dan modal. Tidak ada dua sistem animasi yang berebut satu elemen.$$,
    0),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'id',
    $$Ceritakan dulu, hias kemudian$$,
    $$Struktur narasi (hook → cerita → detail acara → aksi) ditetapkan sebelum dekorasi. Setiap animasi harus melayani transisi antar chapter, bukan sekadar bergerak.$$,
    1);

-- ---------- project_decisions: en ----------
insert into public.project_decisions (project_id, locale, title, detail, sort_order) values
  ((select id from public.projects where slug = 'duitku'), 'en',
    $$RLS as the line of defense, not just UI filtering$$,
    $$Every user-scoped table enforces an auth.uid() = user_id policy. The service role is never exposed to the client. API keys are stored hashed and verified in an Edge Function.$$,
    0),
  ((select id from public.projects where slug = 'duitku'), 'en',
    $$React Query for server state, Zustand for UI state$$,
    $$Caching, invalidation, and optimistic updates belong to React Query. Zustand only holds date filters, the active wallet, and display preferences — no duplicated source of truth.$$,
    1),
  ((select id from public.projects where slug = 'duitku'), 'en',
    $$Market data is never stored$$,
    $$Portfolio prices are fetched client-side when the page opens, with a short stale time. No sync crons, no stale prices table. The principle: persist only what the user creates.$$,
    2),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'en',
    $$API contract first, UI second$$,
    $$Every workflow screen was mapped to an explicit state machine (draft → review → approved → published) before components were built, so rejection and revision edge cases never became improvised if-else chains.$$,
    0),
  ((select id from public.projects where slug = 'pln-pusmanpro'), 'en',
    $$Forms as data, not just inputs$$,
    $$React Hook Form plus a centralized validation schema means the same rules run on create, edit, and review — cutting cross-role inconsistency bugs.$$,
    1),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'en',
    $$GSAP for scroll, Framer Motion for micro-interactions$$,
    $$ScrollTrigger handles precise chapter choreography; Framer Motion covers small fades and scales on buttons and modals. No two animation systems ever fight over one element.$$,
    0),
  ((select id from public.projects where slug = 'dna-wedding-invitation'), 'en',
    $$Story first, decoration second$$,
    $$The narrative structure (hook → story → event details → action) was fixed before decoration. Every animation must serve a chapter transition, never just move.$$,
    1);

-- ============================================================================
-- EXPERIENCES (parent)
-- ============================================================================

insert into public.experiences (slug, sort_order, start_date, end_date, org) values
  ('pln-pusmanpro', 1, '2023-01-01', null, 'PLN Pusmanpro'),
  ('duitku', 2, '2022-01-01', null, 'Duitku'),
  ('freelance', 3, '2021-01-01', '2023-12-31', 'Freelance & Client Work');

-- ---------- experience_translations: id ----------
insert into public.experience_translations
  (experience_id, locale, role, context)
values
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'id',
    $$Frontend Engineer$$, $$BUMN · Enterprise systems$$),
  ((select id from public.experiences where slug = 'duitku'), 'id',
    $$Independent Builder$$, $$Produk pribadi · Supabase$$),
  ((select id from public.experiences where slug = 'freelance'), 'id',
    $$Web Developer$$, $$Website profesional & kreatif$$);

-- ---------- experience_translations: en ----------
insert into public.experience_translations
  (experience_id, locale, role, context)
values
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'en',
    $$Frontend Engineer$$, $$State-owned · Enterprise systems$$),
  ((select id from public.experiences where slug = 'duitku'), 'en',
    $$Independent Builder$$, $$Personal product · Supabase$$),
  ((select id from public.experiences where slug = 'freelance'), 'en',
    $$Web Developer$$, $$Professional & creative websites$$);

-- ---------- experience_points: id ----------
insert into public.experience_points (experience_id, locale, body, sort_order) values
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'id', $$Membangun dashboard dan workflow approval berjenjang dengan Next.js + TypeScript untuk kebutuhan operasional dan audit.$$, 0),
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'id', $$Merancang pola data fetching dengan TanStack React Query: cache per-modul, invalidasi terarah, dan loading/error state yang konsisten.$$, 1),
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'id', $$Menangani form kompleks lintas peran dengan React Hook Form dan validasi terpusat.$$, 2),
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'id', $$Berkolaborasi dengan backend dan QA untuk kontrak API, token lifecycle, dan laporan PDF siap cetak.$$, 3),
  ((select id from public.experiences where slug = 'duitku'), 'id', $$Merancang skema PostgreSQL dengan RLS penuh: auth, transaksi multi-wallet, kategori, wishlist, dan API key.$$, 0),
  ((select id from public.experiences where slug = 'duitku'), 'id', $$Memisahkan data milik user (dipersist) dari data pasar live (tidak dipersist) — prinsip arsitektur yang disengaja.$$, 1),
  ((select id from public.experiences where slug = 'duitku'), 'id', $$Membangun laporan, chart, dan portfolio monitoring dengan performa yang dijaga lewat pagination dan agregasi server-side.$$, 2),
  ((select id from public.experiences where slug = 'freelance'), 'id', $$Membangun website company profile, landing page, dan undangan digital interaktif (termasuk DNA Wedding Invitation dengan GSAP + ScrollTrigger).$$, 0),
  ((select id from public.experiences where slug = 'freelance'), 'id', $$Fokus pada mobile-first, optimasi media, i18n (i18next), dan deployment Vercel.$$, 1),
  ((select id from public.experiences where slug = 'freelance'), 'id', $$Terbiasa bekerja langsung dengan client: dari brief, revisi desain, hingga serah terima.$$, 2);

-- ---------- experience_points: en ----------
insert into public.experience_points (experience_id, locale, body, sort_order) values
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'en', $$Built dashboards and tiered approval workflows with Next.js + TypeScript for operational and audit needs.$$, 0),
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'en', $$Designed data-fetching patterns with TanStack React Query: per-module caching, targeted invalidation, and consistent loading/error states.$$, 1),
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'en', $$Handled complex cross-role forms with React Hook Form and centralized validation.$$, 2),
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'en', $$Collaborated with backend and QA on API contracts, token lifecycles, and print-ready PDF reports.$$, 3),
  ((select id from public.experiences where slug = 'duitku'), 'en', $$Designed a PostgreSQL schema with full RLS: auth, multi-wallet transactions, categories, wishlists, and API keys.$$, 0),
  ((select id from public.experiences where slug = 'duitku'), 'en', $$Separated user-owned data (persisted) from live market data (never persisted) — a deliberate architecture principle.$$, 1),
  ((select id from public.experiences where slug = 'duitku'), 'en', $$Built reports, charts, and portfolio monitoring kept fast via pagination and server-side aggregation.$$, 2),
  ((select id from public.experiences where slug = 'freelance'), 'en', $$Built company profiles, landing pages, and interactive digital invitations (including DNA Wedding Invitation with GSAP + ScrollTrigger).$$, 0),
  ((select id from public.experiences where slug = 'freelance'), 'en', $$Focused on mobile-first, media optimization, i18n (i18next), and Vercel deployment.$$, 1),
  ((select id from public.experiences where slug = 'freelance'), 'en', $$Used to working directly with clients: from brief and design revisions to handover.$$, 2);

-- ---------- experience_stacks (sama semua locale) ----------
insert into public.experience_stacks (experience_id, name, sort_order) values
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'Next.js', 0),
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'TypeScript', 1),
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'React Query', 2),
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'Zustand', 3),
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'Tailwind', 4),
  ((select id from public.experiences where slug = 'pln-pusmanpro'), 'Axios', 5),
  ((select id from public.experiences where slug = 'duitku'), 'Next.js', 0),
  ((select id from public.experiences where slug = 'duitku'), 'Supabase', 1),
  ((select id from public.experiences where slug = 'duitku'), 'PostgreSQL', 2),
  ((select id from public.experiences where slug = 'duitku'), 'React Query', 3),
  ((select id from public.experiences where slug = 'duitku'), 'shadcn/ui', 4),
  ((select id from public.experiences where slug = 'freelance'), 'React', 0),
  ((select id from public.experiences where slug = 'freelance'), 'Next.js', 1),
  ((select id from public.experiences where slug = 'freelance'), 'GSAP', 2),
  ((select id from public.experiences where slug = 'freelance'), 'i18next', 3),
  ((select id from public.experiences where slug = 'freelance'), 'Tailwind', 4),
  ((select id from public.experiences where slug = 'freelance'), 'Vercel', 5);
