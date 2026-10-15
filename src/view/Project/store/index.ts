"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import { ProjectStoreDetail } from "./type"

export const useProjectsDetail = create<ProjectStoreDetail>()((set, get) => ({
  getProjectBySlug: async (slug: string, lang: any) => {
    try {
      const res = await clientApi({
        url: `/projects/${slug}?locale=${lang}`,
        method: "GET",
      })

      return res.data
    } catch (error) {
      console.error(error)
    }
  },
}))
