import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { views } from '../../data/data'
import { View } from '../views/types'

const QueryKeys = {
  views: ['views'] as const,
} as const

const fetchViews = async (): Promise<View[]> => {
  // const response = await http.post('/views')
  // if (!response) {
  //   return views
  // }

  // return z.array(viewSchema).parse(response)

  return views
}
export const useViews = () => {
  return useQuery({
    queryKey: QueryKeys.views,
    queryFn: fetchViews,
  })
}

export const createView = async (view: Omit<View, 'id'>): Promise<void> => {
  await http.post('views/create', view)
}

export const useCreateView = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createView'],
    mutationFn: createView,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.views })
    },
  })
}

const updateView = async (view: View): Promise<void> => {
  console.log(view)
  await http.post('views/update', view)
}
export const useUpdateView = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['updateView'],
    mutationFn: updateView,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.views })
    },
  })
}

const deleteView = async (id: number): Promise<void> => {
  await http.post('views/delete', { id })
}
export const useDeleteView = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['deleteView'],
    mutationFn: deleteView,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.views })
    },
  })
}
