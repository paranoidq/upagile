import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'

const BacklogSchema = z.object({
  id: z.number(),
  desc: z.string(),
  status: z.number(),
  priority: z.number(),
  category: z.number(),
  crtUsr: z.string(),
  updUsr: z.string(),
  crtTime: z.string(),
  updTime: z.string(),
})

export type Backlog = z.infer<typeof BacklogSchema>

// 获取backlogs
const getBacklogs = async (): Promise<Backlog[]> => {
  const response = await http.get('/backlogs')
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
export const createBacklog = async (
  backlog: Omit<Backlog, 'id'>,
): Promise<void> => {
  await http.post('backlogs/create', backlog)
}

// 修改backlog
export const updateBacklog = async (backlog: Backlog): Promise<void> => {
  await http.post('backlogs/update', backlog)
}

export const useBacklogs = () => {
  return useQuery({
    queryKey: ['backlogs'],
    queryFn: getBacklogs,
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
