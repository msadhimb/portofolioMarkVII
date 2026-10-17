"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAwards } from "@/components/Awards/store"

export const ADMIN_AWARDS_KEY = ["admin", "awards"]

const invalidateAwardQueries = (queryClient: ReturnType<typeof useQueryClient>) => {
  queryClient.invalidateQueries({ queryKey: ADMIN_AWARDS_KEY })
  queryClient.invalidateQueries({ queryKey: ["awards"] })
}

export const useCreateAward = () => {
  const { createAward } = useAwards()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: unknown) => createAward(body),
    onSuccess: () => invalidateAwardQueries(queryClient),
  })
}

export const useUpdateAward = () => {
  const { updateAward } = useAwards()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, body }: { slug: string; body: unknown }) =>
      updateAward(slug, body),
    onSuccess: () => invalidateAwardQueries(queryClient),
  })
}

export const useDeleteAward = () => {
  const { deleteAward } = useAwards()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => deleteAward(slug),
    onSuccess: () => invalidateAwardQueries(queryClient),
  })
}
