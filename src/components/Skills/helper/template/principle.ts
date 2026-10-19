type Principle = {
  title: string
  note: string
}

export const principlesId = [
  {
    id: {
      title: "Struktur sebelum kecepatan mengetik",
      note: "Kontrak tipe, batas modul, dan aliran data ditetapkan dulu. Fitur cepat tidak berguna jika tidak bisa diubah enam bulan kemudian.",
    },
    en: {
      title: "Structure before typing speed",
      note: "Type contracts, module boundaries, and data flow come first. Shipping fast is useless if it can't change six months later.",
    },
  },
  {
    id: {
      title: "Server state ≠ client state",
      note: "Cache milik React Query, preferensi UI milik Zustand. Tidak ada dua source of truth untuk satu data.",
    },
    en: {
      title: "Server state ≠ client state",
      note: "Cache belongs to React Query, UI preferences to Zustand. No two sources of truth for one piece of data.",
    },
  },
  {
    id: {
      title: "Keamanan sebagai default",
      note: "RLS, validasi ganda (client + server), dan prinsip least-privilege — terutama untuk data finansial dan enterprise.",
    },
    en: {
      title: "Security by default",
      note: "RLS, double validation (client + server), and least privilege — especially for financial and enterprise data.",
    },
  },
  {
    id: {
      title: "Motion melayani narasi",
      note: "RLS, validasi ganda (client + server), dan prinsip least-privilege — terutama untuk data finansial dan enterprise.",
    },
    en: {
      title: "Motion serves narrative",
      note: "Animation exists only if it aids orientation or emotion. Respect prefers-reduced-motion.",
    },
  },
]

export const getPrinciples = (locale: string): Principle[] => {
  const lang = locale?.startsWith("en") ? "en" : "id"
  return principlesId.map((p) => p[lang])
}
