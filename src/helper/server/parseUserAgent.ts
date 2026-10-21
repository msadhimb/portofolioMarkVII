export type DeviceType = "desktop" | "mobile" | "tablet" | "bot" | "unknown"

export type UserAgentInfo = {
  deviceType: DeviceType
  browser: string | null
  os: string | null
  isBot: boolean
}

const BOT_PATTERN =
  /bot|crawler|spider|crawling|slurp|bingpreview|facebookexternalhit|headlesschrome|pagespeed|lighthouse|vercel-screenshot/i

const TABLET_PATTERN = /ipad|tablet|playbook|silk|android(?!.*mobile)/i
const MOBILE_PATTERN = /mobi|android|iphone|ipod|windows phone/i

const detectBrowser = (userAgent: string) => {
  if (/edg\//i.test(userAgent)) return "Edge"
  if (/opr\/|opera/i.test(userAgent)) return "Opera"
  if (/samsungbrowser/i.test(userAgent)) return "Samsung Internet"
  if (/chrome\/|crios/i.test(userAgent)) return "Chrome"
  if (/firefox\/|fxios/i.test(userAgent)) return "Firefox"
  if (/safari\//i.test(userAgent)) return "Safari"
  return null
}

const detectOs = (userAgent: string) => {
  if (/windows nt/i.test(userAgent)) return "Windows"
  if (/android/i.test(userAgent)) return "Android"
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS"
  if (/mac os x/i.test(userAgent)) return "macOS"
  if (/linux/i.test(userAgent)) return "Linux"
  return null
}

export const parseUserAgent = (userAgent: string | null): UserAgentInfo => {
  if (!userAgent) {
    return { deviceType: "unknown", browser: null, os: null, isBot: false }
  }

  const isBot = BOT_PATTERN.test(userAgent)
  const deviceType: DeviceType = isBot
    ? "bot"
    : TABLET_PATTERN.test(userAgent)
      ? "tablet"
      : MOBILE_PATTERN.test(userAgent)
        ? "mobile"
        : "desktop"

  return {
    deviceType,
    browser: detectBrowser(userAgent),
    os: detectOs(userAgent),
    isBot,
  }
}
