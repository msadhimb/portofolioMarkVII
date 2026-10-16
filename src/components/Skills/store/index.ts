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
  getAdminSkillGroups: async (params) => {
    const res = await clientApi({
      url: `/admin/skills?${toPageQuery({
        page: params?.page ?? 1,
        perPage: params?.perPage ?? 100,
        search: params?.search ?? "",
      })}`,
      method: "GET",
    })
    return res
  },
  createSkillGroup: async (body: any) => {
    const res = await clientApi({
      url: `/admin/skills`,
      method: "POST",
      data: body,
    })
    return res.data
  },
  updateSkillGroup: async (slug: string, body: any) => {
    const res = await clientApi({
      url: `/admin/skills/${slug}`,
      method: "PUT",
      data: body,
    })
    return res.data
  },
  deleteSkillGroup: async (slug: string) => {
    const res = await clientApi({
      url: `/admin/skills/${slug}`,
      method: "DELETE",
    })
    return res.data
  },
}))
