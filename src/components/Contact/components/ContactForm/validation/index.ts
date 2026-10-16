import * as yup from "yup"
import { CONTACT_NEED_VALUES } from "../form"

export type ContactValidationDict = {
  nameRequired: string
  nameMax: string
  emailRequired: string
  emailInvalid: string
  emailMax: string
  needRequired: string
  messageRequired: string
  messageMin: string
  messageMax: string
}

export const createContactSchema = (dict: ContactValidationDict) =>
  yup.object({
    name: yup.string().trim().required(dict.nameRequired).max(80, dict.nameMax),
    email: yup
      .string()
      .trim()
      .required(dict.emailRequired)
      .email(dict.emailInvalid)
      .max(160, dict.emailMax),
    need: yup
      .string()
      .oneOf([...CONTACT_NEED_VALUES], dict.needRequired)
      .required(dict.needRequired),
    message: yup
      .string()
      .trim()
      .required(dict.messageRequired)
      .min(20, dict.messageMin)
      .max(2000, dict.messageMax),
  })

export type ContactSchema = yup.InferType<
  ReturnType<typeof createContactSchema>
>
