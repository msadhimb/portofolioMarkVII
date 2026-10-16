import { NextResponse } from "next/server"
import OpenAI from "openai"

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

const buildSystemPrompt = (locale: string) =>
  locale === "en"
    ? `...prompt EN kamu yang sama...`
    : `...prompt ID kamu yang sama...`

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

  let completion: Awaited<ReturnType<typeof createStream>>
  const createStream = () =>
    client.chat.completions.create(
      {
        model,
        stream: true,
        temperature: 0.7,
        messages: [
          { role: "system", content: buildSystemPrompt(locale) },
          ...userMessages,
        ],
      },
      { signal: req.signal }
    )

  try {
    completion = await createStream()
  } catch (err) {
    if (err instanceof OpenAI.APIError && err.status) {
      const messages: Record<number, { en: string; id: string }> = {
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
      const m = messages[err.status]
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

  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
    cancel() {
      completion.controller.abort()
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
