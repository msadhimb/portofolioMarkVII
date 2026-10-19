"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import { toPageQuery, unwrapList } from "@/lib/pagination"
import { ExperienceStore } from "./type"

export const useExperiences = create<ExperienceStore>()((set, get) => ({
  getExperiences: async (lang: any) => {
    try {
      const res = await clientApi({
        url: `/experiences?locale=${lang}&per_page=50`,
        method: "GET",
      })
      return unwrapList(res.data)
    } catch (error) {
      console.error(error)
    }
  },
  getExperiencesPage: async (lang: string, page = 1, perPage = 3) => {
    const res = await clientApi({
      url: `/experiences`,
      method: "GET",
      params: {
        locale: lang,
        page,
        per_page: perPage,
      },
    })
    return res
  },
  getExperienceBySlug: async (slug: string, lang: any) => {
    try {
      const res = await clientApi({
        url: `/experiences/${slug}?locale=${lang}`,
        method: "GET",
      })
      return res.data
    } catch (error) {
      console.error(error)
    }
  },
}))
