"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import { toPageQuery } from "@/lib/pagination"
import { AdminExperienceStore } from "./type"

export const useAdminExperiences = create<AdminExperienceStore>()(
  (set, get) => ({
    getAdminExperiences: async (params) => {
      const res = await clientApi({
        url: `/admin/experiences?${toPageQuery({
          page: params?.page ?? 1,
          perPage: params?.perPage ?? 100,
          search: params?.search ?? "",
        })}`,
        method: "GET",
      })
      return res
    },
    createExperience: async (body: any) => {
      const res = await clientApi({
        url: `/admin/experiences`,
        method: "POST",
        data: body,
      })
      return res.data
    },
    updateExperience: async (slug: string, body: any) => {
      const res = await clientApi({
        url: `/admin/experiences/${slug}`,
        method: "PUT",
        data: body,
      })
      return res.data
    },
    deleteExperience: async (slug: string) => {
      const res = await clientApi({
        url: `/admin/experiences/${slug}`,
        method: "DELETE",
      })
      return res.data
    },
  })
)
