import type { ProjectCard } from "@/helper/server/formatProjects/type"
import type { Paginated, PageParams } from "@/lib/pagination"

export interface ProjectAdminStore {
  getAdminProjects: (params?: PageParams) => Promise<any>
  createProject: (body: any) => Promise<any>
  updateProject: (slug: string, body: any) => Promise<any>
  deleteProject: (slug: string) => Promise<any>
}
