import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { createRequestConfig } from '@/lib/types'
import { CreateTeamType, teamSchema, TeamType, UpdateTeamType } from '../types'

// 查询我的团队
const listMyTeams = async (): Promise<TeamType[]> => {
  const response = await http.post('/teams/my')
  if (!response) {
    return []
  }

  return z.array(teamSchema).parse(response)
}
export const useListMyTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: listMyTeams,
  })
}

// 创建团队
const createTeam = async (team: CreateTeamType) => {
  const response = await http.post(
    '/teams/save',
    team,
    createRequestConfig({
      loadingDelay: 300,
    }),
  )
  if (!response) {
    return null
  }
}
export const useCreateTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

// 更新团队
const updateTeam = async (team: UpdateTeamType) => {
  const response = await http.post(
    '/teams/save',
    team,
    createRequestConfig({
      loadingDelay: 300,
    }),
  )
  if (!response) {
    return null
  }
}
export const useUpdateTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
  })
}

// 检查团队名称是否存在
export const checkTeamNameExisted = async (name: string): Promise<boolean> => {
  const response = await http.post('/teams/check', { name })
  if (!response) {
    return false
  }
  return response as unknown as boolean
}
export const useCheckTeamName = (name: string) => {
  return useQuery({
    queryKey: ['teams', 'check-name', name],
    queryFn: () => checkTeamNameNotExisted(name),
    enabled: !!name, // 当 name 存在时，才执行查询
    select: (data) => !!data, // 将查询结果转换为布尔值
  })
}

// 获取团队详情
const getTeamMembers = async (id: string): Promise<TeamType | undefined> => {
  const response = await http.get(`/teams/${id}`)
  if (!response) {
    return undefined
  }
  return teamSchema.parse(response)
}
export const useGetTeamMembers = (id: string) => {
  return useQuery({
    queryKey: ['teams', 'members', id],
    queryFn: () => getTeamMembers(id),
  })
}
