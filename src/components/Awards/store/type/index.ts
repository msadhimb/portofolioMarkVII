import type { AwardItem } from "@/data/profile"

export interface AwardStore {
  getAwards: (lang: string) => Promise<AwardItem[]>
}
