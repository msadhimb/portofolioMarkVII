export interface ExperienceStore {
  getExperiences: (lang: string) => Promise<any>
  getExperienceBySlug: (slug: string, lang: string) => Promise<any>
}
