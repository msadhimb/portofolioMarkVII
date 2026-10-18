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

export const parsePeriodToDates = (
  period?: string | null
): { startDate: string; endDate: string } => {
  if (!period || !period.trim()) return { startDate: "", endDate: "" }

  const clean = period.trim()
  const parts = clean.split(/\s*(?:—|--|-|s\/d|to)\s*/i)

  const parsePart = (str?: string): string => {
    if (!str || !str.trim()) return ""
    const s = str.trim().toLowerCase()
    if (s === "sekarang" || s === "present" || s === "current") return ""

    const formats = [
      "YYYY-MM-DD",
      "YYYY-MM",
      "MMM YYYY",
      "MMMM YYYY",
      "YYYY",
      "MMM YY",
      "MMMM",
    ]
    for (const f of formats) {
      const m = moment(str.trim(), f, true)
      if (m.isValid()) {
        return m.date(1).format("YYYY-MM-DD")
      }
    }
    const loose = moment(str.trim())
    if (loose.isValid()) {
      return loose.date(1).format("YYYY-MM-DD")
    }
    return ""
  }

  const startDate = parsePart(parts[0])
  const endDate = parts.length > 1 ? parsePart(parts[1]) : ""

  return { startDate, endDate }
}

export const formatPeriodFromDates = (
  startDate?: string,
  endDate?: string
): string => {
  if (!startDate && !endDate) return ""
  const startMoment = startDate ? moment(startDate) : null
  const endMoment = endDate ? moment(endDate) : null

  const startStr =
    startMoment && startMoment.isValid() ? startMoment.format("MMM YYYY") : ""
  const endStr =
    endMoment && endMoment.isValid()
      ? endMoment.format("MMM YYYY")
      : startDate
        ? "Sekarang"
        : ""

  if (startStr && endStr) return `${startStr} — ${endStr}`
  if (startStr) return `${startStr} — Sekarang`
  return endStr
}

export const projectToFormValues = (project: AdminProject): ProjectFormData => {
  const id = project.translations?.id ?? {}
  const en = project.translations?.en ?? {}

  const rawPeriod = project.period || id.period || en.period || ""
  const { startDate, endDate } =
    project.start_date || project.end_date
      ? {
          startDate: project.start_date ?? "",
          endDate: project.end_date ?? "",
        }
      : parsePeriodToDates(rawPeriod)

  return {
    slug: project.slug,
    image: project.image ?? "",
    demoUrl: project.demo_url ?? "",
    repositoryUrl: project.repository_url ?? "",
    featured: project.featured ? "ya" : "tidak",
    technologies: toLines(project.technologies ?? []),
    tagline: project.tagline || id.tagline || en.tagline || "",
    role: project.role || id.role || en.role || "",
    startDate,
    endDate,
    context: project.context || id.context || en.context || "",
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
  const period = formatPeriodFromDates(values.startDate, values.endDate)

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
    period,
    start_date: values.startDate || null,
    end_date: values.endDate || null,
    context: values.context.trim(),
    technologies: fromLines(values.technologies),
    translations: {
      id: translation("id"),
      en: translation("en"),
    },
  }
}
