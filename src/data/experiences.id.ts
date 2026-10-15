import type { Experience } from "./profile";

export const experiences: Experience[] = [
    {
      slug: "pln-pusmanpro",
      period: "2023 — Sekarang",
      role: "Frontend Engineer",
      org: "PLN Pusmanpro",
      context: "BUMN · Enterprise systems",
      points: [
        "Membangun dashboard dan workflow approval berjenjang dengan Next.js + TypeScript untuk kebutuhan operasional dan audit.",
        "Merancang pola data fetching dengan TanStack React Query: cache per-modul, invalidasi terarah, dan loading/error state yang konsisten.",
        "Menangani form kompleks lintas peran dengan React Hook Form dan validasi terpusat.",
        "Berkolaborasi dengan backend dan QA untuk kontrak API, token lifecycle, dan laporan PDF siap cetak.",
      ],
      stack: ["Next.js", "TypeScript", "React Query", "Zustand", "Tailwind", "Axios"],
    },
    {
      slug: "duitku",
      period: "2022 — Sekarang",
      role: "Independent Builder",
      org: "Duitku",
      context: "Produk pribadi · Supabase",
      points: [
        "Merancang skema PostgreSQL dengan RLS penuh: auth, transaksi multi-wallet, kategori, wishlist, dan API key.",
        "Memisahkan data milik user (dipersist) dari data pasar live (tidak dipersist) — prinsip arsitektur yang disengaja.",
        "Membangun laporan, chart, dan portfolio monitoring dengan performa yang dijaga lewat pagination dan agregasi server-side.",
      ],
      stack: ["Next.js", "Supabase", "PostgreSQL", "React Query", "shadcn/ui"],
    },
    {
      slug: "freelance",
      period: "2021 — 2023",
      role: "Web Developer",
      org: "Freelance & Client Work",
      context: "Website profesional & kreatif",
      points: [
        "Membangun website company profile, landing page, dan undangan digital interaktif (termasuk DNA Wedding Invitation dengan GSAP + ScrollTrigger).",
        "Fokus pada mobile-first, optimasi media, i18n (i18next), dan deployment Vercel.",
        "Terbiasa bekerja langsung dengan client: dari brief, revisi desain, hingga serah terima.",
      ],
      stack: ["React", "Next.js", "GSAP", "i18next", "Tailwind", "Vercel"],
    },
  ];
