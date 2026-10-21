import { createHash } from "node:crypto"
import type { NextRequest } from "next/server"

export const VISITOR_COOKIE = "portfolio_visitor"
export const SESSION_COOKIE = "portfolio_visit_session"
export const VISITOR_TTL_SECONDS = 60 * 60 * 24 * 365
export const SESSION_TTL_SECONDS = 60 * 30

const decodeHeader = (value: string | null) => {
  if (!value) return null
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

const cleanHeader = (value: string | null) => {
  const decoded = decodeHeader(value)?.trim()
  return decoded ? decoded.slice(0, 120) : null
}

export const getClientIp = (request: NextRequest) => {
  const forwarded = request.headers.get("x-forwarded-for")
  const forwardedIp = forwarded?.split(",")[0]?.trim()
  return forwardedIp || request.headers.get("x-real-ip")?.trim() || null
}

export const hashIp = (ip: string | null) => {
  if (!ip) return null
  const salt = process.env.VISIT_HASH_SALT ?? "portfolio-analytics"
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex")
}

export const getGeo = (request: NextRequest) => ({
  country:
    cleanHeader(request.headers.get("x-vercel-ip-country"))?.toUpperCase() ??
    null,
  region: cleanHeader(request.headers.get("x-vercel-ip-country-region")),
  city: cleanHeader(request.headers.get("x-vercel-ip-city")),
  timezone: cleanHeader(request.headers.get("x-vercel-ip-timezone")),
})
