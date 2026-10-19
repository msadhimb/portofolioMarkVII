import type { AwardItem } from "@/data/profile"
import type { PaginationMeta, PageParams } from "@/lib/pagination"

export interface AdminAwardStore {
  getAdminAwards: (params?: PageParams) => Promise<any>
  createAward: (body: any) => Promise<any>
  updateAward: (slug: string, body: any) => Promise<any>
  deleteAward: (slug: string) => Promise<any>
}
