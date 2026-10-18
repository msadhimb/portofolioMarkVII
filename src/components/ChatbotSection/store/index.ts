"use client";

import { create } from "zustand";
import type { AxiosProgressEvent } from "axios";
import clientApi from "@/services/client";
import type {
  ChatFeedback,
  ChatLocale,
  ChatMsg,
  ChatTransportMsg,
  ChatbotStore,
} from "./type";

const GREETING_ID = "greeting";
const FALLBACK_MODEL = "ollama";
const MAX_HISTORY = 12;
const MAX_CONTENT = 4000;

let aborter: AbortController | null = null;

const createChatId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/** Mapper pesan store -> payload API (mirror batas server: 12 pesan terakhir). */
const toChatTransport = (messages: ChatMsg[]): ChatTransportMsg[] =>
  messages
    .filter((m) => m && typeof m.content === "string")
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: m.content.slice(0, MAX_CONTENT),
    }));

/** Ambil teks progresif dari event Axios (adapter XHR) jika tersedia. */
const readProgressText = (event: AxiosProgressEvent): string | null => {
  const native = event.event as unknown as
    | { currentTarget?: unknown; target?: unknown }
    | undefined;
  const target = (native?.currentTarget ?? native?.target ?? null) as {
    responseText?: unknown;
  } | null;
  if (target && typeof target.responseText === "string") return target.responseText;
  return null;
};

type ClientApiError = {
  message?: string;
  status?: number | string;
};

export const useChatbot = create<ChatbotStore>()((set, get) => ({
  messages: [],
  input: "",
  inputErrorKey: null,
  loading: false,
  error: null,

  setInput: (value) => set({ input: value, inputErrorKey: null }),

  setInputErrorKey: (key) => set({ inputErrorKey: key }),

  getChatModel: async () => {
    try {
      const res = await clientApi({ url: "/chat", method: "GET" });
      const model = (res as { model?: unknown })?.model;
      return { model: typeof model === "string" && model ? model : FALLBACK_MODEL };
    } catch (error) {
      console.error(error);
      return { model: FALLBACK_MODEL };
    }
  },

  sendChat: async (text: string, locale: ChatLocale, feedback: ChatFeedback) => {
    const clean = text.trim();
    if (!clean || get().loading) return;

    const userId = createChatId();
    const assistantId = createChatId();
    const history = [...get().messages, { id: userId, role: "user" as const, content: clean }];

    set({
      messages: [...history, { id: assistantId, role: "assistant" as const, content: "" }],
      input: "",
      inputErrorKey: null,
      error: null,
      loading: true,
    });

    const controller = new AbortController();
    aborter = controller;

    const appendToken = (chunk: string) => {
      if (!chunk) return;
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === assistantId ? { ...m, content: m.content + chunk } : m
        ),
      }));
    };

    const setAssistantContent = (content: string) =>
      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === assistantId ? { ...m, content } : m
        ),
      }));

    let seen = 0;
    let acc = "";

    try {
      // `clientApi` meneruskan config Axios: `onDownloadProgress` memberi
      // efek streaming token demi token, teks penuh tetap dipasang saat selesai.
      const res = await clientApi({
        url: "/chat",
        method: "POST",
        data: { locale, messages: toChatTransport(history) },
        signal: controller.signal,
        responseType: "text",
        transformResponse: [(data) => data],
        onDownloadProgress: (event: AxiosProgressEvent) => {
          const full = readProgressText(event);
          if (full && full.length > seen) {
            const chunk = full.slice(seen);
            seen = full.length;
            acc += chunk;
            appendToken(chunk);
          }
        },
      });

      const full = typeof res === "string" ? res : "";
      if (full.length > seen) {
        const chunk = full.slice(seen);
        acc += chunk;
        appendToken(chunk);
      }

      if (!acc.trim()) setAssistantContent(feedback.emptyReply);
    } catch (error) {
      if (controller.signal.aborted) {
        // Stop oleh user: buang placeholder kosong agar riwayat tetap bersih.
        set((state) => ({
          messages: state.messages.filter(
            (m) => m.id !== assistantId || m.content.trim() !== ""
          ),
        }));
      } else if (error === undefined || error === null) {
        // Body kosong yang ditolak `clientApi` — bukan error jaringan.
        setAssistantContent(feedback.emptyReply);
      } else {
        // Normalisasi `clientApi` membuang field `error` milik API, jadi
        // pesan spesifik server tak selalu tersedia; pakai fallback lokal.
        const detail = (error as ClientApiError).message;
        const message =
          detail && (error as ClientApiError).message
            ? `⚠️ ${detail} — ${feedback.contactSuffix}`
            : `⚠️ ${feedback.fallbackError} — ${feedback.contactSuffix}`;
        set({ error: message });
        setAssistantContent(message);
      }
    } finally {
      if (aborter === controller) aborter = null;
      set({ loading: false });
    }
  },

  stop: () => {
    aborter?.abort();
    aborter = null;
    if (get().loading) set({ loading: false });
  },

  clear: (greeting) => {
    aborter?.abort();
    aborter = null;
    set({
      messages: [{ id: GREETING_ID, role: "assistant", content: greeting }],
      input: "",
      inputErrorKey: null,
      error: null,
      loading: false,
    });
  },

  syncGreeting: (greeting) => {
    const current = get().messages;
    if (current.length === 0) {
      set({ messages: [{ id: GREETING_ID, role: "assistant", content: greeting }] });
      return;
    }
    if (current.length === 1 && current[0].id === GREETING_ID) {
      if (current[0].content !== greeting) {
        set({ messages: [{ id: GREETING_ID, role: "assistant", content: greeting }] });
      }
    }
  },
}));
