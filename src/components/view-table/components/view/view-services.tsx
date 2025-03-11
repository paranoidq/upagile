import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { QueryKeys } from '@/utils/query-keys'
import { View, ViewSchema } from '@/components/view-table/types.ts'

const fetchViews = async (): Promise<View[]> => {
  // const response = await http.post('/views')
  // if (!response) {
  return [
    {
      id: 1,
      name: '默认视图',
      type: 'task',
      conditions: { filters: [], sorts: [], groups: [] },
    },
  ]
  // }

  return z.array(ViewSchema).parse(response)
}
export const useViews = () => {
  return useQuery({
    queryKey: QueryKeys.view,
    queryFn: fetchViews,
  })
}

const createView = async (view: Omit<View, 'id'>): Promise<void> => {
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

const updateViewName = async (view: Partial<View>): Promise<void> => {
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

const updateViewCondition = async (view: View): Promise<void> => {
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

const deleteView = async (id: number): Promise<void> => {
  await http.post('views/delete', { id })
}
export const useDeleteView = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: QueryKeys.view,
    mutationFn: deleteView,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.view })
    },
  })
}
