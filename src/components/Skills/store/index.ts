"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import { toPageQuery, unwrapList } from "@/lib/pagination"
import type { SkillStore } from "./type"

export const useSkills = create<SkillStore>()(() => ({
  getSkills: async (lang: string) => {
    try {
      const res = await clientApi({
        url: `/skills?locale=${lang}&per_page=50`,
        method: "GET",
      })
      return unwrapList(res.data)
    } catch (error) {
      console.error(error)
    }
  },
}))
