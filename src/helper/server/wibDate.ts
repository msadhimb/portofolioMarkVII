export const WIB_TIME_ZONE = "Asia/Jakarta"

const wibDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: WIB_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

export const toWibDate = (date: Date | string = new Date()) => {
  const parts = wibDateFormatter.formatToParts(new Date(date))
  const year = parts.find((part) => part.type === "year")?.value
  const month = parts.find((part) => part.type === "month")?.value
  const day = parts.find((part) => part.type === "day")?.value
  return `${year}-${month}-${day}`
}
