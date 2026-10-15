"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import { ExperienceStore } from "./type"

export const useExperiences = create<ExperienceStore>()((set, get) => ({
  getExperiences: async (lang: any) => {
    try {
      const res = await clientApi({
        url: `/experiences?locale=${lang}`,
        method: "GET",
      })
      return res.data
    } catch (error) {
      console.error(error)
    }
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
