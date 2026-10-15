/**
 * Data tiruan untuk diukur <Shimmer> saat loading.
 * Struktur disamakan dengan respons /api/projects/[slug] agar layout shimmer 1:1.
 */
export const projectTemplate = {
  slug: "duitku",
  title: "Memuat judul project",
  tagline: "Memuat tagline project",
  description:
    "Memuat deskripsi project. Memuat deskripsi project. Memuat deskripsi project.",
  problem:
    "Memuat penjelasan masalah. Memuat penjelasan masalah. Memuat penjelasan masalah. Memuat penjelasan masalah.",
  role: "Memuat peran",
  period: "2024 — Sekarang",
  context: "Memuat konteks",
  technologies: [
    "Next.js",
    "TypeScript",
    "Supabase",
    "PostgreSQL",
    "Tailwind CSS",
    "React Query",
    "Zustand",
    "Vercel",
  ],
  highlights: [
    "Memuat highlight project yang sedang dimuat dari server.",
    "Memuat highlight project yang sedang dimuat dari server.",
    "Memuat highlight project yang sedang dimuat dari server.",
    "Memuat highlight project yang sedang dimuat dari server.",
  ],
  decisions: [
    {
      title: "Memuat judul keputusan",
      detail:
        "Memuat detail keputusan. Memuat detail keputusan. Memuat detail keputusan.",
    },
    {
      title: "Memuat judul keputusan",
      detail:
        "Memuat detail keputusan. Memuat detail keputusan. Memuat detail keputusan.",
    },
  ],
  related: [
    { slug: "pln-pusmanpro", title: "Memuat judul project" },
    { slug: "dna-wedding-invitation", title: "Memuat judul project" },
  ],
}
