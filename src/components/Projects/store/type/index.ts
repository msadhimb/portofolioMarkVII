import type { ProjectCard } from "@/helper/server/formatProjects/type"
import type { Paginated, PageParams } from "@/lib/pagination"

export interface ProjectStore {
  getProjects: (lang: string) => Promise<any>
  getProjectsPage: (
    lang: string,
    page?: number,
    perPage?: number
  ) => Promise<{
    items: ProjectCard[]
    pagination: Paginated<ProjectCard>["pagination"]
  }>
}
