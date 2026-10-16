import type { SupabaseClient } from "@supabase/supabase-js"

export type PaginationParams = {
  page: number
  perPage: number
}

export type PaginationMeta = {
  page: number
  per_page: number
  total: number
  total_pages: number
}

type ParseOptions = {
  defaultPage?: number
  defaultPerPage?: number
  maxPerPage?: number
}

const toPositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10)
  if (!Number.isFinite(parsed) || parsed < 1) return fallback
  return parsed
}

/**
 * Ambil `page` & `per_page` dari query string dengan clamp yang aman.
 * Contoh: `/api/v1/projects?locale=id&page=2&per_page=6`
 */
export const parsePaginationParams = (
  searchParams: URLSearchParams,
  options: ParseOptions = {}
): PaginationParams => {
  const { defaultPage = 1, defaultPerPage = 10, maxPerPage = 100 } = options
  const page = toPositiveInt(searchParams.get("page"), defaultPage)
  const perPage = Math.min(
    toPositiveInt(searchParams.get("per_page"), defaultPerPage),
    Math.max(maxPerPage, 1)
  )
  return { page, perPage }
}

/** Konversi page/perPage menjadi range inklusif untuk Supabase `.range(from, to)`. */
export const toSupabaseRange = ({ page, perPage }: PaginationParams) => {
  const from = (page - 1) * perPage
  return { from, to: from + perPage - 1 }
}

export const buildPaginationMeta = (
  { page, perPage }: PaginationParams,
  total: number
): PaginationMeta => ({
  page,
  per_page: perPage,
  total,
  total_pages: total === 0 ? 0 : Math.ceil(total / perPage),
})

export const paginated = <T>(data: T[], meta: PaginationMeta) => ({
  data,
  pagination: meta,
})

/**
 * Bersihkan input search agar aman dipakai di filter `.or()` PostgREST
 * (koma & kurung akan merusak sintaks filter).
 */
export const sanitizeLikeParam = (value: string | null) =>
  (value ?? "")
    .replace(/[%(),"]/g, "")
    .replace(/\\/g, "")
    .trim()
    .slice(0, 80)

/**
 * Cari id parent dari tabel terjemahan berdasarkan kolom teks (judul, peran, ...).
 * Dipakai agar search admin bisa menemukan slug maupun judul terjemahan.
 */
export const fetchTranslationIds = async (
  supabase: SupabaseClient,
  table: string,
  fkColumn: string,
  textColumns: string[],
  search: string
): Promise<{ ids: string[]; error: string | null }> => {
  const clean = sanitizeLikeParam(search)
  if (!clean) return { ids: [], error: null }

  const { data, error } = await supabase
    .from(table)
    .select(fkColumn)
    .or(textColumns.map((column) => `${column}.ilike.%${clean}%`).join(","))

  if (error) return { ids: [], error: error.message }

  const ids = [
    ...new Set(
      ((data ?? []) as unknown as Record<string, unknown>[]).map((row) =>
        String(row[fkColumn])
      )
    ),
  ]
  return { ids, error: null }
}
