import { NextResponse } from "next/server"
import OpenAI from "openai"
import {
  CHAT_TOOLS,
  buildSystemPrompt,
  executeChatTool,
} from "./knowledge"

type ChatMessage = {
  role: "system" | "user" | "assistant"
  content: string
}

type ChatRequestBody = {
  messages?: ChatMessage[]
  locale?: string
}

const DEFAULT_MODEL = "gpt-oss:20b"
const DEFAULT_BASE_URL = "https://ollama.com/v1"

const getConfig = () => ({
  baseURL: (process.env.OLLAMA_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, ""),
  apiKey: process.env.OLLAMA_API_KEY || "",
  model: process.env.OLLAMA_MODEL || DEFAULT_MODEL,
})

export const GET = async () => {
  const { model, apiKey } = getConfig()
  return NextResponse.json({ model, ready: Boolean(apiKey), cloud: true })
}

export const POST = async (req: Request) => {
  let body: ChatRequestBody
  try {
    body = (await req.json()) as ChatRequestBody
  } catch {
    return NextResponse.json(
      { error: "Body harus JSON dengan field `messages`." },
      { status: 400 }
    )
  }

  const userMessages = (body.messages || [])
    .filter((m) => m && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: m.content.slice(0, 4000),
    }))

  if (userMessages.length === 0) {
    return NextResponse.json(
      { error: "Pesan kosong. Kirim minimal 1 pesan user." },
      { status: 400 }
    )
  }

  const locale = body.locale === "en" ? "en" : "id"
  const { baseURL, apiKey, model } = getConfig()

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          locale === "en"
            ? "OLLAMA_API_KEY is not configured on the server."
            : "OLLAMA_API_KEY belum dikonfigurasi di server.",
      },
      { status: 500 }
    )
  }

  const client = new OpenAI({ baseURL, apiKey, timeout: 60_000, maxRetries: 1 })

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: buildSystemPrompt(locale) },
    ...userMessages,
  ]

  let stream: ReadableStream<Uint8Array>
  const encoder = new TextEncoder()

  try {
    // 1. Initial call with tools enabled (evaluates if model wants to fetch knowledge)
    let initialRes: OpenAI.Chat.Completions.ChatCompletion
    try {
      initialRes = await client.chat.completions.create(
        {
          model,
          temperature: 0.2,
          messages,
          tools: CHAT_TOOLS,
          tool_choice: "auto",
        },
        { signal: req.signal }
      )
    } catch (toolsErr) {
      console.warn("Tool calling initial request failed, falling back to direct stream:", toolsErr)
      // Fallback if model doesn't support tools or tools parameter error
      const directStream = await client.chat.completions.create(
        {
          model,
          stream: true,
          temperature: 0.6,
          messages,
        },
        { signal: req.signal }
      )

      stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            for await (const chunk of directStream) {
              const text = chunk.choices[0]?.delta?.content
              if (text) controller.enqueue(encoder.encode(text))
            }
            controller.close()
          } catch (err) {
            controller.error(err)
          }
        },
        cancel() {
          directStream.controller.abort()
        },
      })

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "X-Ollama-Model": model,
        },
      })
    }

    const initialChoice = initialRes.choices[0]
    const toolCalls = initialChoice?.message?.tool_calls

    if (toolCalls && toolCalls.length > 0) {
      // 2. Execute tools requested by the model with real portfolio data
      messages.push(initialChoice.message)

      for (const call of toolCalls) {
        if (call.type === "function") {
          let parsedArgs: Record<string, unknown> = {}
          try {
            parsedArgs = JSON.parse(call.function.arguments || "{}")
          } catch {
            parsedArgs = {}
          }

          const toolResult = await executeChatTool(call.function.name, parsedArgs, locale)

          messages.push({
            role: "tool",
            tool_call_id: call.id,
            content: JSON.stringify(toolResult),
          })
        }
      }

      // 3. Final call streaming the grounded answer based on tool outputs
      const finalStream = await client.chat.completions.create(
        {
          model,
          stream: true,
          temperature: 0.5,
          messages,
        },
        { signal: req.signal }
      )

      stream = new ReadableStream<Uint8Array>({
        async start(controller) {
          try {
            for await (const chunk of finalStream) {
              const text = chunk.choices[0]?.delta?.content
              if (text) controller.enqueue(encoder.encode(text))
            }
            controller.close()
          } catch (err) {
            controller.error(err)
          }
        },
        cancel() {
          finalStream.controller.abort()
        },
      })
    } else {
      // No tools called; model answered directly
      const directContent = initialChoice?.message?.content || ""
      stream = new ReadableStream<Uint8Array>({
        start(controller) {
          if (directContent) {
            controller.enqueue(encoder.encode(directContent))
          }
          controller.close()
        },
      })
    }
  } catch (err) {
    if (err instanceof OpenAI.APIError && err.status) {
      const errorMessages: Record<number, { en: string; id: string }> = {
        401: {
          en: "Invalid or missing Ollama API key.",
          id: "API key Ollama tidak valid atau hilang.",
        },
        404: {
          en: `Model "${model}" not found on Ollama Cloud.`,
          id: `Model "${model}" tidak ditemukan di Ollama Cloud.`,
        },
        429: {
          en: "Ollama Cloud rate limit reached. Try again later.",
          id: "Batas penggunaan Ollama Cloud tercapai. Coba lagi nanti.",
        },
      }
      const m = errorMessages[err.status]
      return NextResponse.json(
        { error: m ? m[locale] : `Ollama Cloud error (${err.status}).` },
        { status: err.status === 404 ? 502 : err.status }
      )
    }
    return NextResponse.json(
      {
        error:
          locale === "en"
            ? "Cannot reach Ollama Cloud. Please try again shortly."
            : "Ollama Cloud tidak terjangkau. Coba lagi sebentar.",
      },
      { status: 503 }
    )
  }

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Ollama-Model": model,
    },
  })
}
