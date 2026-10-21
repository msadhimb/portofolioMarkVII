"use client"

import { create } from "zustand"
import clientApi from "@/services/client"
import { AdminVisitStore } from "./type"

export const useAdminVisits = create<AdminVisitStore>()(() => ({
  getAdminVisits: async (params) => {
    const query = new URLSearchParams({
      page: String(params.page),
      per_page: String(params.perPage),
      range: params.range,
    })

    if (params.search?.trim()) query.set("search", params.search.trim())
    if (params.device) query.set("device", params.device)

    return clientApi({
      url: `/admin/visits?${query.toString()}`,
      method: "GET",
    })
  },
}))
