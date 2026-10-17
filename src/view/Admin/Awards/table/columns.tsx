import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  DataChips,
  RowActions,
  SortableHeader,
  type DataTableFeatures,
} from "@/view/Admin/components/DataTable"

export type AdminAwardTranslation = {
  title?: string
  issuer?: string
  description?: string
}

export type AdminAward = {
  slug: string
  category?: string
  issue_date?: string
  expiry_date?: string
  credential_id?: string
  credential_url?: string
  skills?: string[]
  translations?: Record<string, AdminAwardTranslation>
}

export const AWARD_CATEGORIES = ["certificate", "award", "honor"] as const

export const AWARD_CATEGORY_LABELS: Record<string, string> = {
  certificate: "Sertifikat",
  award: "Penghargaan",
  honor: "Honor",
}

const CATEGORY_BADGE: Record<string, string> = {
  certificate:
    "border-cyan-500/30 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  award: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  honor:
    "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400",
}

type AwardColumnOptions = {
  onDetail: (slug: string) => void
  onEdit: (slug: string) => void
  onDelete: (slug: string) => void
}

export const getAwardColumns = ({
  onDetail,
  onEdit,
  onDelete,
}: AwardColumnOptions): ColumnDef<DataTableFeatures, AdminAward>[] => [
  {
    id: "title",
    accessorFn: (row) => row.translations?.id?.title || row.slug,
    header: ({ column }) => <SortableHeader column={column} label="Judul" />,
    filterFn: "includesString",
    sortFn: "text",
    cell: ({ row }) => (
      <div className="min-w-48">
        <p className="font-medium text-foreground">
          {row.original.translations?.id?.title || row.original.slug}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {row.original.translations?.id?.issuer || "—"}
        </p>
      </div>
    ),
  },
  {
    id: "category",
    accessorFn: (row) => AWARD_CATEGORY_LABELS[row.category ?? ""] ?? row.category ?? "",
    header: ({ column }) => <SortableHeader column={column} label="Kategori" />,
    sortFn: "text",
    cell: ({ row }) => {
      const category = row.original.category ?? ""
      return (
        <Badge
          variant="outline"
          className={cn(
            "rounded-full px-2.5 py-0.5 font-mono text-[11px] font-normal",
            CATEGORY_BADGE[category] ?? "border-border bg-muted text-muted-foreground"
          )}
        >
          {AWARD_CATEGORY_LABELS[category] ?? category ?? "—"}
        </Badge>
      )
    },
  },
  {
    id: "year",
    accessorFn: (row) => row.issue_date ?? "",
    header: ({ column }) => <SortableHeader column={column} label="Tahun" />,
    sortFn: "text",
    cell: ({ row }) => (
      <span className="tabular">{row.original.issue_date || "—"}</span>
    ),
  },
  {
    id: "skills",
    accessorFn: (row) => (row.skills ?? []).join(", "),
    header: "Skills",
    enableSorting: false,
    cell: ({ row }) => <DataChips items={row.original.skills ?? []} />,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Aksi</span>,
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        <RowActions
          label={row.original.slug}
          onDetail={() => onDetail(row.original.slug)}
          onEdit={() => onEdit(row.original.slug)}
          onDelete={() => onDelete(row.original.slug)}
        />
      </div>
    ),
  },
]
