import type { AwardItem } from "./profile"

export const awards: AwardItem[] = [
  {
    slug: "dicoding-react-expert",
    title: "Menjadi React Web Developer Expert",
    issuer: "Dicoding Indonesia",
    category: "certificate",
    issueDate: "2024",
    credentialId: "DICODING-RWD-2024-8841",
    credentialUrl:
      "https://www.dicoding.com/certificates/DICODING-RWD-2024-8841",
    description:
      "Sertifikasi tingkat lanjut mencakup Clean Architecture, state management kompleks, automation testing (TDD/Cypress), PWA, dan performa web.",
    skills: ["React", "Clean Architecture", "PWA", "TDD", "Cypress"],
  },
  {
    slug: "national-hackathon-2024",
    title: "Juara 1 - National Web & AI Hackathon",
    issuer: "Kementerian Kominfo & Binar",
    category: "award",
    issueDate: "2024",
    credentialId: "HACK-KOMINFO-2024-01",
    credentialUrl: "https://kominfo.go.id",
    description:
      "Penghargaan juara pertama dalam kategori inovasi solusi web cerdas berbasis LLM lokal untuk inklusi digital masyarakat daerah.",
    skills: ["Next.js", "AI Integration", "FastAPI", "PostgreSQL", "Tailwind"],
  },
  {
    slug: "aws-cloud-practitioner",
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    category: "certificate",
    issueDate: "2023",
    expiryDate: "2026",
    credentialId: "AWS-CCP-992147",
    credentialUrl: "https://aws.amazon.com/verification",
    description:
      "Validasi pemahaman mendalam tentang arsitektur cloud, keamanan dan kepatuhan data, komputasi serverless, dan infrastruktur skalabel.",
    skills: ["AWS", "Cloud Architecture", "S3", "Lambda", "IAM"],
  },
  {
    slug: "deans-list-academic-honor",
    title: "Dean's List / Predikat Lulusan Terbaik Teknik Informatika",
    issuer: "Fakultas Teknologi Informasi",
    category: "honor",
    issueDate: "2023",
    description:
      "Penghargaan kehormatan akademik atas capaian IPK tertinggi dan kontribusi penelitian komputasi web modern selama masa studi.",
    skills: [
      "Computer Science",
      "Algorithms",
      "Software Engineering",
      "Research",
    ],
  },
  {
    slug: "pln-innovation-award",
    title: "Best Contributor for Digital Workplace System",
    issuer: "PLN Pusmanpro Innovation Summit",
    category: "award",
    issueDate: "2023",
    description:
      "Pengakuan atas inisiatif refaktorisasi arsitektur approval bertingkat dan peningkatan kecepatan rendering dashboard enterprise hingga 40%.",
    skills: [
      "Enterprise Architecture",
      "React Query",
      "Audit Logging",
      "Optimization",
    ],
  },
  {
    slug: "meta-frontend-developer",
    title: "Meta Professional Frontend Developer",
    issuer: "Meta (Coursera)",
    category: "certificate",
    issueDate: "2022",
    credentialId: "META-FRONTEND-77312",
    credentialUrl:
      "https://coursera.org/verify/professional-cert/META-FRONTEND-77312",
    description:
      "Kurikulum profesional komprehensif mencakup fundamental JavaScript tingkat lanjut, React, UX research, version control, dan UI responsiveness.",
    skills: ["JavaScript", "React", "UI/UX", "Git", "Accessibility"],
  },
]
