import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'

const BacklogSchema = z.object({
  id: z.number(),
  title: z.string(),
  authorInfo: z.object({
    name: z.string(),
    age: z.number(),
  }),
})

export type Backlog = z.infer<typeof BacklogSchema>

const fetchBacklogData = async (): Promise<Backlog[]> => {
  const response = await http.get('/backlogs')
  if (!response) {
    return []
  }
  return z.array(BacklogSchema).parse(response || [])
}
const addBacklog = async (backlog: Omit<Backlog, 'id'>): Promise<Backlog> => {
  const response = await http.post('/backlogs', {
    ...backlog,
  })
  return response.data
}

export const useBacklogs = () => {
  return useQuery<Backlog[]>({
    queryKey: ['queryBacklogs'],
    queryFn: fetchBacklogData,
  })
}

export const useAddBacklog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addBacklog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queryBacklogs'] })
    },
  })
}

// delete po
