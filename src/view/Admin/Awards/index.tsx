"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAwards } from "@/components/Awards/store"
import { useActionModal } from "@/components/ActionModal/store"
import { useConfirmModal } from "@/components/ConfirmModal/store"
import { DataTable } from "@/view/Admin/components/DataTable"
import { getErrorMessage } from "@/view/Admin/components/getErrorMessage"
import { unwrapList } from "@/lib/pagination"
import { getAwardColumns, type AdminAward } from "./table/columns"
import { AwardDetailDialog } from "./components/AwardDetailDialog"
import { AwardDialog } from "./components/AwardDialog"
import { ADMIN_AWARDS_KEY, useDeleteAward } from "./hooks/useAwardsMutation"

export const AwardsAdminView = () => {
  const { getAdminAwards } = useAwards()
  const { openModalActions } = useActionModal()
  const { openConfirmModal, closeConfirmModal } = useConfirmModal()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [detailSlug, setDetailSlug] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ADMIN_AWARDS_KEY,
    queryFn: () => getAdminAwards(),
  })

  const rows = unwrapList<AdminAward>(data)
  const deleteMutation = useDeleteAward()

  const handleAdd = () => {
    setEditingSlug(null)
    setDialogOpen(true)
  }

  const handleDetail = (slug: string) => {
    setDetailSlug(slug)
  }

  const handleEdit = (slug: string) => {
    setEditingSlug(slug)
    setDialogOpen(true)
  }

  const handleDelete = (slug: string) => {
    openConfirmModal({
      title: `Hapus award "${slug}"?`,
      description: "Award yang dihapus tidak bisa dikembalikan.",
      confirmLabel: "Ya, hapus",
      destructive: true,
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(slug)
          closeConfirmModal()
          openModalActions({
            success: true,
            descText: "Award berhasil dihapus.",
          })
        } catch (error) {
          closeConfirmModal()
          openModalActions({
            success: false,
            descText: "Award gagal dihapus.",
            infoText: getErrorMessage(error, "Coba lagi nanti."),
          })
        }
      },
    })
  }

  const columns = getAwardColumns({
    onDetail: handleDetail,
    onEdit: handleEdit,
    onDelete: handleDelete,
  })
  const editingAward = editingSlug
    ? (rows.find((row) => row.slug === editingSlug) ?? null)
    : null
  const detailAward = detailSlug
    ? (rows.find((row) => row.slug === detailSlug) ?? null)
    : null

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Awards
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola sertifikat, penghargaan, dan honor dalam dua bahasa.
          </p>
        </div>
        <Button type="button" onClick={handleAdd}>
          <Plus />
          Tambah award
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        searchColumnId="title"
        searchPlaceholder="Cari judul atau slug..."
        emptyText="Belum ada award. Tambahkan award pertama."
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />

      <AwardDetailDialog
        open={detailSlug !== null}
        award={detailAward}
        onClose={() => setDetailSlug(null)}
      />

      <AwardDialog
        open={dialogOpen}
        slug={editingSlug}
        initialData={editingAward}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  )
}
