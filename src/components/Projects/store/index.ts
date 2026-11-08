"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import { unwrapList } from "@/lib/pagination"
import type { ProjectCard } from "@/helper/server/formatProjects/type"
import { ProjectStore } from "./type"

export const useProjects = create<ProjectStore>()((set, get) => ({
  projects: [],
  setProjects: (projects: ProjectCard[]) => set({ projects }),
  getProjects: async (lang: string) => {
    try {
      const res = await clientApi({
        url: `/projects?locale=${lang}&per_page=50`,
        method: "GET",
      })

      const data = unwrapList<ProjectCard>(res.data)
      return data
    } catch (error) {
      console.error(error)
    }
  },
  getProjectsPage: async (lang: string, page = 1, perPage = 6) => {
    const res = await clientApi({
      url: `/projects`,
      method: "GET",
      params: {
        locale: lang,
        page,
        per_page: perPage,
      },
    })

    return res
  },
}))
