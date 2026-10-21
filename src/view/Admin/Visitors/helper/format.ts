const DEVICE_LABELS: Record<string, string> = {
  desktop: "Desktop",
  mobile: "Mobile",
  tablet: "Tablet",
  bot: "Bot",
  unknown: "Tidak diketahui",
}

const regionNames =
  typeof Intl.DisplayNames !== "undefined"
    ? new Intl.DisplayNames(["id"], { type: "region" })
    : null

export const formatDevice = (value: string | null) =>
  DEVICE_LABELS[value ?? "unknown"] ?? value ?? "Tidak diketahui"

export const formatCountry = (value: string | null) => {
  if (!value || value === "unknown") return "Tidak diketahui"
  try {
    return regionNames?.of(value) ?? value
  } catch {
    return value
  }
}

export const formatWibDateTime = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))

export const formatWibDay = (value: string) =>
  new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T00:00:00+07:00`))

export const formatRelative = (value: string) => {
  const diff = Date.now() - new Date(value).getTime()
  const minutes = Math.max(0, Math.floor(diff / 60_000))

  if (minutes < 1) return "baru saja"
  if (minutes < 60) return `${minutes} menit lalu`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} jam lalu`

  const days = Math.floor(hours / 24)
  return `${days} hari lalu`
}

export const isOnline = (lastSeen: string) =>
  Date.now() - new Date(lastSeen).getTime() < 5 * 60 * 1000

export const shortVisitorId = (visitorId: string) =>
  `#${visitorId.replace(/-/g, "").slice(0, 8)}`

export const formatLocation = ({
  city,
  region,
  country,
}: {
  city: string | null
  region: string | null
  country: string | null
}) => {
  const parts = [city, region, formatCountry(country)].filter(
    (part): part is string => Boolean(part) && part !== "Tidak diketahui"
  )
  return parts.length > 0 ? parts.join(", ") : "Tidak diketahui"
}
