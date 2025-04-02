import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { http } from '@/lib/axios'
import { Release, ReleaseSchema } from '../types'

// 获取releases
export const listReleases = async (): Promise<Release[]> => {
  const response = await http.post('/releases')
  if (!response) {
    return []
  }

  return z.array(ReleaseSchema).parse(response)
}

export const useReleases = () => {
  return useQuery({
    queryKey: ['releases'],
    queryFn: () => listReleases(),
    enabled: useAuthStore.getState().auth.user !== null,
  })
}

// 删除releases
export const deleteReleases = async ({ ids }: { ids: number[] }): Promise<void> => {
  await http.post('/releases/delete', { ids })
}

export const useDeleteReleases = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteReleases,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] })
    },
  })
}

// 新增release
export const createRelease = async (release: Omit<Release, 'id'>): Promise<void> => {
  await http.post('releases/create', release)
}

export const useCreateRelease = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRelease,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] })
    },
  })
}

// 修改release
export const updateRelease = async (release: Release): Promise<void> => {
  await http.post('releases/update', release)
}

export const useUpdateRelease = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateRelease,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] })
    },
  })
}

// 批量修改release
export const batchUpdateReleases = async ({
  ids,
  status,
}: {
  ids: number[]
  status: Release['status']
}): Promise<void> => {
  await http.post('releases/update/batch', { ids, status })
}

export const useUpdateReleases = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: batchUpdateReleases,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['releases'] })
    },
  })
}
