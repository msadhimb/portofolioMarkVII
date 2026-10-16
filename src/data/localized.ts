import type { Locale } from "@/i18n/config"
import type { Project } from "./projects"
import type { Experience, SkillGroup } from "./profile"
import { projects as projectsId } from "./projects.id"
import { projects as projectsEn } from "./projects.en"
import { experiences as experiencesId } from "./experiences.id"
import { experiences as experiencesEn } from "./experiences.en"
import { skillGroups as skillGroupsId } from "./skillGroups.id"
import { skillGroups as skillGroupsEn } from "./skillGroups.en"
import { principles as principlesId } from "./principles.id"
import { principles as principlesEn } from "./principles.en"
import { awards as awardsId } from "./awards.id"
import { awards as awardsEn } from "./awards.en"
import type { AwardItem } from "./profile"

export type Principle = {
  title: string
  note: string
}

const pick = <T>(locale: string, id: T, en: T): T => (locale === "en" ? en : id)

export const getProjects = (locale: string): Project[] =>
  pick(locale, projectsId, projectsEn)

export const getExperiences = (locale: string): Experience[] =>
  pick(locale, experiencesId, experiencesEn)

export const getSkillGroups = (locale: string): SkillGroup[] =>
  pick(locale, skillGroupsId, skillGroupsEn)

export const getPrinciples = (locale: string): Principle[] =>
  pick(locale, principlesId as Principle[], principlesEn as Principle[])

export const getAwards = (locale: string): AwardItem[] =>
  pick(locale, awardsId, awardsEn)

export const isLocale = (value: string): value is Locale =>
  value === "id" || value === "en"

export const projectSlugs: string[] = projectsId.map((p) => p.slug)

export const getProject = (locale: string, slug: string): Project | undefined =>
  getProjects(locale).find((p) => p.slug === slug)
