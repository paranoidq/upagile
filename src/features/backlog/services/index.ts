import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { http } from '@/lib/axios'
import { Backlog, BacklogSchema } from '../types'

// 获取backlogs
const listBacklogs = async (): Promise<Backlog[]> => {
  const response = await http.post('/backlogs')
  if (!response) {
    return []
  }

  return z.array(BacklogSchema).parse(response)
}

// 删除backlog
export const deleteBacklog = async (id: number): Promise<void> => {
  await http.post('/backlogs/delete', { id })
}

// 新增backlog
export const createBacklog = async (backlog: Omit<Backlog, 'id'>): Promise<void> => {
  await http.post('backlogs/create', backlog)
}

// 修改backlog
export const updateBacklog = async (backlog: Backlog): Promise<void> => {
  await http.post('backlogs/update', backlog)
}

export const useBacklogs = () => {
  return useQuery({
    queryKey: ['backlogs'],
    queryFn: () => listBacklogs(),
    enabled: useAuthStore.getState().auth.user !== null,
  })
}

export const useCreateBacklog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBacklog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backlogs'] })
    },
  })
}

export const useUpdateBacklog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateBacklog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backlogs'] })
    },
  })
}

export const useDeleteBacklog = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteBacklog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backlogs'] })
    },
  })
}
