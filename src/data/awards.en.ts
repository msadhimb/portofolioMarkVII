import type { AwardItem } from "./profile"

export const awards: AwardItem[] = [
  {
    slug: "dicoding-react-expert",
    title: "React Web Developer Expert Certification",
    issuer: "Dicoding Indonesia",
    category: "certificate",
    issueDate: "2024",
    credentialId: "DICODING-RWD-2024-8841",
    credentialUrl:
      "https://www.dicoding.com/certificates/DICODING-RWD-2024-8841",
    description:
      "Advanced certification covering Clean Architecture, complex state management, automated testing (TDD/Cypress), PWA, and web performance.",
    skills: ["React", "Clean Architecture", "PWA", "TDD", "Cypress"],
  },
  {
    slug: "national-hackathon-2024",
    title: "1st Place Winner - National Web & AI Hackathon",
    issuer: "Ministry of ICT & Binar",
    category: "award",
    issueDate: "2024",
    credentialId: "HACK-KOMINFO-2024-01",
    credentialUrl: "https://kominfo.go.id",
    description:
      "First place honor for developing an intelligent localized LLM web platform aimed at digital inclusion for regional communities.",
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
      "Validation of foundational cloud architecture, security, compliance, serverless compute, and resilient infrastructure deployment.",
    skills: ["AWS", "Cloud Architecture", "S3", "Lambda", "IAM"],
  },
  {
    slug: "deans-list-academic-honor",
    title: "Dean's List / Valedictorian Honor in Informatics Engineering",
    issuer: "Faculty of Information Technology",
    category: "honor",
    issueDate: "2023",
    description:
      "Academic excellence honor awarded for top graduating GPA and published research on modern web computing architecture.",
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
      "Recognition for refactoring multi-tier approval workflows and optimizing enterprise dashboard rendering performance by 40%.",
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
      "Comprehensive curriculum spanning advanced JavaScript core concepts, React ecosystems, UX heuristics, version control, and accessibility.",
    skills: ["JavaScript", "React", "UI/UX", "Git", "Accessibility"],
  },
]
