import type { Experience } from "./profile"

export const experiences: Experience[] = [
  {
    slug: "pln-pusmanpro",
    period: "2023 — Present",
    role: "Frontend Engineer",
    org: "PLN Pusmanpro",
    context: "State-owned · Enterprise systems",
    points: [
      "Built dashboards and tiered approval workflows with Next.js + TypeScript for operational and audit needs.",
      "Designed data-fetching patterns with TanStack React Query: per-module caching, targeted invalidation, and consistent loading/error states.",
      "Handled complex cross-role forms with React Hook Form and centralized validation.",
      "Collaborated with backend and QA on API contracts, token lifecycles, and print-ready PDF reports.",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "React Query",
      "Zustand",
      "Tailwind",
      "Axios",
    ],
  },
  {
    slug: "duitku",
    period: "2022 — Present",
    role: "Independent Builder",
    org: "Duitku",
    context: "Personal product · Supabase",
    points: [
      "Designed a PostgreSQL schema with full RLS: auth, multi-wallet transactions, categories, wishlists, and API keys.",
      "Separated user-owned data (persisted) from live market data (never persisted) — a deliberate architecture principle.",
      "Built reports, charts, and portfolio monitoring kept fast via pagination and server-side aggregation.",
    ],
    stack: ["Next.js", "Supabase", "PostgreSQL", "React Query", "shadcn/ui"],
  },
  {
    slug: "freelance",
    period: "2021 — 2023",
    role: "Web Developer",
    org: "Freelance & Client Work",
    context: "Professional & creative websites",
    points: [
      "Built company profiles, landing pages, and interactive digital invitations (including DNA Wedding Invitation with GSAP + ScrollTrigger).",
      "Focused on mobile-first, media optimization, i18n (i18next), and Vercel deployment.",
      "Used to working directly with clients: from brief and design revisions to handover.",
    ],
    stack: ["React", "Next.js", "GSAP", "i18next", "Tailwind", "Vercel"],
  },
]
