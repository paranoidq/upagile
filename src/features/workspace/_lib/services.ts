import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { createRequestConfig } from '@/lib/types'
import { CreateTeamType, teamSchema, TeamType, UpdateTeamType, userSchema, UserType } from '../types'

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
      loadingDelay: 500,
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
      loadingDelay: 500,
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

// 获取团队成员
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

// 获取所有人员
const listUsers = async (): Promise<UserType[]> => {
  const response = await http.post('/accounts')
  if (!response) {
    return []
  }
  return z.array(userSchema).parse(response)
}
export const useListUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: listUsers,
  })
}

// 新增团队成员
const addMember = async ({ id, memberIds }: { id: string; memberIds: string[] }) => {
  const response = await http.post(
    `/teams/add-members`,
    { id, memberIds },
    createRequestConfig({
      loadingDelay: 500,
    }),
  )
  if (!response) {
    return null
  }
}
export const useAddMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', 'members'] })
    },
  })
}
