import * as yup from "yup"

const metricItemSchema = yup.object().shape({
  label: yup.string().default(""),
  value: yup.string().default(""),
})

const decisionItemSchema = yup.object().shape({
  title: yup.string().default(""),
  detail: yup.string().default(""),
})

export const schemaProject = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .required("Slug wajib diisi.")
    .matches(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan strip."),
  image: yup.string().default(""),
  demoUrl: yup.string().default(""),
  repositoryUrl: yup.string().default(""),
  featured: yup.string().oneOf(["ya", "tidak"]).required("Pilih status unggulan."),
  technologies: yup.string().default(""),

  tagline: yup.string().default(""),
  role: yup.string().default(""),
  startDate: yup.string().default(""),
  endDate: yup.string().default(""),
  context: yup.string().default(""),

  title: yup.string().trim().required("Judul wajib diisi."),
  idDescription: yup.string().default(""),
  idProblem: yup.string().default(""),
  idHighlights: yup.string().default(""),
  idMetrics: yup.array().of(metricItemSchema).ensure(),
  idDecisions: yup.array().of(decisionItemSchema).ensure(),

  enDescription: yup.string().default(""),
  enProblem: yup.string().default(""),
  enHighlights: yup.string().default(""),
  enMetrics: yup.array().of(metricItemSchema).ensure(),
  enDecisions: yup.array().of(decisionItemSchema).ensure(),
})
