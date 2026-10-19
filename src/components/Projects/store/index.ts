"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import { toPageQuery, unwrapList } from "@/lib/pagination"
import { ProjectStore } from "./type"

export const useProjects = create<ProjectStore>()((set, get) => ({
  getProjects: async (lang: any) => {
    try {
      const res = await clientApi({
        url: `/projects?locale=${lang}&per_page=50`,
        method: "GET",
      })
      return unwrapList(res.data)
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
