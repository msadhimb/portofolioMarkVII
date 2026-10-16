"use client"

import { useQuery } from "@tanstack/react-query"
import clientApi from "@/services/client"

export type SiteSettings = {
  is_available: boolean
  available_label_id: string
  available_label_en: string
}

const FALLBACK: SiteSettings = {
  is_available: true,
  available_label_id: "Terbuka untuk proyek",
  available_label_en: "Available for projects",
}

export const useSiteSettings = () => {
  const query = useQuery({
    queryKey: ["site-settings"],
    queryFn: async (): Promise<SiteSettings> => {
      try {
        const res = await clientApi({ url: "/settings", method: "GET" })
        return (res.data ?? FALLBACK) as SiteSettings
      } catch {
        return FALLBACK
      }
    },
    staleTime: 60_000,
  })

  return { settings: query.data ?? FALLBACK, ...query }
}
