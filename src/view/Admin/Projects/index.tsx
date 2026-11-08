"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useActionModal } from "@/components/ActionModal/store"
import { useConfirmModal } from "@/components/ConfirmModal/store"
import { DataTable } from "@/components/DataTable"
import { PageHeader } from "@/components/PageHeader/PageHeader"
import { getErrorMessage } from "@/helper/getErrorMessage"
import { unwrapList } from "@/lib/pagination"
import { getProjectColumns, type AdminProject } from "./table/columns"
import { ProjectDetailDialog } from "./components/ProjectDetailDialog"
import { ProjectDialog } from "./components/ProjectDialog"
import {
  ADMIN_PROJECTS_KEY,
  useDeleteProject,
} from "./hooks/useProjectsMutation"
import { useAdminProjects } from "./store"

export const ProjectsAdminView = () => {
  const { getAdminProjects } = useAdminProjects()
  const { openModalActions } = useActionModal()
  const { openConfirmModal, closeConfirmModal } = useConfirmModal()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [detailSlug, setDetailSlug] = useState<string | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ADMIN_PROJECTS_KEY,
    queryFn: () => getAdminProjects(),
  })

  const rows = unwrapList<AdminProject>(data)
  const deleteMutation = useDeleteProject()

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
      title: `Hapus project "${slug}"?`,
      description: "Project yang dihapus tidak bisa dikembalikan.",
      confirmLabel: "Ya, hapus",
      destructive: true,
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync(slug)
          closeConfirmModal()
          openModalActions({
            success: true,
            descText: "Project berhasil dihapus.",
          })
        } catch (error) {
          closeConfirmModal()
          openModalActions({
            success: false,
            descText: "Project gagal dihapus.",
            infoText: getErrorMessage(error, "Coba lagi nanti."),
          })
        }
      },
    })
  }

  const columns = getProjectColumns({
    onDetail: handleDetail,
    onEdit: handleEdit,
    onDelete: handleDelete,
  })
  const editingProject = editingSlug
    ? (rows.find((row) => row.slug === editingSlug) ?? null)
    : null
  const detailProject = detailSlug
    ? (rows.find((row) => row.slug === detailSlug) ?? null)
    : null

  return (
    <div className="flex flex-1 flex-col gap-4">
      <PageHeader
        title="Proyek"
        description="Kelola daftar proyek portofolio dalam dua bahasa."
        action={
          <Button type="button" onClick={handleAdd}>
            <Plus />
            Tambah proyek
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={rows}
        searchColumnId="title"
        searchPlaceholder="Cari judul atau slug..."
        emptyText="Belum ada project. Tambahkan project pertama."
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />

      <ProjectDetailDialog
        open={detailSlug !== null}
        project={detailProject}
        onClose={() => setDetailSlug(null)}
      />

      <ProjectDialog
        open={dialogOpen}
        slug={editingSlug}
        initialData={editingProject}
        onClose={() => setDialogOpen(false)}
      />
    </div>
  )
}
