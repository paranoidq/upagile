import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { backlogSchema, BacklogType } from '../types'

// 获取backlogs
const listBacklogs = async (): Promise<BacklogType[]> => {
  const response = await http.post('/backlogs')
  if (!response) {
    return []
  }

  return z.array(backlogSchema).parse(response)
}

// 删除backlog
export const deleteBacklog = async (id: number): Promise<void> => {
  await http.post('/backlogs/delete', { id })
}

// 新增backlog
export const createBacklog = async (backlog: Omit<BacklogType, 'id'>): Promise<void> => {
  await http.post('backlogs/create', backlog)
}

// 修改backlog
export const updateBacklog = async (backlog: BacklogType): Promise<void> => {
  await http.post('backlogs/update', backlog)
}

export const useBacklogs = () => {
  return useQuery({
    queryKey: ['backlogs'],
    queryFn: listBacklogs,
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
