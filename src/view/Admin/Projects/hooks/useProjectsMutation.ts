"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useProjects } from "@/components/Projects/store"

export const ADMIN_PROJECTS_KEY = ["admin", "projects"]

const invalidateProjectQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ADMIN_PROJECTS_KEY })
  queryClient.invalidateQueries({ queryKey: ["projects"] })
}

export const useCreateProject = () => {
  const { createProject } = useProjects()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: unknown) => createProject(body),
    onSuccess: () => invalidateProjectQueries(queryClient),
  })
}

export const useUpdateProject = () => {
  const { updateProject } = useProjects()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, body }: { slug: string; body: unknown }) =>
      updateProject(slug, body),
    onSuccess: () => invalidateProjectQueries(queryClient),
  })
}

export const useDeleteProject = () => {
  const { deleteProject } = useProjects()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => deleteProject(slug),
    onSuccess: () => invalidateProjectQueries(queryClient),
  })
}
