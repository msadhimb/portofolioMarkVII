"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAdminExperiences } from "../store"

export const ADMIN_EXPERIENCES_KEY = ["admin", "experiences"]

const invalidateExperienceQueries = (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  queryClient.invalidateQueries({ queryKey: ADMIN_EXPERIENCES_KEY })
  queryClient.invalidateQueries({ queryKey: ["experiences"] })
}

export const useCreateExperience = () => {
  const { createExperience } = useAdminExperiences()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: unknown) => createExperience(body),
    onSuccess: () => invalidateExperienceQueries(queryClient),
  })
}

export const useUpdateExperience = () => {
  const { updateExperience } = useAdminExperiences()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, body }: { slug: string; body: unknown }) =>
      updateExperience(slug, body),
    onSuccess: () => invalidateExperienceQueries(queryClient),
  })
}

export const useDeleteExperience = () => {
  const { deleteExperience } = useAdminExperiences()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => deleteExperience(slug),
    onSuccess: () => invalidateExperienceQueries(queryClient),
  })
}
