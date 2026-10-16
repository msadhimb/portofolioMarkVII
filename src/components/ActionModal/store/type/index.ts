export type ActionLink = {
  text: string
  direct: string
  replace?: boolean
}

export type ActionModalProps = {
  success: boolean
  isOpen: boolean
  /** Judul utama — di-pass sudah diterjemahkan dari caller. */
  descText: string
  /** Detail tambahan — di-pass sudah diterjemahkan dari caller. */
  infoText?: string
  /** Dua tombol: aksi utama + tutup. */
  doubleButton?: boolean
  /** Tampilkan tombol X. Default false: user wajib lewat tombol. */
  closeButton?: boolean
  link?: ActionLink
  /** Dijalankan saat modal ditutup via tombol utama / X / Escape. */
  onConfirm?: () => void
  /** Dijalankan saat tombol kedua diklik. Default: onConfirm. */
  onCancel?: () => void
}

export type ActionModalStore = {
  modalActions: ActionModalProps
  openModalActions: (props: Omit<ActionModalProps, "isOpen">) => void
  closeModalActions: () => void
}
