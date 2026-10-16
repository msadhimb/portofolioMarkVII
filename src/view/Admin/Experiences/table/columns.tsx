import type { ColumnDef } from "@tanstack/react-table"
import {
  DataChips,
  RowActions,
  SortableHeader,
  type DataTableFeatures,
} from "@/view/Admin/components/DataTable"

export type AdminExperienceTranslation = {
  period?: string
  role?: string
  org?: string
  context?: string
  points?: string[]
}

export type AdminExperience = {
  slug: string
  sort_order?: number
  start_date?: string | null
  end_date?: string | null
  stacks?: string[]
  translations?: Record<string, AdminExperienceTranslation>
}

type ExperienceColumnOptions = {
  onDetail: (slug: string) => void
  onEdit: (slug: string) => void
  onDelete: (slug: string) => void
}

export const getExperienceColumns = ({
  onDetail,
  onEdit,
  onDelete,
}: ExperienceColumnOptions): ColumnDef<
  DataTableFeatures,
  AdminExperience
>[] => [
  {
    id: "role",
    accessorFn: (row) => row.translations?.id?.role || row.slug,
    header: ({ column }) => <SortableHeader column={column} label="Peran" />,
    filterFn: "includesString",
    sortFn: "text",
    cell: ({ row }) => (
      <div className="min-w-48">
        <p className="font-medium text-foreground">
          {row.original.translations?.id?.role || row.original.slug}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {row.original.translations?.id?.org || "—"}
        </p>
      </div>
    ),
  },
  {
    id: "period",
    accessorFn: (row) => row.translations?.id?.period ?? "",
    header: ({ column }) => <SortableHeader column={column} label="Periode" />,
    sortFn: "text",
    cell: ({ row }) => row.original.translations?.id?.period || "—",
  },
  {
    id: "stacks",
    accessorFn: (row) => (row.stacks ?? []).join(", "),
    header: "Stack",
    enableSorting: false,
    cell: ({ row }) => <DataChips items={row.original.stacks ?? []} />,
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
