import * as yup from "yup"

const YEAR_PATTERN = /^\d{4}$/

const optionalYear = yup
  .string()
  .default("")
  .test("year-format", "Gunakan format 4 digit (contoh: 2026).", (value) => {
    if (!value) return true
    return YEAR_PATTERN.test(value)
  })

export const schemaAward = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .required("Slug wajib diisi.")
    .matches(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan strip."),
  category: yup
    .string()
    .oneOf(["certificate", "award", "honor"], "Kategori tidak valid.")
    .required("Kategori wajib dipilih."),
  issueDate: yup
    .string()
    .trim()
    .required("Tahun terbit wajib diisi.")
    .matches(YEAR_PATTERN, "Tahun terbit harus 4 digit (contoh: 2024)."),
  expiryDate: optionalYear,
  credentialId: yup.string().default(""),
  credentialUrl: yup
    .string()
    .trim()
    .default("")
    .test(
      "is-url",
      "Format URL tidak valid (harus diawali http:// atau https://).",
      (value) => !value || /^https?:\/\//.test(value)
    ),
  skills: yup.string().default(""),
  // Indonesia
  idTitle: yup.string().trim().required("Judul (ID) wajib diisi."),
  idIssuer: yup.string().trim().required("Penerbit (ID) wajib diisi."),
  idDescription: yup.string().trim().required("Deskripsi (ID) wajib diisi."),
  // English
  enTitle: yup.string().trim().required("Title (EN) wajib diisi."),
  enIssuer: yup.string().trim().required("Issuer (EN) wajib diisi."),
  enDescription: yup.string().trim().required("Description (EN) wajib diisi."),
})
