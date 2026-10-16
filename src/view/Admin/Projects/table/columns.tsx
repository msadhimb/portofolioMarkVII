import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import {
  DataChips,
  RowActions,
  SortableHeader,
  type DataTableFeatures,
} from "@/view/Admin/components/DataTable"

export type AdminProjectTranslation = {
  title?: string
  tagline?: string
  description?: string
  problem?: string
  role?: string
  period?: string
  context?: string
  highlights?: string[]
  metrics?: { label: string; value: string }[]
  decisions?: { title: string; detail: string }[]
}

export type AdminProject = {
  slug: string
  image?: string
  demo_url?: string | null
  repository_url?: string | null
  featured?: boolean
  sort_order?: number
  technologies?: string[]
  translations?: Record<string, AdminProjectTranslation>
}

type ProjectColumnOptions = {
  onDetail: (slug: string) => void
  onEdit: (slug: string) => void
  onDelete: (slug: string) => void
}

export const getProjectColumns = ({
  onDetail,
  onEdit,
  onDelete,
}: ProjectColumnOptions): ColumnDef<DataTableFeatures, AdminProject>[] => [
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
        <code className="mt-1 inline-block rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
          {row.original.slug}
        </code>
      </div>
    ),
  },
  {
    id: "technologies",
    accessorFn: (row) => (row.technologies ?? []).join(", "),
    header: "Teknologi",
    enableSorting: false,
    cell: ({ row }) => <DataChips items={row.original.technologies ?? []} />,
  },
  {
    accessorKey: "featured",
    header: "Unggulan",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.featured ? (
        <Badge>Unggulan</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    id: "sort_order",
    accessorFn: (row) => row.sort_order ?? 0,
    header: ({ column }) => <SortableHeader column={column} label="Urutan" />,
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.sort_order ?? 0}</span>
    ),
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
