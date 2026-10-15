import type { SkillGroup } from "./profile";

export const skillGroups: SkillGroup[] = [
    {
      title: "Core",
      note: "What I reach for daily.",
      items: ["TypeScript", "JavaScript", "React.js", "Next.js", "Tailwind CSS"],
    },
    {
      title: "Data & Backend",
      note: "From UI to database.",
      items: ["Supabase", "PostgreSQL", "Authentication", "Row Level Security", "Axios", "REST"],
    },
    {
      title: "State & Forms",
      note: "Chosen for the problem, not the hype.",
      items: ["Zustand", "TanStack React Query", "React Hook Form"],
    },
    {
      title: "UI & Motion",
      note: "Precision, not decoration.",
      items: ["shadcn/ui", "Radix UI", "Framer Motion", "GSAP", "i18next"],
    },
    {
      title: "Delivery",
      note: "Into users' hands.",
      items: ["Vercel", "PDF tooling", "SEO", "A11y", "Performance budgets"],
    },
  ];
