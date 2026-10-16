import * as yup from "yup"

export const schemaAward = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .required("Slug wajib diisi.")
    .matches(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan strip."),
  category: yup
    .string()
    .oneOf(["certificate", "award", "honor"], "Kategori tidak valid.")
    .required("Kategori wajib dipilih."),
  sortOrder: yup
    .number()
    .typeError("Urutan harus berupa angka.")
    .min(0, "Urutan minimal 0.")
    .required("Urutan wajib diisi."),
  issueDate: yup.string().trim().required("Tahun / tanggal terbit wajib diisi."),
  expiryDate: yup.string().default(""),
  credentialId: yup.string().default(""),
  credentialUrl: yup
    .string()
    .trim()
    .test("is-url", "Format URL tidak valid.", (val) => !val || /^https?:\/\//.test(val))
    .default(""),
  skills: yup.string().default(""),
  // Indonesia
  idTitle: yup.string().trim().required("Judul (ID) wajib diisi."),
  idIssuer: yup.string().trim().required("Penerbit/Penyelenggara (ID) wajib diisi."),
  idDescription: yup.string().trim().required("Deskripsi (ID) wajib diisi."),
  // English
  enTitle: yup.string().trim().required("Title (EN) wajib diisi."),
  enIssuer: yup.string().trim().required("Issuer (EN) wajib diisi."),
  enDescription: yup.string().trim().required("Description (EN) wajib diisi."),
})

export type AwardFormData = yup.InferType<typeof schemaAward>
