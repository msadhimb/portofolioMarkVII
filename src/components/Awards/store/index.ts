"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import { toPageQuery, unwrapList } from "@/lib/pagination"
import { awards as awardsId } from "@/data/awards.id"
import { awards as awardsEn } from "@/data/awards.en"
import type { AwardItem } from "@/data/profile"
import type { AwardStore } from "./type"

export const useAwards = create<AwardStore>()(() => ({
  getAwards: async (lang: string): Promise<AwardItem[]> => {
    try {
      const res = await clientApi({
        url: `/awards?locale=${lang}&per_page=50`,
        method: "GET",
      })
      const list = unwrapList<AwardItem>(res.data)
      if (list && list.length > 0) {
        return list
      }
    } catch {
      // Fallback ke data statis lokal
    }
    return lang === "en" ? awardsEn : awardsId
  },
  getAwardsPage: async (lang, page = 1, perPage = 3, category = "all") => {
    const res = await clientApi({
      url: `/awards`,
      method: "GET",
      params: {
        locale: lang,
        page,
        per_page: perPage,
        ...(category && category !== "all" ? { category } : {}),
      },
    })
    return res
  },
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
