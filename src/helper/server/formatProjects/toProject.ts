import { Project } from "@/data/projects"
import type { ProjectCard, ProjectCardRow, ProjectRow } from "./type"

export const toProjectCard = (row: ProjectCardRow): ProjectCard => ({
  slug: row.slug,
  title: row.title,
  tagline: row.tagline ?? "",
  description: row.description ?? "",
  context: row.context ?? "",
  period: row.period ?? "",
  problem: row.problem ?? "",
  featured: row.featured ?? false,
  technologies: (row.technologies ?? []).slice(0, 7),
  highlights: (row.highlights ?? []).slice(0, 3),
  demoUrl: row.demo_url || "",
  ...(row.featured && row.metrics?.length ? { metrics: row.metrics } : {}),
})

export const toProject = (row: ProjectRow): Project => ({
  slug: row.slug,
  title: row.title,
  tagline: row.tagline ?? "",
  description: row.description ?? "",
  problem: row.problem ?? "",
  role: row.role ?? "",
  period: row.period ?? "",
  context: row.context ?? "",
  technologies: row.technologies ?? [],
  highlights: row.highlights ?? [],
  image: row.image ?? "",
  featured: row.featured ?? false,
  demoUrl: row.demo_url || "",
  ...(row.repository_url ? { repositoryUrl: row.repository_url } : {}),
  ...(row.metrics?.length ? { metrics: row.metrics } : {}),
  ...(row.decisions?.length ? { decisions: row.decisions } : {}),
})
