import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/authStore'
import { http } from '@/lib/axios'
import { createRequestConfig } from '@/lib/types'
import { CreateIssueSchema, Issue, IssueSchema, updateIssueSchema } from '../types'

// 获取issues
export const listIssues = async (teamId?: string): Promise<Issue[]> => {
  const response = await http.post('/issues', { teamId })
  if (!response) {
    return []
  }

  const parsedIssues = z.array(IssueSchema).parse(response)
  return parsedIssues as Issue[]
}

export const useIssues = (teamId?: string) => {
  return useQuery({
    queryKey: ['issues', teamId],
    queryFn: () => listIssues(teamId),
    enabled: useAuthStore.getState().auth.user !== null,
  })
}

// 删除issue
export const deleteIssues = async ({ ids }: { ids: number[] }): Promise<void> => {
  await http.post('/issues/delete', { ids })
}
export const useDeleteIssues = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteIssues,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
    },
  })
}

// 新增issue
export const createIssue = async (issue: CreateIssueSchema): Promise<void> => {
  await http.post(
    'issues/create',
    issue,
    createRequestConfig({
      loadingDelay: 500,
    }),
  )
}

export const useCreateIssue = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] })
      queryClient.invalidateQueries({ queryKey: ['sprints'] })
    },
  })
}

// 修改issue
export const updateIssue = async (issue: z.infer<typeof updateIssueSchema>): Promise<void> => {
  await http.post(
    'issues/update',
    issue,
    createRequestConfig({
      loadingDelay: 200,
    }),
  )
}

export const useUpdateIssue = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['issues'],
      })
      queryClient.invalidateQueries({
        queryKey: ['sprints'],
      })
    },
  })
}

// 批量修改issue
export const bacthUpdateIssue = async ({
  ids,
  priority,
  status,
  type,
}: {
  ids: number[]
  priority: Issue['priority']
  status: Issue['status']
  type: Issue['type']
}): Promise<void> => {
  await http.post('issues/update/batch', { ids, priority, status, type })
}

export const useBatchUpdateIssue = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: bacthUpdateIssue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues', 'sprints'] })
    },
  })
}
