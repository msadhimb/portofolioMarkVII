import * as yup from "yup";
import type { ChatInputErrorKey } from "../store/type";

export const MAX_CHAT_INPUT = 2000;

export const chatInputSchema = yup
  .string()
  .trim()
  .min(1, "empty")
  .max(MAX_CHAT_INPUT, "too_long");

export type ChatInputValidation =
  | { text: string; errorKey: null }
  | { text: null; errorKey: ChatInputErrorKey };

/**
 * Validasi input chat sebelum dikirim ke store.
 * Mengembalikan teks bersih atau `errorKey` yang diterjemahkan di component
 * (jangan menaruh string bahasa di sini agar store tetap netral).
 */
export const validateChatInput = (raw: string): ChatInputValidation => {
  const trimmed = raw.trim();
  if (!trimmed) return { text: null, errorKey: "empty" };
  try {
    const valid = chatInputSchema.validateSync(trimmed);
    if (!valid) return { text: null, errorKey: "empty" };
    return { text: valid, errorKey: null };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      if (error.message === "too_long" || error.type === "max") {
        return { text: null, errorKey: "too_long" };
      }
    }
    if (trimmed.length > MAX_CHAT_INPUT) return { text: null, errorKey: "too_long" };
    return { text: null, errorKey: "empty" };
  }
};
