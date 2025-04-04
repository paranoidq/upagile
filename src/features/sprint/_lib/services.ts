import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { http } from '@/lib/axios'
import { Sprint, SprintSchema } from '../types'

// 获取sprints
export const listSprints = async (): Promise<Sprint[]> => {
  const response = await http.post('/sprints')
  if (!response) {
    return []
  }

  return z.array(SprintSchema).parse(response)
}

export const useSprints = () => {
  return useQuery({
    queryKey: ['sprints'],
    queryFn: () => listSprints(),
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
export const createSprint = async (sprint: Omit<Sprint, 'id'>): Promise<void> => {
  await http.post('sprints/create', sprint)
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
export const updateSprint = async (sprint: Sprint): Promise<void> => {
  await http.post('sprints/update', sprint)
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
