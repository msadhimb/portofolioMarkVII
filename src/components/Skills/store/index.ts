"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import type { SkillStore } from "./type"

export const useSkills = create<SkillStore>()(() => ({
  getSkills: async (lang: string) => {
    try {
      const res = await clientApi({
        url: `/skills?locale=${lang}`,
        method: "GET",
      })
      return res.data
    } catch (error) {
      console.error(error)
    }
  },
}))
