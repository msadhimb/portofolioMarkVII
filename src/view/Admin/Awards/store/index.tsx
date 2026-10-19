"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import { toPageQuery, unwrapList } from "@/lib/pagination"
import { AdminAwardStore } from "./type"

export const useAdminAwards = create<AdminAwardStore>()(() => ({
  getAdminAwards: async (params) => {
    const res = await clientApi({
      url: `/admin/awards?${toPageQuery({
        page: params?.page ?? 1,
        perPage: params?.perPage ?? 100,
        search: params?.search ?? "",
      })}`,
      method: "GET",
    })
    return res
  },
  createAward: async (body: any) => {
    const res = await clientApi({
      url: `/admin/awards`,
      method: "POST",
      data: body,
    })
    return res.data
  },
  updateAward: async (slug: string, body: any) => {
    const res = await clientApi({
      url: `/admin/awards/${slug}`,
      method: "PUT",
      data: body,
    })
    return res.data
  },
  deleteAward: async (slug: string) => {
    const res = await clientApi({
      url: `/admin/awards/${slug}`,
      method: "DELETE",
    })
    return res.data
  },
}))
