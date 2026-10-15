import type { SkillGroup } from "./profile";

export const skillGroups: SkillGroup[] = [
    {
      title: "Core",
      note: "Yang saya pakai setiap hari.",
      items: ["TypeScript", "JavaScript", "React.js", "Next.js", "Tailwind CSS"],
    },
    {
      title: "Data & Backend",
      note: "Dari UI sampai database.",
      items: ["Supabase", "PostgreSQL", "Authentication", "Row Level Security", "Axios", "REST"],
    },
    {
      title: "State & Forms",
      note: "Dipilih sesuai masalah, bukan hype.",
      items: ["Zustand", "TanStack React Query", "React Hook Form"],
    },
    {
      title: "UI & Motion",
      note: "Presisi, bukan dekorasi.",
      items: ["shadcn/ui", "Radix UI", "Framer Motion", "GSAP", "i18next"],
    },
    {
      title: "Delivery",
      note: "Sampai ke tangan user.",
      items: ["Vercel", "PDF tooling", "SEO", "A11y", "Performance budgets"],
    },
  ];
