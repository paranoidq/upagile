import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { QueryKeys } from '@/utils/query-keys'
import { views } from '../data/data'

export const ViewSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['task', 'backlog', 'feature', 'release']),
  conditions: z
    .object({
      filters: z
        .array(
          z.object({
            field: z.string(),
            operator: z.string(),
            value: z.string(),
          }),
        )
        .optional(),
      sorts: z
        .array(
          z.object({
            field: z.string(),
            order: z.string(),
          }),
        )
        .optional(),
      groups: z
        .array(
          z.object({
            field: z.string(),
            order: z.string(),
          }),
        )
        .optional(),
    })
    .optional(),
})

export type ViewType = z.infer<typeof ViewSchema>

const fetchViews = async (): Promise<ViewType[]> => {
  // const response = await http.get('/views')
  const response = views
  if (!response) {
    return []
  }

  return z.array(ViewSchema).parse(response)
}
export const useViews = () => {
  return useQuery({
    queryKey: QueryKeys.view,
    queryFn: fetchViews,
  })
}

const createView = async (view: Omit<ViewType, 'id'>): Promise<void> => {
  await http.post('views/create', view)
}
export const useCreateView = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: QueryKeys.view,
    mutationFn: createView,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.view })
    },
  })
}

const updateViewName = async (view: Omit<ViewType, 'conditions'>): Promise<void> => {
  await http.post('views/update', view)
}
export const useRenameView = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: QueryKeys.view,
    mutationFn: updateViewName,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.view })
    },
  })
}

const updateViewCondition = async (view: ViewType): Promise<void> => {
  await http.post('views/condition/update', view)
}
export const useUpdateViewCondition = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: QueryKeys.view,
    mutationFn: updateViewCondition,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.view })
    },
  })
}
