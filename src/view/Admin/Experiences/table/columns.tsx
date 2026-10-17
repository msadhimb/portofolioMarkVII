import type { ColumnDef } from "@tanstack/react-table"
import {
  DataChips,
  RowActions,
  SortableHeader,
  type DataTableFeatures,
} from "@/view/Admin/components/DataTable"
import { format, isValid } from "date-fns"
import { id as idLocale } from "date-fns/locale"

export type AdminExperienceTranslation = {
  role?: string
  context?: string
  points?: string[]
}

export type AdminExperience = {
  slug: string
  start_date?: string | null
  end_date?: string | null
  stacks?: string[]
  org?: string
  translations?: Record<string, AdminExperienceTranslation>
}

type ExperienceColumnOptions = {
  onDetail: (slug: string) => void
  onEdit: (slug: string) => void
  onDelete: (slug: string) => void
}

const monthYear = (value: string | null | undefined) => {
  if (!value) return null
  const date = new Date(value)
  return isValid(date) ? format(date, "MMMM yyyy", { locale: idLocale }) : null
}

const periodLabel = (row: AdminExperience) => {
  const start = monthYear(row.start_date)
  const end = row.end_date ? monthYear(row.end_date) : "Sekarang"
  return start ? `${start} — ${end}` : "—"
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
          {row.original.org || "—"}
        </p>
      </div>
    ),
  },
  {
    id: "period",
    accessorFn: (row) => periodLabel(row),
    header: ({ column }) => <SortableHeader column={column} label="Periode" />,
    sortFn: "text",
    cell: ({ row }) => periodLabel(row.original),
  },
  {
    id: "stacks",
    accessorFn: (row) => (row.stacks ?? []).join(", "),
    header: "Stack",
    enableSorting: false,
    cell: ({ row }) => <DataChips items={row.original.stacks ?? []} />,
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
