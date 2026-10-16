export type ChatRole = "user" | "assistant";

export type ChatLocale = "id" | "en";

export type ChatMsg = {
  id: string;
  role: ChatRole;
  content: string;
};

/** Payload transport ke `POST /chat` (tanpa id lokal). */
export type ChatTransportMsg = {
  role: ChatRole;
  content: string;
};

export type ChatInputErrorKey = "empty" | "too_long";

/** String feedback lokal yang diterjemahkan di component (punya `t`). */
export type ChatFeedback = {
  emptyReply: string;
  contactSuffix: string;
  fallbackError: string;
};

export interface ChatbotStore {
  messages: ChatMsg[];
  input: string;
  inputErrorKey: ChatInputErrorKey | null;
  loading: boolean;
  error: string | null;
  setInput: (value: string) => void;
  setInputErrorKey: (key: ChatInputErrorKey | null) => void;
  getChatModel: () => Promise<{ model: string }>;
  sendChat: (text: string, locale: ChatLocale, feedback: ChatFeedback) => Promise<void>;
  stop: () => void;
  clear: (greeting: string) => void;
  syncGreeting: (greeting: string) => void;
}
