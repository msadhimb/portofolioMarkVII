import * as yup from "yup"

export const MAX_CHAT_INPUT = 2000

const chatInputSchema = yup.string().trim().min(1).max(MAX_CHAT_INPUT)

/**
 * Validasi input chat sebelum dikirim ke `useChat.send`.
 * Mengembalikan teks bersih atau `null` jika kosong.
 * Kelebihan panjang dipotong aman ke batas maksimum.
 */
export const parseChatInput = (raw: string): string | null => {
  const trimmed = raw.trim()
  if (!trimmed) return null
  try {
    const valid = chatInputSchema.validateSync(trimmed)
    return valid || null
  } catch {
    return trimmed.slice(0, MAX_CHAT_INPUT).trim() || null
  }
}
