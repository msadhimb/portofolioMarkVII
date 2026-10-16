"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSkills } from "@/components/Skills/store"
import { useActionModal } from "@/components/ActionModal/store"
import { useConfirmModal } from "@/components/ConfirmModal/store"
import { DataTable } from "@/view/Admin/components/DataTable"
import { getErrorMessage } from "@/view/Admin/components/getErrorMessage"
import { unwrapList } from "@/lib/pagination"
import { getSkillGroupColumns, type AdminSkillGroup } from "./table/columns"
import { SkillGroupDetailDialog } from "./components/SkillGroupDetailDialog"
import { SkillGroupDialog } from "./components/SkillGroupDialog"
import {
  ADMIN_SKILLS_KEY,
  useDeleteSkillGroup,
} from "./hooks/useSkillsMutation"

export const SkillsAdminView = () => {
  const { getAdminSkillGroups } = useSkills()
  const { openModalActions } = useActionModal()
  const { openConfirmModal, closeConfirmModal } = useConfirmModal()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [detailSlug, setDetailSlug] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ADMIN_SKILLS_KEY,
    queryFn: () => getAdminSkillGroups(),
  })

  const rows = unwrapList<AdminSkillGroup>(data)
  const deleteMutation = useDeleteSkillGroup()

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
      title: `Hapus skill group "${slug}"?`,
      description: "Skill group yang dihapus tidak bisa dikembalikan.",
      confirmLabel: "Ya, hapus",
      destructive: true,
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(slug)
          closeConfirmModal()
          openModalActions({
            success: true,
            descText: "Skill group berhasil dihapus.",
          })
        } catch (error) {
          closeConfirmModal()
          openModalActions({
            success: false,
            descText: "Skill group gagal dihapus.",
            infoText: getErrorMessage(error, "Coba lagi nanti."),
          })
        }
      },
    })
  }

  const columns = getSkillGroupColumns({
    onDetail: handleDetail,
    onEdit: handleEdit,
    onDelete: handleDelete,
  })
  const editingGroup = editingSlug
    ? (rows.find((row) => row.slug === editingSlug) ?? null)
    : null
  const detailGroup = detailSlug
    ? (rows.find((row) => row.slug === detailSlug) ?? null)
    : null

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">Skills</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola grup skill dalam dua bahasa.
          </p>
        </div>
        <Button type="button" onClick={handleAdd}>
          <Plus />
          Tambah skill group
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={rows}
        searchColumnId="title"
        searchPlaceholder="Cari judul atau slug..."
        emptyText="Belum ada skill group. Tambahkan skill group pertama."
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />

      <SkillGroupDetailDialog
        open={detailSlug !== null}
        group={detailGroup}
        onClose={() => setDetailSlug(null)}
      />

      <SkillGroupDialog
        open={dialogOpen}
        slug={editingSlug}
        initialData={editingGroup}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  )
}
