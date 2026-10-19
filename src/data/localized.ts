import type { Locale } from "@/i18n/config"
import type { Project } from "./projects"
import type { Experience, SkillGroup } from "./profile"
import { experiences as experiencesBase } from "./experiences"
import { experiences as experiencesId } from "./experiences.id"
import { experiences as experiencesEn } from "./experiences.en"
import { projects as projectsId } from "./projects.id"
import { projects as projectsEn } from "./projects.en"
import { skillGroups as skillGroupsId } from "./skillGroups.id"
import { skillGroups as skillGroupsEn } from "./skillGroups.en"
import { awards as awardsId } from "./awards.id"
import { awards as awardsEn } from "./awards.en"
import type { AwardItem } from "./profile"
import { format, isValid } from "date-fns"
import { id as idLocale } from "date-fns/locale"

const pick = <T>(locale: string, id: T, en: T): T => (locale === "en" ? en : id)

const bySlug = <T extends { slug: string }>(items: T[]): Record<string, T> =>
  Object.fromEntries(items.map((item) => [item.slug, item])) as Record<
    string,
    T
  >

const monthYear = (value: string, locale: string) => {
  const date = new Date(value)
  if (!isValid(date)) return null
  return format(date, "MMMM yyyy", {
    locale: locale === "en" ? undefined : idLocale,
  })
}

const periodLabel = (
  startDate: string,
  endDate: string | null,
  locale: string
) => {
  const start = monthYear(startDate, locale)
  const end = endDate
    ? monthYear(endDate, locale)
    : locale === "en"
      ? "Present"
      : "Sekarang"
  return start ? `${start} — ${end}` : ""
}

const baseBySlug = bySlug(experiencesBase)

export const getExperiences = (locale: string): Experience[] => {
  const localeData = [...pick(locale, experiencesId, experiencesEn)].sort(
    (a, b) => {
      const aStart = baseBySlug[a.slug]?.startDate ?? ""
      const bStart = baseBySlug[b.slug]?.startDate ?? ""
      if (!aStart) return bStart ? 1 : 0
      if (!bStart) return -1
      return bStart.localeCompare(aStart)
    }
  )

  return localeData.map((item) => {
    const base = baseBySlug[item.slug]
    return {
      slug: item.slug,
      period: base ? periodLabel(base.startDate, base.endDate, locale) : "",
      role: item.role,
      org: base?.org ?? "",
      context: item.context,
      points: item.points,
      stack: base?.stacks ?? [],
    }
  })
}

export const getProjects = (locale: string): Project[] =>
  pick(locale, projectsId, projectsEn)

export const getSkillGroups = (locale: string): SkillGroup[] =>
  pick(locale, skillGroupsId, skillGroupsEn)

export const getAwards = (locale: string): AwardItem[] =>
  pick(locale, awardsId, awardsEn)

export const isLocale = (value: string): value is Locale =>
  value === "id" || value === "en"

export const projectSlugs: string[] = projectsId.map((p) => p.slug)

export const getProject = (locale: string, slug: string): Project | undefined =>
  getProjects(locale).find((p) => p.slug === slug)
