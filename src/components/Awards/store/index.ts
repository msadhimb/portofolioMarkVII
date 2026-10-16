"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import { unwrapList } from "@/lib/pagination"
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
}))
