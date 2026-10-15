"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import { ProjectStore } from "./type"

export const useProjects = create<ProjectStore>()((set, get) => ({
  getProjects: async (lang: any) => {
    try {
      const res = await clientApi({
        url: `/projects?locale=${lang}`,
        method: "GET",
      })
      return res.data
    } catch (error) {
      console.error(error)
    }
  },
}))
