import { randomUUID } from "node:crypto"
import { after, NextResponse, type NextRequest } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { parseUserAgent } from "@/helper/server/parseUserAgent"
import { isRateLimited } from "@/helper/server/rateLimit"
import {
  getClientIp,
  getGeo,
  hashIp,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  VISITOR_COOKIE,
  VISITOR_TTL_SECONDS,
} from "@/helper/server/visitMetadata"

export const dynamic = "force-dynamic"

type VisitPayload = {
  path?: string
  referrer?: string | null
  visitorId?: string | null
  sessionId?: string | null
  isNewSession?: boolean
  screenWidth?: number | null
  screenHeight?: number | null
  language?: string | null
  timezone?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
}

const ID_PATTERN = /^[a-zA-Z0-9_-]{8,64}$/
const SKIP_PATH = /^\/(admin|api|_next)(\/|$)/

const cleanText = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : null

const cleanDimension = (value: unknown) => {
  if (typeof value !== "number" || !Number.isFinite(value)) return null
  const rounded = Math.round(value)
  return rounded >= 0 && rounded <= 10_000 ? rounded : null
}

const cleanPath = (value: unknown) => {
  if (typeof value !== "string") return "/"
  const path = value.trim()
  if (!path.startsWith("/") || path.startsWith("//")) return "/"
  return path.slice(0, 500)
}

const cleanReferrer = (value: unknown) => {
  if (typeof value !== "string") return null
  const referrer = value.trim()
  if (!referrer) return null
  if (
    !referrer.startsWith("http://") &&
    !referrer.startsWith("https://") &&
    !referrer.startsWith("/")
  ) {
    return null
  }
  return referrer.slice(0, 500)
}

const noContent = () => new NextResponse(null, { status: 204 })

export const POST = async (request: NextRequest) => {
  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (contentLength > 8_192) {
    return new NextResponse(null, { status: 413 })
  }

  const raw = await request.text().catch(() => "")
  if (raw.length > 8_192) {
    return new NextResponse(null, { status: 413 })
  }
  if (!raw) return noContent()

  let payload: VisitPayload | null = null
  try {
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      payload = parsed as VisitPayload
    }
  } catch {
    return noContent()
  }
  if (!payload) return noContent()

  const path = cleanPath(payload.path)
  if (SKIP_PATH.test(path)) return noContent()

  const userAgent = cleanText(request.headers.get("user-agent"), 500)
  const agent = parseUserAgent(userAgent)
  if (agent.isBot) return noContent()

  const cookieVisitorId = request.cookies.get(VISITOR_COOKIE)?.value
  const bodyVisitorId = cleanText(payload.visitorId, 64)
  const visitorId = ID_PATTERN.test(cookieVisitorId ?? "")
    ? cookieVisitorId!
    : ID_PATTERN.test(bodyVisitorId ?? "")
      ? bodyVisitorId!
      : randomUUID()

  const cookieSessionId = request.cookies.get(SESSION_COOKIE)?.value
  const bodySessionId = cleanText(payload.sessionId, 64)
  const hasSessionCookie = ID_PATTERN.test(cookieSessionId ?? "")
  const sessionId = hasSessionCookie
    ? cookieSessionId!
    : ID_PATTERN.test(bodySessionId ?? "")
      ? bodySessionId!
      : randomUUID()
  const newSession = hasSessionCookie
    ? false
    : ID_PATTERN.test(bodySessionId ?? "")
      ? Boolean(payload.isNewSession)
      : true

  const ip = getClientIp(request)
  const ipHash = hashIp(ip)
  const geo = getGeo(request)

  if (isRateLimited(ipHash ?? visitorId)) return noContent()

  const response = noContent()
  const secure = process.env.NODE_ENV === "production"

  response.cookies.set(VISITOR_COOKIE, visitorId, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: VISITOR_TTL_SECONDS,
  })
  response.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  })

  after(async () => {
    try {
      const supabase = createAdminClient()
      const { error } = await supabase.rpc("record_site_visit", {
        p_visitor_id: visitorId,
        p_session_id: sessionId,
        p_new_session: newSession,
        p_path: path,
        p_referrer: cleanReferrer(payload.referrer),
        p_user_agent: userAgent,
        p_device_type: agent.deviceType,
        p_browser: agent.browser,
        p_os: agent.os,
        p_country: geo.country,
        p_region: geo.region,
        p_city: geo.city,
        p_timezone: cleanText(payload.timezone, 80) ?? geo.timezone,
        p_language: cleanText(payload.language, 40),
        p_screen_width: cleanDimension(payload.screenWidth),
        p_screen_height: cleanDimension(payload.screenHeight),
        p_ip_hash: ipHash,
        p_utm_source: cleanText(payload.utmSource, 100),
        p_utm_medium: cleanText(payload.utmMedium, 100),
        p_utm_campaign: cleanText(payload.utmCampaign, 100),
        p_is_bot: false,
      })

      if (error) {
        console.error("[POST /api/v1/visits] Supabase error:", error.message)
      }
    } catch (error) {
      console.error(
        "[POST /api/v1/visits] Unexpected error:",
        error instanceof Error ? error.message : String(error)
      )
    }
  })

  return response
}
