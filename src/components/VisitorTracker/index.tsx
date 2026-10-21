"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

const VISITOR_KEY = "portfolio_visitor_id"
const SESSION_KEY = "portfolio_visit_session"
const ENDPOINT = "/api/v1/visits"
const SKIP_PATH = /^\/(admin|api|_next)(\/|$)/

const createId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

const readStorage = (storage: Storage | null, key: string) => {
  try {
    return storage?.getItem(key) ?? null
  } catch {
    return null
  }
}

const writeStorage = (storage: Storage | null, key: string, value: string) => {
  try {
    storage?.setItem(key, value)
  } catch {
    // Storage bisa diblokir di private mode; cookie server tetap menjadi fallback.
  }
}

const getStorage = (kind: "local" | "session") => {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

const isDoNotTrack = () => {
  const legacy = (window as Window & { doNotTrack?: string }).doNotTrack
  return navigator.doNotTrack === "1" || legacy === "1"
}

const sendVisit = (payload: Record<string, unknown>) => {
  const body = JSON.stringify(payload)

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(
      ENDPOINT,
      new Blob([body], { type: "application/json" })
    )
    if (sent) return
  }

  void fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Tracking tidak boleh mengganggu pengalaman pengunjung.
  })
}

const VisitorTracker = () => {
  const pathname = usePathname()
  const lastPathRef = useRef<string | null>(null)
  const previousPathRef = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname || SKIP_PATH.test(pathname)) return
    if (lastPathRef.current === pathname) return
    if (isDoNotTrack()) return

    lastPathRef.current = pathname

    const localStore = getStorage("local")
    const sessionStore = getStorage("session")
    const visitorId = readStorage(localStore, VISITOR_KEY) ?? createId()
    const storedSessionId = readStorage(sessionStore, SESSION_KEY)
    const sessionId = storedSessionId ?? createId()
    const isNewSession = !storedSessionId

    writeStorage(localStore, VISITOR_KEY, visitorId)
    writeStorage(sessionStore, SESSION_KEY, sessionId)

    const search = new URLSearchParams(window.location.search)
    const referrer = previousPathRef.current || document.referrer || null

    previousPathRef.current = pathname

    sendVisit({
      path: pathname,
      referrer,
      visitorId,
      sessionId,
      isNewSession,
      screenWidth: window.screen?.width ?? null,
      screenHeight: window.screen?.height ?? null,
      language: navigator.language ?? null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
      utmSource: search.get("utm_source"),
      utmMedium: search.get("utm_medium"),
      utmCampaign: search.get("utm_campaign"),
    })
  }, [pathname])

  return null
}

export default VisitorTracker
