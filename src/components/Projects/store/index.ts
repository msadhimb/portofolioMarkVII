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

    console.log(res)
    return res
  },
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
