import type { PaginationMeta, PageParams } from "@/lib/pagination"

export interface ExperienceStore {
  getExperiences: (lang: string) => Promise<any>
  getExperiencesPage: (
    lang: string,
    page?: number,
    perPage?: number
  ) => Promise<{ data: any[]; pagination: PaginationMeta }>
  getExperienceBySlug: (slug: string, lang: string) => Promise<any>
  getAdminExperiences: (params?: PageParams) => Promise<any>
  createExperience: (body: any) => Promise<any>
  updateExperience: (slug: string, body: any) => Promise<any>
  deleteExperience: (slug: string) => Promise<any>
}
