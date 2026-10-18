"use client"

import { useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react"
import { useTable, type ColumnDef, type RowData } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { features, type DataTableFeatures } from "./data-table-features"

export { SortableHeader, RowActions, DataChips } from "./parts"
export type { DataTableFeatures } from "./data-table-features"

type DataTableProps<TData extends RowData> = {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  searchColumnId?: string
  searchPlaceholder?: string
  emptyText: string
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  pageSize?: number
}

const SKELETON_ROWS = 5
const PAGE_SIZE_OPTIONS = [5, 10, 20]

type PageItem = number | "ellipsis-start" | "ellipsis-end"

/** Nomor halaman 1-2-3 dengan ellipsis: [1, …, 4, 5, 6, …, 12] */
const getPageItems = (pageIndex: number, pageCount: number): PageItem[] => {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i)
  }
  const current = pageIndex
  const last = pageCount - 1
  const window = new Set<number>([0, 1, last - 1, last, current - 1, current, current + 1])
  const pages = [...window].filter((p) => p >= 0 && p <= last).sort((a, b) => a - b)
  const items: PageItem[] = []
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) {
      items.push(i < pages.length / 2 ? "ellipsis-start" : "ellipsis-end")
    }
    items.push(pages[i])
  }
  return items
}

export const DataTable = <TData extends RowData>({
  columns,
  data,
  searchColumnId,
  searchPlaceholder = "Cari...",
  emptyText,
  isLoading = false,
  isError = false,
  onRetry,
  pageSize = 10,
}: DataTableProps<TData>) => {
  const table = useTable({
    features,
    data,
    columns,
    initialState: {
      pagination: { pageIndex: 0, pageSize },
    },
  })

  const searchColumn = searchColumnId
    ? table.getColumn(searchColumnId)
    : undefined
  const searchValue = (searchColumn?.getFilterValue() as string) ?? ""
  const filteredCount = table.getFilteredRowModel().rows.length
  const pageCount = table.getPageCount()
  const pageIndex = table.state.pagination.pageIndex
  const currentPageSize = table.state.pagination.pageSize

  // Kembali ke halaman 1 setiap kata kunci berubah, dan jepit halaman
  // saat data menyusut (mis. setelah hapus baris terakhir di halaman akhir).
  useEffect(() => {
    table.setPageIndex(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue])
  useEffect(() => {
    if (pageCount > 0 && pageIndex > pageCount - 1) {
      table.setPageIndex(pageCount - 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageCount])

  const rangeStart = filteredCount === 0 ? 0 : pageIndex * currentPageSize + 1
  const rangeEnd = Math.min((pageIndex + 1) * currentPageSize, filteredCount)
  const pageItems = getPageItems(pageIndex, pageCount)

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-card p-10 text-center"
      >
        <p className="text-sm font-medium text-destructive">
          Gagal memuat data.
        </p>
        {onRetry ? (
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Coba lagi
          </Button>
        ) : null}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {searchColumn ? (
          <div className="relative">
            <Search
              className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              placeholder={searchPlaceholder}
              value={(searchColumn.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                searchColumn.setFilterValue(event.target.value)
              }
              aria-label={searchPlaceholder}
              className="h-10 w-64 rounded-full pl-9"
            />
          </div>
        ) : null}
        <p className="ml-auto text-sm text-muted-foreground tabular-nums">
          {isLoading ? "Memuat..." : `${filteredCount} data`}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-muted/50 hover:bg-muted/50"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: SKELETON_ROWS }).map((_, rowIndex) => (
                <TableRow
                  key={`skeleton-${rowIndex}`}
                  className="hover:bg-transparent"
                >
                  {columns.map((_, cellIndex) => (
                    <TableCell key={`skeleton-${rowIndex}-${cellIndex}`}>
                      <Skeleton className="h-5 w-full max-w-40" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl border border-border bg-card px-4 py-3">
        <p className="text-sm text-muted-foreground tabular-nums">
          Menampilkan{" "}
          <span className="font-semibold text-foreground">
            {rangeStart}–{rangeEnd}
          </span>{" "}
          dari <span className="font-semibold text-foreground">{filteredCount}</span>{" "}
          data
        </p>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Baris
          <select
            aria-label="Baris per halaman"
            value={currentPageSize}
            onChange={(event) => table.setPageSize(Number(event.target.value))}
            className="h-8 rounded-lg border border-border bg-background px-2 text-sm text-foreground outline-none transition-colors hover:border-signal/50 focus-visible:border-signal"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <nav
          aria-label="Pagination tabel"
          className="ml-auto flex items-center gap-1"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            aria-label="Ke halaman pertama"
          >
            <ChevronsLeft />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft />
          </Button>
          {pageItems.map((item) =>
            typeof item !== "number" ? (
              <span
                key={item}
                aria-hidden="true"
                className="px-1 font-mono text-xs text-muted-foreground"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => table.setPageIndex(item)}
                aria-label={`Ke halaman ${item + 1}`}
                aria-current={item === pageIndex ? "page" : undefined}
                className={cn(
                  "tabular h-8 min-w-8 rounded-lg border px-2 font-mono text-[13px] transition-all",
                  item === pageIndex
                    ? "border-signal/60 bg-gradient-to-br from-amber-500/25 to-teal-500/25 font-bold text-signal shadow-[0_0_18px_-6px_rgba(245,158,11,0.5)]"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                )}
              >
                {item + 1}
              </button>
            )
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Halaman berikutnya"
          >
            <ChevronRight />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
            aria-label="Ke halaman terakhir"
          >
            <ChevronsRight />
          </Button>
        </nav>
      </div>
    </div>
  )
}
