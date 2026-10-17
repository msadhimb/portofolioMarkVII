import type { ExperienceLocale } from "./experiences"

export const experiences: ExperienceLocale[] = [
  {
    slug: "pln-pusmanpro",
    role: "Frontend Engineer",
    context: "BUMN · Enterprise systems",
    points: [
      "Membangun dashboard dan workflow approval berjenjang dengan Next.js + TypeScript untuk kebutuhan operasional dan audit.",
      "Merancang pola data fetching dengan TanStack React Query: cache per-modul, invalidasi terarah, dan loading/error state yang konsisten.",
      "Menangani form kompleks lintas peran dengan React Hook Form dan validasi terpusat.",
      "Berkolaborasi dengan backend dan QA untuk kontrak API, token lifecycle, dan laporan PDF siap cetak.",
    ],
  },
  {
    slug: "duitku",
    role: "Independent Builder",
    context: "Produk pribadi · Supabase",
    points: [
      "Merancang skema PostgreSQL dengan RLS penuh: auth, transaksi multi-wallet, kategori, wishlist, dan API key.",
      "Memisahkan data milik user (dipersist) dari data pasar live (tidak dipersist) — prinsip arsitektur yang disengaja.",
      "Membangun laporan, chart, dan portfolio monitoring dengan performa yang dijaga lewat pagination dan agregasi server-side.",
    ],
  },
  {
    slug: "freelance",
    role: "Web Developer",
    context: "Website profesional & kreatif",
    points: [
      "Membangun website company profile, landing page, dan undangan digital interaktif (termasuk DNA Wedding Invitation dengan GSAP + ScrollTrigger).",
      "Fokus pada mobile-first, optimasi media, i18n (i18next), dan deployment Vercel.",
      "Terbiasa bekerja langsung dengan client: dari brief, revisi desain, hingga serah terima.",
    ],
  },
]
