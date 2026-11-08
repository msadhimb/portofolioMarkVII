"use client"

import i18next from "i18next"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { Reveal } from "@/components/Reveal"
import { SectionHeading } from "@/components/SectionHeading"
import id from "./i18n/id"
import en from "./i18n/en"
import { useChatbot } from "./store"
import type { ChatLocale } from "./store/type"
import { validateChatInput } from "./validation"
import { ChatTerminal } from "./components/ChatTerminal"
import { ModelCard } from "./components/ModelCard"
import { PromptChips } from "./components/PromptChips"

export const ChatbotSection = () => {
  i18next.addResourceBundle("id", "Chatbot", id)
  i18next.addResourceBundle("en", "Chatbot", en)
  const { t, i18n } = useTranslation("Chatbot")

  const locale: ChatLocale = i18n.language === "en" ? "en" : "id"
  const greeting = t("greeting")
  const prompts = t("prompts", { returnObjects: true }) as string[]

  const {
    getChatModel,
    sendChat,
    stop,
    clear,
    syncGreeting,
    setInput,
    setInputErrorKey,
  } = useChatbot()
  const messages = useChatbot((s) => s.messages)
  const input = useChatbot((s) => s.input)
  const inputErrorKey = useChatbot((s) => s.inputErrorKey)
  const loading = useChatbot((s) => s.loading)
  const error = useChatbot((s) => s.error)

  const { data: modelData } = useQuery({
    queryKey: ["chatbot", "model"],
    queryFn: () => getChatModel(),
    staleTime: 60_000,
    retry: 1,
  })
  const model = modelData?.model ?? "ollama"

  const handleSubmitText = (raw: string) => {
    const result = validateChatInput(raw)
    if (result.errorKey) {
      setInputErrorKey(result.errorKey)
      return
    }
    sendChat(result.text, locale, {
      emptyReply: t("emptyReply"),
      contactSuffix: t("contactSuffix"),
      fallbackError: t("fallbackError"),
    })
  }

  const handleClear = () => clear(t("greeting"))

  useEffect(() => {
    syncGreeting(greeting)
  }, [greeting, syncGreeting])

  return (
    <section
      id="ai"
      aria-label={t("eyebrow")}
      className="relative scroll-mt-24 border-y border-border bg-muted/20 py-20 sm:py-28"
    >
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal>
            <SectionHeading
              index={t("index")}
              eyebrow={t("eyebrow")}
              title={
                <>
                  {t("titleA")}{" "}
                  <span className="font-display font-normal text-signal italic">
                    {t("titleAccent")}
                  </span>
                </>
              }
            >
              {t("description")}
            </SectionHeading>

            <PromptChips
              prompts={prompts}
              disabled={loading}
              onSelect={handleSubmitText}
            />

            <ModelCard
              model={model}
              onlineLabel={t("online")}
              modelLabel={t("modelLabel")}
              apiPath={t("apiPath")}
            />

            <p className="mt-5 max-w-sm font-mono text-[10px] leading-relaxed text-muted-foreground">
              {t("disclaimer")}
            </p>
          </Reveal>

          <Reveal delay={0.08} className="w-full">
            <ChatTerminal
              model={model}
              terminalTitle={t("terminalTitle")}
              messages={messages}
              loading={loading}
              error={error}
              input={input}
              inputErrorKey={inputErrorKey}
              thinkingLabel={t("thinking")}
              emptyStateLabel={t("emptyState")}
              copyLabel={t("copyAnswer")}
              placeholder={t("placeholder")}
              sendLabel={t("send")}
              stopLabel={t("stop")}
              clearLabel={t("clear")}
              hintLabel={t("inputHint")}
              validationEmptyLabel={t("validationEmpty")}
              validationTooLongLabel={t("validationTooLong")}
              onInputChange={setInput}
              onSubmitText={handleSubmitText}
              onStop={stop}
              onClear={handleClear}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
