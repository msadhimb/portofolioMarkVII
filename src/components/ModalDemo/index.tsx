"use client"

import { useActionModal } from "@/components/ActionModal/store"
import { useConfirmModal } from "@/components/ConfirmModal/store"
import { Button } from "@/components/ui/button"

/**
 * TODO(demo): HAPUS section + file ini setelah mencoba modal.
 * Contoh pemakaian pola SIMPP: Confirm → aksi → ActionModal feedback.
 */
export const ModalDemo = () => {
  const { openModalActions } = useActionModal()
  const { openConfirmModal } = useConfirmModal()

  const handleDelete = () => {
    openConfirmModal({
      title: "Hapus draft ini?",
      description: "Draft yang dihapus tidak bisa dikembalikan.",
      confirmLabel: "Ya, hapus",
      destructive: true,
      isLoading: false,
      onConfirm: async () => {
        await new Promise((resolve) => setTimeout(resolve, 800))
        openModalActions({
          success: true,
          descText: "Draft berhasil dihapus.",
        })
      },
    })
  }

  return (
    <section aria-label="Demo modal" className="border-t border-border py-14">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-5 sm:px-8">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={() =>
            openModalActions({
              success: true,
              descText: "Pesan berhasil disiapkan.",
              infoText: "Aplikasi email terbuka — tinggal tekan kirim.",
            })
          }
        >
          Demo sukses
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={() =>
            openModalActions({
              success: false,
              descText: "Gagal memuat data.",
              infoText: "Periksa koneksi lalu coba lagi.",
              doubleButton: true,
            })
          }
        >
          Demo gagal + 2 tombol
        </Button>
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          onClick={handleDelete}
        >
          Demo confirm destruktif
        </Button>
      </div>
    </section>
  )
}
