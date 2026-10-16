"use client"

import { create } from "zustand"
import type { ConfirmModalStore } from "./type"

export const useConfirmModal = create<ConfirmModalStore>()((set) => ({
  confirmActions: {
    isOpen: false,
    title: "",
    description: "",
    confirmLabel: "",
    cancelLabel: "",
    destructive: false,
    isLoading: false,
    onConfirm: () => {},
    onCancel: undefined,
  },
  openConfirmModal: (props) =>
    set({
      confirmActions: {
        ...props,
        isOpen: true,
      },
    }),
  closeConfirmModal: () =>
    set((state) => ({
      confirmActions: {
        ...state.confirmActions,
        isOpen: false,
      },
    })),
}))
