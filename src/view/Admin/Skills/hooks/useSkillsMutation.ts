"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAdminSkills } from "../store"

export const ADMIN_SKILLS_KEY = ["admin", "skills"]

const invalidateSkillQueries = (
  queryClient: ReturnType<typeof useQueryClient>
) => {
  queryClient.invalidateQueries({ queryKey: ADMIN_SKILLS_KEY })
  queryClient.invalidateQueries({ queryKey: ["skills"] })
}

export const useCreateSkillGroup = () => {
  const { createSkillGroup } = useAdminSkills()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: unknown) => createSkillGroup(body),
    onSuccess: () => invalidateSkillQueries(queryClient),
  })
}

export const useUpdateSkillGroup = () => {
  const { updateSkillGroup } = useAdminSkills()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, body }: { slug: string; body: unknown }) =>
      updateSkillGroup(slug, body),
    onSuccess: () => invalidateSkillQueries(queryClient),
  })
}

export const useDeleteSkillGroup = () => {
  const { deleteSkillGroup } = useAdminSkills()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => deleteSkillGroup(slug),
    onSuccess: () => invalidateSkillQueries(queryClient),
  })
}
