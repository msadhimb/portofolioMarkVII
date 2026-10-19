import type { PageParams } from "@/lib/pagination"

export type SkillGroupApi = {
  slug: string
  title: string
  note: string
  items: string[]
}

export type AdminSkillStore = {
  getAdminSkillGroups: (params?: PageParams) => Promise<any>
  createSkillGroup: (body: any) => Promise<any>
  updateSkillGroup: (slug: string, body: any) => Promise<any>
  deleteSkillGroup: (slug: string) => Promise<any>
}
