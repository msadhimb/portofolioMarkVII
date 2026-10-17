import type { AwardItem } from "@/data/profile"
import type { PaginationMeta, PageParams } from "@/lib/pagination"

export interface AwardStore {
  getAwards: (lang: string) => Promise<AwardItem[]>
  getAwardsPage: (
    lang: string,
    page?: number,
    perPage?: number,
    category?: string
  ) => Promise<{ data: AwardItem[]; pagination: PaginationMeta }>
  getAdminAwards: (params?: PageParams) => Promise<any>
  createAward: (body: any) => Promise<any>
  updateAward: (slug: string, body: any) => Promise<any>
  deleteAward: (slug: string) => Promise<any>
}
