import moment from "moment"
import type { AdminProject } from "../table/columns"

export type MetricItem = {
  label: string
  value: string
}

export type DecisionItem = {
  title: string
  detail: string
}

export type ProjectFormData = {
  slug: string
  image: string
  demoUrl: string
  repositoryUrl: string
  featured: string
  technologies: string
  tagline: string
  role: string
  startDate: string
  endDate: string
  context: string
  title: string
  idDescription: string
  idProblem: string
  idHighlights: string
  idMetrics: MetricItem[]
  idDecisions: DecisionItem[]
  enDescription: string
  enProblem: string
  enHighlights: string
  enMetrics: MetricItem[]
  enDecisions: DecisionItem[]
}

export const projectDefaultValues: ProjectFormData = {
  slug: "",
  image: "",
  demoUrl: "",
  repositoryUrl: "",
  featured: "tidak",
  technologies: "",
  tagline: "",
  role: "",
  startDate: "",
  endDate: "",
  context: "",
  title: "",
  idDescription: "",
  idProblem: "",
  idHighlights: "",
  idMetrics: [],
  idDecisions: [],
  enDescription: "",
  enProblem: "",
  enHighlights: "",
  enMetrics: [],
  enDecisions: [],
}

export const toLines = (items: string[]): string => items.join("\n")

export const fromLines = (value: string): string[] =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

export const timestampToMonthInput = (value?: string | null): string => {
  if (!value) return ""
  const parsed = moment.utc(value)
  return parsed.isValid() ? parsed.startOf("month").format("YYYY-MM-DD") : ""
}

export const monthInputToTimestamp = (value?: string | null): string | null => {
  if (!value) return null
  const parsed = moment.utc(value, "YYYY-MM-DD", true)
  return parsed.isValid() ? parsed.startOf("month").toISOString() : null
}

export const formatMonthYear = (
  value?: string | null,
  locale = "id"
): string => {
  if (!value) return ""
  const parsed = moment.utc(value).locale(locale)
  return parsed.isValid() ? parsed.format("MMM YYYY") : ""
}

export const formatPeriodRange = (
  startDate?: string | null,
  endDate?: string | null,
  locale = "id"
): string => {
  const start = formatMonthYear(startDate, locale)
  const end = endDate
    ? formatMonthYear(endDate, locale)
    : start
      ? locale === "id"
        ? "Sekarang"
        : "Present"
      : ""
  if (start && end) return `${start} — ${end}`
  return start || end
}

export const projectToFormValues = (project: AdminProject): ProjectFormData => {
  const id = project.translations?.id ?? {}
  const en = project.translations?.en ?? {}

  return {
    slug: project.slug,
    image: project.image ?? "",
    demoUrl: project.demo_url ?? "",
    repositoryUrl: project.repository_url ?? "",
    featured: project.featured ? "ya" : "tidak",
    technologies: toLines(project.technologies ?? []),
    tagline: project.tagline ?? "",
    role: project.role ?? "",
    startDate: timestampToMonthInput(project.start_date),
    endDate: timestampToMonthInput(project.end_date),
    context: project.context ?? "",
    title: project.title ?? "",
    idDescription: id.description ?? "",
    idProblem: id.problem ?? "",
    idHighlights: toLines(id.highlights ?? []),
    idMetrics: (id.metrics ?? []).map((m) => ({
      label: m.label ?? "",
      value: m.value ?? "",
    })),
    idDecisions: (id.decisions ?? []).map((d) => ({
      title: d.title ?? "",
      detail: d.detail ?? "",
    })),
    enDescription: en.description ?? "",
    enProblem: en.problem ?? "",
    enHighlights: toLines(en.highlights ?? []),
    enMetrics: (en.metrics ?? []).map((m) => ({
      label: m.label ?? "",
      value: m.value ?? "",
    })),
    enDecisions: (en.decisions ?? []).map((d) => ({
      title: d.title ?? "",
      detail: d.detail ?? "",
    })),
  }
}

export const projectFormToPayload = (values: ProjectFormData, slug: string) => {
  const cleanMetrics = (items: MetricItem[] = []) =>
    items
      .map((item) => ({
        label: (item.label ?? "").trim(),
        value: (item.value ?? "").trim(),
      }))
      .filter((item) => item.label && item.value)

  const cleanDecisions = (items: DecisionItem[] = []) =>
    items
      .map((item) => ({
        title: (item.title ?? "").trim(),
        detail: (item.detail ?? "").trim(),
      }))
      .filter((item) => item.title)

  const translation = (prefix: "id" | "en") => ({
    description: values[`${prefix}Description`].trim(),
    problem: values[`${prefix}Problem`].trim(),
    highlights: fromLines(values[`${prefix}Highlights`]),
    metrics: cleanMetrics(values[`${prefix}Metrics`]),
    decisions: cleanDecisions(values[`${prefix}Decisions`]),
  })

  return {
    slug,
    image: values.image.trim(),
    demo_url: values.demoUrl.trim() || null,
    repository_url: values.repositoryUrl.trim() || null,
    featured: values.featured === "ya",
    title: values.title.trim(),
    tagline: values.tagline.trim(),
    role: values.role.trim(),
    start_date: monthInputToTimestamp(values.startDate),
    end_date: monthInputToTimestamp(values.endDate),
    context: values.context.trim(),
    technologies: fromLines(values.technologies),
    translations: {
      id: translation("id"),
      en: translation("en"),
    },
  }
}
