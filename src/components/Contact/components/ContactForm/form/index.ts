export const CONTACT_NEED_VALUES = [
  "fulltime",
  "contract",
  "freelance",
  "other",
] as const

export type ContactNeed = (typeof CONTACT_NEED_VALUES)[number]

export type ContactFormData = {
  name: string
  email: string
  need: ContactNeed | ""
  message: string
}

export const contactDefaultValues: ContactFormData = {
  name: "",
  email: "",
  need: "",
  message: "",
}
