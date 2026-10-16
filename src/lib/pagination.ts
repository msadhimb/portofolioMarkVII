export type PaginationMeta = {
  page: number
  per_page: number
  total: number
  total_pages: number
}

export type Paginated<T> = {
  data: T[]
  pagination: PaginationMeta
}

export type PageParams = {
  page?: number
  perPage?: number
  search?: string
}

export const toPageQuery = ({ page = 1, perPage = 10, search = "" }: PageParams) => {
  const query = `page=${page}&per_page=${perPage}`
  return search.trim() ? `${query}&search=${encodeURIComponent(search.trim())}` : query
}

export const EMPTY_PAGINATION: PaginationMeta = {
  page: 1,
  per_page: 10,
  total: 0,
  total_pages: 0,
}

/** Ambil array dari respons API baik format lama (array) maupun baru (envelope). */
export const unwrapList = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[]
  if (
    payload &&
    typeof payload === "object" &&
    Array.isArray((payload as { data?: unknown }).data)
  ) {
    return (payload as { data: T[] }).data
  }
  return []
}
