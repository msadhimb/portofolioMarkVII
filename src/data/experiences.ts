export type ExperienceBase = {
  slug: string
  startDate: string
  endDate: string | null
  org: string
  stacks: string[]
}

export type ExperienceLocale = {
  slug: string
  role: string
  context: string
  points: string[]
}

export const experiences: ExperienceBase[] = [
  {
    slug: "pln-pusmanpro",
    startDate: "2023-01-01",
    endDate: null,
    org: "PLN Pusmanpro",
    stacks: ["Next.js", "TypeScript", "React Query", "Zustand", "Tailwind", "Axios"],
  },
  {
    slug: "duitku",
    startDate: "2022-01-01",
    endDate: null,
    org: "Duitku",
    stacks: ["Next.js", "Supabase", "PostgreSQL", "React Query", "shadcn/ui"],
  },
  {
    slug: "freelance",
    startDate: "2021-01-01",
    endDate: "2023-12-31",
    org: "Freelance & Client Work",
    stacks: ["React", "Next.js", "GSAP", "i18next", "Tailwind", "Vercel"],
  },
]
