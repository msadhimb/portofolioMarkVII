export type ConfirmModalProps = {
  isOpen: boolean
  /** Judul — di-pass sudah diterjemahkan dari caller. */
  title: string
  /** Penjelasan + konsekuensi — di-pass sudah diterjemahkan. */
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** Gaya destruktif: tombol confirm merah. */
  destructive?: boolean
  /** Loading dari caller (mis. mutation). Tombol terkunci selama true. */
  isLoading?: boolean
  /** Boleh async; tombol terkunci sampai promise selesai. */
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
}

export type ConfirmModalStore = {
  confirmActions: ConfirmModalProps
  openConfirmModal: (props: Omit<ConfirmModalProps, "isOpen">) => void
  closeConfirmModal: () => void
}
