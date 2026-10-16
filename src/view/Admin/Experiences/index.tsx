"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useExperiences } from "@/components/Experience/store"
import { useActionModal } from "@/components/ActionModal/store"
import { useConfirmModal } from "@/components/ConfirmModal/store"
import { DataTable } from "@/view/Admin/components/DataTable"
import { getErrorMessage } from "@/view/Admin/components/getErrorMessage"
import { unwrapList } from "@/lib/pagination"
import { getExperienceColumns, type AdminExperience } from "./table/columns"
import { ExperienceDetailDialog } from "./components/ExperienceDetailDialog"
import { ExperienceDialog } from "./components/ExperienceDialog"
import {
  ADMIN_EXPERIENCES_KEY,
  useDeleteExperience,
} from "./hooks/useExperiencesMutation"

export const ExperiencesAdminView = () => {
  const { getAdminExperiences } = useExperiences()
  const { openModalActions } = useActionModal()
  const { openConfirmModal, closeConfirmModal } = useConfirmModal()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [detailSlug, setDetailSlug] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ADMIN_EXPERIENCES_KEY,
    queryFn: () => getAdminExperiences(),
  })

  const rows = unwrapList<AdminExperience>(data)
  const deleteMutation = useDeleteExperience()

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
      title: `Hapus experience "${slug}"?`,
      description: "Experience yang dihapus tidak bisa dikembalikan.",
      confirmLabel: "Ya, hapus",
      destructive: true,
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(slug)
          closeConfirmModal()
          openModalActions({
            success: true,
            descText: "Experience berhasil dihapus.",
          })
        } catch (error) {
          closeConfirmModal()
          openModalActions({
            success: false,
            descText: "Experience gagal dihapus.",
            infoText: getErrorMessage(error, "Coba lagi nanti."),
          })
        }
      },
    })
  }

  const columns = getExperienceColumns({
    onDetail: handleDetail,
    onEdit: handleEdit,
    onDelete: handleDelete,
  })
  const editingExperience = editingSlug
    ? (rows.find((row) => row.slug === editingSlug) ?? null)
    : null
  const detailExperience = detailSlug
    ? (rows.find((row) => row.slug === detailSlug) ?? null)
    : null

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Experiences</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola riwayat pengalaman dalam dua bahasa.
          </p>
        </div>
        <Button type="button" onClick={handleAdd}>
          <Plus />
          Tambah experience
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        searchColumnId="role"
        searchPlaceholder="Cari peran atau slug..."
        emptyText="Belum ada experience. Tambahkan experience pertama."
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />

      <ExperienceDetailDialog
        open={detailSlug !== null}
        experience={detailExperience}
        onClose={() => setDetailSlug(null)}
      />

      <ExperienceDialog
        open={dialogOpen}
        slug={editingSlug}
        initialData={editingExperience}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  )
}
