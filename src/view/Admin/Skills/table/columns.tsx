import type { ColumnDef } from "@tanstack/react-table"
import {
  DataChips,
  RowActions,
  SortableHeader,
  type DataTableFeatures,
} from "@/view/Admin/components/DataTable"

export type AdminSkillGroupTranslation = {
  title?: string
  note?: string
}

export type AdminSkillGroup = {
  slug: string
  sort_order?: number
  items?: string[]
  translations?: Record<string, AdminSkillGroupTranslation>
}

type SkillGroupColumnOptions = {
  onDetail: (slug: string) => void
  onEdit: (slug: string) => void
  onDelete: (slug: string) => void
}

export const getSkillGroupColumns = ({
  onDetail,
  onEdit,
  onDelete,
}: SkillGroupColumnOptions): ColumnDef<
  DataTableFeatures,
  AdminSkillGroup
>[] => [
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
    id: "items",
    accessorFn: (row) => row.items?.length ?? 0,
    header: ({ column }) => <SortableHeader column={column} label="Item" />,
    cell: ({ row }) => <DataChips items={row.original.items ?? []} />,
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
