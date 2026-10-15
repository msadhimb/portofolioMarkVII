"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ChatRole = "user" | "assistant";

export type ChatMsg = {
  id: string;
  role: ChatRole;
  content: string;
};

type UseChatOptions = {
  locale: string;
  initialGreeting: string;
};

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Hook chat streaming ke /api/chat (yang di-proxy ke Ollama via env).
 * - GET /api/chat untuk label model (tanpa secret).
 * - POST streaming plain-text, di-append token demi token.
 */
export const useChat = ({ locale, initialGreeting }: UseChatOptions) => {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: "greeting", role: "assistant", content: initialGreeting },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState("ollama");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Label model dari server (publik, tanpa secret).
  useEffect(() => {
    let alive = true;
    fetch("/api/chat")
      .then((r) => r.json())
      .then((j: { model?: string }) => {
        if (alive && typeof j.model === "string") setModel(j.model);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  // Reset greeting saat locale berubah (hanya jika chat masih perawan).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages((prev) =>
      prev.length === 1 && prev[0].id === "greeting"
        ? [{ id: "greeting", role: "assistant", content: initialGreeting }]
        : prev
    );
  }, [initialGreeting]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
  }, []);

  const send = useCallback(
    async (raw?: string) => {
      const text = (raw ?? input).trim();
      if (!text || loading) return;
      setError(null);
      const userMsg: ChatMsg = { id: uid(), role: "user", content: text };
      const history = [...messages, userMsg];
      setMessages(history);
      setInput("");
      setLoading(true);

      const assistantId = uid();
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            locale,
            messages: history.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new Error(
            typeof data.error === "string" ? data.error : `Request gagal (${res.status})`
          );
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const snapshot = acc;
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: snapshot } : m))
          );
        }
        if (!acc.trim()) {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content:
                      locale === "en"
                        ? "Hmm, empty reply — try asking again?"
                        : "Hmm, jawabannya kosong — coba tanya lagi ya?",
                  }
                : m
            )
          );
        }
      } catch (err) {
        const aborted =
          err instanceof DOMException && err.name === "AbortError";
        if (!aborted) {
          const msg =
            err instanceof Error ? err.message : "Terjadi kesalahan.";
          setError(msg);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId
                ? {
                    ...m,
                    content:
                      locale === "en"
                        ? `⚠️ ${msg} — or email me at halo@salmanbaqy.dev`
                        : `⚠️ ${msg} — atau email saya di halo@salmanbaqy.dev`,
                  }
                : m
            )
          );
        }
      } finally {
        abortRef.current = null;
        setLoading(false);
      }
    },
    [input, loading, locale, messages]
  );

  const clear = useCallback(() => {
    abortRef.current?.abort();
    setMessages([{ id: "greeting", role: "assistant", content: initialGreeting }]);
    setError(null);
  }, [initialGreeting]);

  return { messages, input, setInput, loading, model, error, send, stop, clear };
};
