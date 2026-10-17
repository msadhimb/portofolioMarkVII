-- ============================================================================
-- Seed: Sertifikat, Award & Honor
-- ----------------------------------------------------------------------------
-- Idempotent (aman dijalankan berulang). Jalankan manual di Supabase SQL Editor
-- setelah awards_schema.sql. Turunan dari src/data/awards.id.ts & awards.en.ts.
-- ============================================================================

-- 1. TABEL UTAMA
insert into public.awards (slug, category, issue_date, expiry_date, credential_id, credential_url) values
  ('dicoding-react-expert', 'certificate', '2024', null, 'DICODING-RWD-2024-8841', 'https://www.dicoding.com/certificates/DICODING-RWD-2024-8841'),
  ('national-hackathon-2024', 'award', '2024', null, 'HACK-KOMINFO-2024-01', 'https://kominfo.go.id'),
  ('aws-cloud-practitioner', 'certificate', '2023', '2026', 'AWS-CCP-992147', 'https://aws.amazon.com/verification'),
  ('deans-list-academic-honor', 'honor', '2023', null, null, null),
  ('pln-innovation-award', 'award', '2023', null, null, null),
  ('meta-frontend-developer', 'certificate', '2022', null, 'META-FRONTEND-77312', 'https://coursera.org/verify/professional-cert/META-FRONTEND-77312')
on conflict (slug) do nothing;

-- 2. TRANSLATIONS · INDONESIA
insert into public.award_translations (award_id, locale, title, issuer, description)
select a.id, 'id', v.title, v.issuer, v.description
from (values
  ('dicoding-react-expert', 'Menjadi React Web Developer Expert', 'Dicoding Indonesia', 'Sertifikasi tingkat lanjut mencakup Clean Architecture, state management kompleks, automation testing (TDD/Cypress), PWA, dan performa web.'),
  ('national-hackathon-2024', 'Juara 1 - National Web & AI Hackathon', 'Kementerian Kominfo & Binar', 'Penghargaan juara pertama dalam kategori inovasi solusi web cerdas berbasis LLM lokal untuk inklusi digital masyarakat daerah.'),
  ('aws-cloud-practitioner', 'AWS Certified Cloud Practitioner', 'Amazon Web Services', 'Validasi pemahaman mendalam tentang arsitektur cloud, keamanan dan kepatuhan data, komputasi serverless, dan infrastruktur skalabel.'),
  ('deans-list-academic-honor', 'Dean''s List / Predikat Lulusan Terbaik Teknik Informatika', 'Fakultas Teknologi Informasi', 'Penghargaan kehormatan akademik atas capaian IPK tertinggi dan kontribusi penelitian komputasi web modern selama masa studi.'),
  ('pln-innovation-award', 'Best Contributor for Digital Workplace System', 'PLN Pusmanpro Innovation Summit', 'Pengakuan atas inisiatif refaktorisasi arsitektur approval bertingkat dan peningkatan kecepatan rendering dashboard enterprise hingga 40%.'),
  ('meta-frontend-developer', 'Meta Professional Frontend Developer', 'Meta (Coursera)', 'Kurikulum profesional komprehensif mencakup fundamental JavaScript tingkat lanjut, React, UX research, version control, dan UI responsiveness.')
) as v(slug, title, issuer, description)
join public.awards a on a.slug = v.slug
on conflict (award_id, locale) do nothing;

-- 3. TRANSLATIONS · ENGLISH
insert into public.award_translations (award_id, locale, title, issuer, description)
select a.id, 'en', v.title, v.issuer, v.description
from (values
  ('dicoding-react-expert', 'React Web Developer Expert Certification', 'Dicoding Indonesia', 'Advanced certification covering Clean Architecture, complex state management, automated testing (TDD/Cypress), PWA, and web performance.'),
  ('national-hackathon-2024', '1st Place Winner - National Web & AI Hackathon', 'Ministry of ICT & Binar', 'First place honor for developing an intelligent localized LLM web platform aimed at digital inclusion for regional communities.'),
  ('aws-cloud-practitioner', 'AWS Certified Cloud Practitioner', 'Amazon Web Services', 'Validation of foundational cloud architecture, security, compliance, serverless compute, and resilient infrastructure deployment.'),
  ('deans-list-academic-honor', 'Dean''s List / Valedictorian Honor in Informatics Engineering', 'Faculty of Information Technology', 'Academic excellence honor awarded for top graduating GPA and published research on modern web computing architecture.'),
  ('pln-innovation-award', 'Best Contributor for Digital Workplace System', 'PLN Pusmanpro Innovation Summit', 'Recognition for refactoring multi-tier approval workflows and optimizing enterprise dashboard rendering performance by 40%.'),
  ('meta-frontend-developer', 'Meta Professional Frontend Developer', 'Meta (Coursera)', 'Comprehensive curriculum spanning advanced JavaScript core concepts, React ecosystems, UX heuristics, version control, and accessibility.')
) as v(slug, title, issuer, description)
join public.awards a on a.slug = v.slug
on conflict (award_id, locale) do nothing;

-- 4. SKILLS / TAGS
insert into public.award_skills (award_id, name, sort_order)
select a.id, v.name, v.ord
from (values
  ('dicoding-react-expert', 'React', 0),
  ('dicoding-react-expert', 'Clean Architecture', 1),
  ('dicoding-react-expert', 'PWA', 2),
  ('dicoding-react-expert', 'TDD', 3),
  ('dicoding-react-expert', 'Cypress', 4),
  ('national-hackathon-2024', 'Next.js', 0),
  ('national-hackathon-2024', 'AI Integration', 1),
  ('national-hackathon-2024', 'FastAPI', 2),
  ('national-hackathon-2024', 'PostgreSQL', 3),
  ('national-hackathon-2024', 'Tailwind', 4),
  ('aws-cloud-practitioner', 'AWS', 0),
  ('aws-cloud-practitioner', 'Cloud Architecture', 1),
  ('aws-cloud-practitioner', 'S3', 2),
  ('aws-cloud-practitioner', 'Lambda', 3),
  ('aws-cloud-practitioner', 'IAM', 4),
  ('deans-list-academic-honor', 'Computer Science', 0),
  ('deans-list-academic-honor', 'Algorithms', 1),
  ('deans-list-academic-honor', 'Software Engineering', 2),
  ('deans-list-academic-honor', 'Research', 3),
  ('pln-innovation-award', 'Enterprise Architecture', 0),
  ('pln-innovation-award', 'React Query', 1),
  ('pln-innovation-award', 'Audit Logging', 2),
  ('pln-innovation-award', 'Optimization', 3),
  ('meta-frontend-developer', 'JavaScript', 0),
  ('meta-frontend-developer', 'React', 1),
  ('meta-frontend-developer', 'UI/UX', 2),
  ('meta-frontend-developer', 'Git', 3),
  ('meta-frontend-developer', 'Accessibility', 4)
) as v(slug, name, ord)
join public.awards a on a.slug = v.slug
where not exists (
  select 1 from public.award_skills s
  where s.award_id = a.id and s.name = v.name
);
