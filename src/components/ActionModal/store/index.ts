"use client"

import { create } from "zustand"
import type { ActionModalStore } from "./type"

export const useActionModal = create<ActionModalStore>()((set) => ({
  modalActions: {
    success: true,
    isOpen: false,
    descText: "",
    infoText: "",
    doubleButton: false,
    closeButton: false,
    link: undefined,
    onCancel: undefined,
    onConfirm: undefined,
  },
  openModalActions: (props) =>
    set({
      modalActions: {
        ...props,
        isOpen: true,
      },
    }),
  closeModalActions: () =>
    set((state) => ({
      modalActions: {
        ...state.modalActions,
        isOpen: false,
      },
    })),
}))
