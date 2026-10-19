"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import { toPageQuery, unwrapList } from "@/lib/pagination"
import { ProjectAdminStore } from "./type"

export const useAdminProjects = create<ProjectAdminStore>()((set, get) => ({
  getAdminProjects: async (params) => {
    const res = await clientApi({
      url: `/admin/projects?${toPageQuery({
        page: params?.page ?? 1,
        perPage: params?.perPage ?? 100,
        search: params?.search ?? "",
      })}`,
      method: "GET",
    })
    return res
  },
  createProject: async (body: any) => {
    const res = await clientApi({
      url: `/admin/projects`,
      method: "POST",
      data: body,
    })
    return res.data
  },
  updateProject: async (slug: string, body: any) => {
    const res = await clientApi({
      url: `/admin/projects/${slug}`,
      method: "PUT",
      data: body,
    })
    return res.data
  },
  deleteProject: async (slug: string) => {
    const res = await clientApi({
      url: `/admin/projects/${slug}`,
      method: "DELETE",
    })
    return res.data
  },
}))
