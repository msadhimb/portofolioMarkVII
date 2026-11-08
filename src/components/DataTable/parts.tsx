"use client"

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react"
import type { Column, RowData } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DataTableFeatures } from "./data-table-features"

export const SortableHeader = <TData extends RowData>({
  column,
  label,
}: {
  column: Column<DataTableFeatures, TData>
  label: string
}) => {
  const sorted = column.getIsSorted()

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="-ml-2 h-8 gap-1.5 px-2 font-mono text-[11px] tracking-[0.12em] text-muted-foreground uppercase hover:text-foreground"
    >
      {label}
      {sorted === "asc" ? (
        <ArrowUp className="size-3.5" aria-hidden="true" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3.5" aria-hidden="true" />
      ) : (
        <ArrowUpDown className="size-3.5 opacity-50" aria-hidden="true" />
      )}
    </Button>
  )
}

type RowActionsProps = {
  label: string
  onDetail: () => void
  onEdit: () => void
  onDelete: () => void
}

export const RowActions = ({
  label,
  onDetail,
  onEdit,
  onDelete,
}: RowActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Aksi ${label}`}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onDetail}>
          <Eye />
          <span>Detail</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Pencil />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onDelete}>
          <Trash2 />
          <span>Hapus</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const DataChips = ({
  items,
  limit = 3,
}: {
  items: string[]
  limit?: number
}) => {
  if (items.length === 0) {
    return <span className="text-muted-foreground">—</span>
  }

  const visible = items.slice(0, limit)
  const rest = items.length - visible.length

  return (
    <span className="flex max-w-64 flex-wrap gap-1">
      {visible.map((item) => (
        <Badge key={item} variant="secondary" className="font-normal">
          {item}
        </Badge>
      ))}
      {rest > 0 ? (
        <Badge variant="outline" className="font-normal">
          +{rest}
        </Badge>
      ) : null}
    </span>
  )
}
