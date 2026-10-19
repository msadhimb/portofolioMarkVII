import type { PaginationMeta, PageParams } from "@/lib/pagination"

export interface AdminExperienceStore {
  getAdminExperiences: (params?: PageParams) => Promise<any>
  createExperience: (body: any) => Promise<any>
  updateExperience: (slug: string, body: any) => Promise<any>
  deleteExperience: (slug: string) => Promise<any>
}
