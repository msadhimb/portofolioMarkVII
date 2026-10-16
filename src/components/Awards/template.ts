import type { AwardItem } from "@/data/profile"

/**
 * Data placeholder untuk diukur oleh <Shimmer> saat state loading.
 */
export const awardsTemplate: AwardItem[] = [
  {
    slug: "template-1",
    title: "Memuat nama sertifikat...",
    issuer: "Memuat penerbit...",
    category: "certificate",
    issueDate: "2024",
    credentialId: "CERT-XXXX-XXXX",
    description: "Memuat ringkasan sertifikasi dan materi kompetensi yang telah divalidasi.",
    skills: ["Next.js", "TypeScript", "React"],
  },
  {
    slug: "template-2",
    title: "Memuat nama penghargaan...",
    issuer: "Memuat organisasi...",
    category: "award",
    issueDate: "2024",
    credentialId: "AWD-XXXX-XXXX",
    description: "Memuat pencapaian kompetisi inovasi sistem informasi dan rekayasa perangkat lunak.",
    skills: ["AI Integration", "PostgreSQL", "Tailwind"],
  },
  {
    slug: "template-3",
    title: "Memuat nama honor...",
    issuer: "Memuat institusi...",
    category: "honor",
    issueDate: "2023",
    description: "Memuat penghargaan prestasi kehormatan akademik atau kontribusi industri.",
    skills: ["Software Engineering", "Algorithms"],
  },
]
