import * as yup from "yup"

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const optionalDate = yup
  .string()
  .default("")
  .test("date-format", "Gunakan format YYYY-MM-DD.", (value) => {
    if (!value) return true
    return DATE_PATTERN.test(value)
  })

export const schemaExperience = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .required("Slug wajib diisi.")
    .matches(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan strip."),
  sortOrder: yup
    .number()
    .typeError("Urutan harus angka.")
    .min(0, "Urutan minimal 0.")
    .required("Urutan wajib diisi."),
  startDate: optionalDate,
  endDate: optionalDate,
  stacks: yup.string().default(""),
  idPeriod: yup.string().default(""),
  idRole: yup.string().trim().required("Peran (ID) wajib diisi."),
  idOrg: yup.string().trim().required("Organisasi (ID) wajib diisi."),
  idContext: yup.string().default(""),
  idPoints: yup.string().default(""),
  enPeriod: yup.string().default(""),
  enRole: yup.string().trim().required("Peran (EN) wajib diisi."),
  enOrg: yup.string().trim().required("Organisasi (EN) wajib diisi."),
  enContext: yup.string().default(""),
  enPoints: yup.string().default(""),
})
