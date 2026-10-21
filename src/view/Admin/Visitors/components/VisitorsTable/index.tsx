import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { PaginationMeta } from "@/lib/pagination"
import {
  formatDevice,
  formatLocation,
  formatRelative,
  formatWibDateTime,
  isOnline,
  shortVisitorId,
} from "../../helper/format"
import type { VisitorRow } from "../../store/type"

type VisitorsTableProps = {
  rows: VisitorRow[]
  pagination: PaginationMeta
  loading: boolean
  error: boolean
  onRetry: () => void
  onPageChange: (page: number) => void
}

const SKELETON_ROWS = 6

const VisitorsTable = ({
  rows,
  pagination,
  loading,
  error,
  onRetry,
  onPageChange,
}: VisitorsTableProps) => {
  const start =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.per_page + 1
  const end = Math.min(pagination.page * pagination.per_page, pagination.total)

  if (error) {
    return (
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <p className="text-sm font-medium text-destructive">
          Gagal memuat data pengunjung.
        </p>
        <p className="text-xs text-muted-foreground">
          Pastikan schema analytics sudah dijalankan di Supabase.
        </p>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <RotateCcw />
          Coba lagi
        </Button>
      </Card>
    )
  }

  return (
    <Card className="gap-0">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-4">
        <div>
          <h2 className="text-[15px] font-semibold">Pengunjung unik</h2>
          <p className="text-xs text-muted-foreground">
            Satu baris per browser. Kunjungan berulang memperbarui data, bukan
            menambah baris.
          </p>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">
          {pagination.total} pengunjung
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead>Pengunjung</TableHead>
            <TableHead className="hidden md:table-cell">Lokasi</TableHead>
            <TableHead className="hidden lg:table-cell">Perangkat</TableHead>
            <TableHead>Aktivitas</TableHead>
            <TableHead>Terakhir</TableHead>
            <TableHead className="hidden xl:table-cell">
              Halaman terakhir
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: SKELETON_ROWS }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                {Array.from({ length: 6 }).map((__, cellIndex) => (
                  <TableCell
                    key={`skeleton-${index}-${cellIndex}`}
                    className={
                      cellIndex === 1
                        ? "hidden md:table-cell"
                        : cellIndex === 2
                          ? "hidden lg:table-cell"
                          : cellIndex === 5
                            ? "hidden xl:table-cell"
                            : undefined
                    }
                  >
                    <Skeleton className="h-4 w-full max-w-36" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell
                colSpan={6}
                className="h-32 text-center text-sm text-muted-foreground"
              >
                Belum ada pengunjung pada rentang ini.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => {
              const online = isOnline(row.last_seen)
              return (
                <TableRow key={row.visitor_id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-foreground">
                        {shortVisitorId(row.visitor_id)}
                      </span>
                      {online ? (
                        <Badge
                          variant="secondary"
                          className="gap-1 px-1.5 text-[10px]"
                        >
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          online
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Pertama {formatRelative(row.first_seen)}
                    </p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-sm">
                      {formatLocation({
                        city: row.city,
                        region: row.region,
                        country: row.country,
                      })}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {row.timezone ?? "Zona waktu tidak diketahui"}
                    </p>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <p className="text-sm">{formatDevice(row.device_type)}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {[row.browser, row.os].filter(Boolean).join(" · ") ||
                        "Tidak diketahui"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="tabular text-sm font-medium">
                      {row.pageview_count} pageview
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {row.visit_count} kunjungan
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{formatRelative(row.last_seen)}</p>
                    <p
                      className="text-[11px] text-muted-foreground"
                      title={formatWibDateTime(row.last_seen)}
                    >
                      {formatWibDateTime(row.last_seen)}
                    </p>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px]">
                      {row.last_path ?? "—"}
                    </code>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center gap-3 border-t border-border px-4 py-3">
        <p className="text-sm text-muted-foreground tabular-nums">
          Menampilkan{" "}
          <span className="font-semibold text-foreground">
            {start}–{end}
          </span>{" "}
          dari{" "}
          <span className="font-semibold text-foreground">
            {pagination.total}
          </span>{" "}
          pengunjung
        </p>
        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={loading || pagination.page <= 1}
          >
            <ChevronLeft />
            Sebelumnya
          </Button>
          <span className="font-mono text-[11px] text-muted-foreground">
            {pagination.page} / {Math.max(pagination.total_pages, 1)}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={
              loading || pagination.page >= Math.max(pagination.total_pages, 1)
            }
          >
            Berikutnya
            <ChevronRight />
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default VisitorsTable
