import * as yup from "yup"

const translationShape = {
  title: yup.string().trim().required("Judul wajib diisi."),
  tagline: yup.string().default(""),
  description: yup.string().default(""),
  problem: yup.string().default(""),
  role: yup.string().default(""),
  period: yup.string().default(""),
  context: yup.string().default(""),
  highlights: yup.string().default(""),
  metrics: yup.string().default(""),
  decisions: yup.string().default(""),
}

export const schemaProject = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .required("Slug wajib diisi.")
    .matches(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, dan strip."),
  image: yup.string().default(""),
  demoUrl: yup.string().default(""),
  repositoryUrl: yup.string().default(""),
  featured: yup.string().oneOf(["ya", "tidak"]).required(),
  sortOrder: yup
    .number()
    .typeError("Urutan harus angka.")
    .min(0, "Urutan minimal 0.")
    .required("Urutan wajib diisi."),
  technologies: yup.string().default(""),
  idTitle: translationShape.title,
  idTagline: translationShape.tagline,
  idDescription: translationShape.description,
  idProblem: translationShape.problem,
  idRole: translationShape.role,
  idPeriod: translationShape.period,
  idContext: translationShape.context,
  idHighlights: translationShape.highlights,
  idMetrics: translationShape.metrics,
  idDecisions: translationShape.decisions,
  enTitle: translationShape.title,
  enTagline: translationShape.tagline,
  enDescription: translationShape.description,
  enProblem: translationShape.problem,
  enRole: translationShape.role,
  enPeriod: translationShape.period,
  enContext: translationShape.context,
  enHighlights: translationShape.highlights,
  enMetrics: translationShape.metrics,
  enDecisions: translationShape.decisions,
})
