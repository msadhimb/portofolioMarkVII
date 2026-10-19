import type { PageParams } from "@/lib/pagination"

export type SkillGroupApi = {
  slug: string
  title: string
  note: string
  items: string[]
}

export type SkillStore = {
  getSkills: (lang: string) => Promise<SkillGroupApi[] | undefined>
}
