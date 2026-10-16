import type { AdminProject } from "../table/columns"

export type ProjectFormData = {
  slug: string
  image: string
  demoUrl: string
  repositoryUrl: string
  featured: string
  sortOrder: number
  technologies: string
  idTitle: string
  idTagline: string
  idDescription: string
  idProblem: string
  idRole: string
  idPeriod: string
  idContext: string
  idHighlights: string
  idMetrics: string
  idDecisions: string
  enTitle: string
  enTagline: string
  enDescription: string
  enProblem: string
  enRole: string
  enPeriod: string
  enContext: string
  enHighlights: string
  enMetrics: string
  enDecisions: string
}

export const projectDefaultValues: ProjectFormData = {
  slug: "",
  image: "",
  demoUrl: "",
  repositoryUrl: "",
  featured: "tidak",
  sortOrder: 0,
  technologies: "",
  idTitle: "",
  idTagline: "",
  idDescription: "",
  idProblem: "",
  idRole: "",
  idPeriod: "",
  idContext: "",
  idHighlights: "",
  idMetrics: "",
  idDecisions: "",
  enTitle: "",
  enTagline: "",
  enDescription: "",
  enProblem: "",
  enRole: "",
  enPeriod: "",
  enContext: "",
  enHighlights: "",
  enMetrics: "",
  enDecisions: "",
}

export const toLines = (items: string[]): string => items.join("\n")

export const fromLines = (value: string): string[] =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

export const pairsToLines = (
  items: { label: string; value: string }[] | { title: string; detail: string }[],
  firstKey: string,
  secondKey: string
): string =>
  items
    .map(
      (item) =>
        `${(item as Record<string, string>)[firstKey] ?? ""} | ${(item as Record<string, string>)[secondKey] ?? ""}`
    )
    .join("\n")

export const fromPairLines = (
  value: string,
  firstKey: string,
  secondKey: string
): Record<string, string>[] =>
  fromLines(value)
    .map((line) => {
      const separatorIndex = line.indexOf("|")
      if (separatorIndex === -1) {
        return { [firstKey]: line.trim(), [secondKey]: "" }
      }
      return {
        [firstKey]: line.slice(0, separatorIndex).trim(),
        [secondKey]: line.slice(separatorIndex + 1).trim(),
      }
    })
    .filter((item) => item[firstKey])

export const projectToFormValues = (project: AdminProject): ProjectFormData => {
  const id = project.translations?.id ?? {}
  const en = project.translations?.en ?? {}

  return {
    slug: project.slug,
    image: project.image ?? "",
    demoUrl: project.demo_url ?? "",
    repositoryUrl: project.repository_url ?? "",
    featured: project.featured ? "ya" : "tidak",
    sortOrder: project.sort_order ?? 0,
    technologies: toLines(project.technologies ?? []),
    idTitle: id.title ?? "",
    idTagline: id.tagline ?? "",
    idDescription: id.description ?? "",
    idProblem: id.problem ?? "",
    idRole: id.role ?? "",
    idPeriod: id.period ?? "",
    idContext: id.context ?? "",
    idHighlights: toLines(id.highlights ?? []),
    idMetrics: pairsToLines(id.metrics ?? [], "label", "value"),
    idDecisions: pairsToLines(id.decisions ?? [], "title", "detail"),
    enTitle: en.title ?? "",
    enTagline: en.tagline ?? "",
    enDescription: en.description ?? "",
    enProblem: en.problem ?? "",
    enRole: en.role ?? "",
    enPeriod: en.period ?? "",
    enContext: en.context ?? "",
    enHighlights: toLines(en.highlights ?? []),
    enMetrics: pairsToLines(en.metrics ?? [], "label", "value"),
    enDecisions: pairsToLines(en.decisions ?? [], "title", "detail"),
  }
}

export const projectFormToPayload = (values: ProjectFormData, slug: string) => {
  const translation = (prefix: "id" | "en") => ({
    title: values[`${prefix}Title`].trim(),
    tagline: values[`${prefix}Tagline`].trim(),
    description: values[`${prefix}Description`].trim(),
    problem: values[`${prefix}Problem`].trim(),
    role: values[`${prefix}Role`].trim(),
    period: values[`${prefix}Period`].trim(),
    context: values[`${prefix}Context`].trim(),
    highlights: fromLines(values[`${prefix}Highlights`]),
    metrics: fromPairLines(values[`${prefix}Metrics`], "label", "value").filter(
      (metric) => metric.label && metric.value
    ),
    decisions: fromPairLines(values[`${prefix}Decisions`], "title", "detail"),
  })

  return {
    slug,
    image: values.image.trim(),
    demo_url: values.demoUrl.trim() || null,
    repository_url: values.repositoryUrl.trim() || null,
    featured: values.featured === "ya",
    sort_order: Number(values.sortOrder) || 0,
    technologies: fromLines(values.technologies),
    translations: {
      id: translation("id"),
      en: translation("en"),
    },
  }
}
