export interface ProjectStore {
  getProjects: (lang: string) => Promise<any>
}
