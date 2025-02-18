import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { QueryKeys } from '@/utils/query-keys'
import { views } from '@/components/view-table/components/view/data.tsx'
import { viewSchema, ViewType } from '@/components/view-table/types.ts'

const fetchViews = async (): Promise<ViewType[]> => {
  // const response = await http.get('/views')
  const response = views
  if (!response) {
    return []
  }

  return z.array(viewSchema).parse(response)
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

const updateViewName = async (view: Partial<ViewType>): Promise<void> => {
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
