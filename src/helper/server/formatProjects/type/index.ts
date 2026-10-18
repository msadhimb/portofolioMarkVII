import { Project } from "@/data/projects"

export type ProjectRow = {
  slug: string
  image: string
  demo_url: string | null
  repository_url: string | null
  featured: boolean
  sort_order: number
  locale: string
  title: string
  tagline: string
  description: string
  problem: string
  role: string
  period: string
  context: string
  technologies: string[]
  highlights: string[]
  metrics: { label: string; value: string }[]
  decisions: { title: string; detail: string }[]
}
export type ProjectCard = Pick<
  Project,
  | "slug"
  | "title"
  | "tagline"
  | "description"
  | "context"
  | "period"
  | "problem"
  | "technologies"
  | "highlights"
> & {
  demoUrl?: string
  featured?: boolean
  metrics?: { label: string; value: string }[]
  image?: string
}

/** Subset kolom yang dibaca untuk varian card (list ringan). */
export type ProjectCardRow = Pick<
  ProjectRow,
  | "slug"
  | "title"
  | "tagline"
  | "description"
  | "context"
  | "period"
  | "problem"
  | "featured"
  | "demo_url"
  | "technologies"
  | "highlights"
  | "metrics"
  | "sort_order"
  | "image"
>
