export const countErrorsByPrefix = (
  errors: Record<string, unknown>,
  prefixes: {
    umum: (key: string) => boolean
    id: (key: string) => boolean
    en: (key: string) => boolean
  }
) => {
  const counts = { umum: 0, id: 0, en: 0 }
  for (const key of Object.keys(errors)) {
    if (prefixes.en(key)) counts.en += 1
    else if (prefixes.id(key)) counts.id += 1
    else if (prefixes.umum(key)) counts.umum += 1
  }
  return counts
}
