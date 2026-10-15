"use client"

import { useQuery } from "@tanstack/react-query"
import { useProjectStore } from "@/view/Project/store"

export const projectKeys = {
  all: ["projects"] as const,
  list: (locale: string) => ["projects", locale] as const,
  detail: (locale: string, slug: string) => ["projects", locale, slug] as const,
}

/**
 * React Query yang "menembak" fungsi zustand store.
 * queryFn = action fetchProjects dari useProjectStore,
 * jadi cache server (React Query) + cache client (zustand) terisi sekaligus.
 */
export const useProjectsQuery = (locale: string) => {
  const fetchProjects = useProjectStore((s) => s.fetchProjects)

  return useQuery({
    queryKey: projectKeys.list(locale),
    queryFn: () => fetchProjects(locale),
    staleTime: 60 * 1000,
    retry: 1,
  })
}

/** Detail 1 project by slug (cache list dipakai dulu bila ada). */
export const useProjectQuery = (locale: string, slug: string) => {
  const fetchProject = useProjectStore((s) => s.fetchProject)

  return useQuery({
    queryKey: projectKeys.detail(locale, slug),
    queryFn: () => fetchProject(locale, slug),
    staleTime: 60 * 1000,
    retry: 1,
  })
}
