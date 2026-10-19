export const siteConfig = {
  siteName: "Muhamad Salman Adhim Baqy",
  shortName: "Salman",
  monogram: "sa",
  location: "Salatiga, Jawa Tengah",
  email: "adhimbaqy72@gmail.com",
  github: "https://github.com/msadhimb?tab=repositories",
  linkedin: "https://www.linkedin.com/in/muhamad-salman-adhim-baqy-618a51353/",
}

export type Experience = {
  slug: string
  period: string
  role: string
  org: string
  context: string
  points: string[]
  stack: string[]
}

export type SkillGroup = {
  title: string
  note: string
  items: string[]
}

export type AwardCategory = "certificate" | "award" | "honor"

export type AwardItem = {
  slug: string
  title: string
  issuer: string
  category: AwardCategory
  issueDate: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
  description: string
  skills: string[]
}
