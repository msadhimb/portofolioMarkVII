import * as yup from "yup"

export const schemaSkillGroup = yup.object().shape({
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
  items: yup.string().default(""),
  idTitle: yup.string().trim().required("Judul (ID) wajib diisi."),
  idNote: yup.string().default(""),
  enTitle: yup.string().trim().required("Judul (EN) wajib diisi."),
  enNote: yup.string().default(""),
})
