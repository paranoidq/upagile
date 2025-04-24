import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { http } from '@/lib/axios'
import { createRequestConfig } from '@/lib/types'
import { CreateSprintSchema, Sprint, sprintSchema, updateSprintSchema } from '../types'

// 获取sprints
export const listSprints = async (teamId?: string): Promise<Sprint[]> => {
  const response = await http.post('/sprints', teamId ? { teamId } : undefined)
  if (!response) {
    return []
  }

  return z.array(sprintSchema).parse(response)
}

export const useSprints = (teamId?: string) => {
  return useQuery({
    queryKey: ['sprints', teamId],
    queryFn: () => listSprints(teamId),
    enabled: useAuthStore.getState().auth.user !== null,
  })
}

// 删除sprints
export const deleteSprints = async ({ ids }: { ids: number[] }): Promise<void> => {
  await http.post('/sprints/delete', { ids })
}

export const useDeleteSprints = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSprints,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] })
    },
  })
}

// 新增sprint
export const createSprint = async (sprint: Omit<CreateSprintSchema, 'id'>): Promise<void> => {
  await http.post(
    'sprints/create',
    sprint,
    createRequestConfig({
      loadingDelay: 300,
    }),
  )
}

export const useCreateSprint = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSprint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] })
    },
  })
}

// 修改sprint
export const updateSprint = async (sprint: z.infer<typeof updateSprintSchema>): Promise<void> => {
  await http.post(
    'sprints/update',
    sprint,
    createRequestConfig({
      loadingDelay: 300,
    }),
  )
}

export const useUpdateSprint = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSprint,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] })
    },
  })
}

// 批量修改sprint
export const batchUpdateSprints = async ({
  ids,
  status,
}: {
  ids: number[]
  status: Sprint['status']
}): Promise<void> => {
  await http.post('sprints/update/batch', { ids, status })
}

export const useUpdateSprints = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: batchUpdateSprints,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sprints'] })
    },
  })
}

// 获取sprint
export const getSprint = async (sprintId: string | undefined, withIssues = false): Promise<Sprint | null> => {
  if (!sprintId) {
    return null
  }

  const response = await http.post(`/sprints/get`, { id: sprintId, withIssues })
  return sprintSchema.parse(response)
}

export const useSprint = (sprintId: string | undefined, withIssues = false) => {
  return useQuery({
    queryKey: ['sprints', sprintId, withIssues],
    queryFn: () => getSprint(sprintId, withIssues),
    enabled: !!sprintId,
  })
}
