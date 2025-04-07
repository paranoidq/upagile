import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { toast } from '@/hooks/use-toast'
import { CreateTeamType, teamSchema, TeamType } from '../types'

export type Team = {
  id: string
  name: string
}

const listMyTeams = async (): Promise<TeamType[]> => {
  const response = await http.post('/teams/my')
  if (!response) {
    return []
  }

  return z.array(teamSchema).parse(response)
}

const createTeam = async (team: CreateTeamType) => {
  const response = await http.post('/teams/save', team)
  if (!response) {
    return null
  }
}

export const checkTeamNameExisted = async (name: string): Promise<boolean> => {
  const response = await http.post('/teams/check', { name })
  if (!response) {
    return false
  }
  return response as unknown as boolean
}

export const useListMyTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: listMyTeams,
  })
}

export const useCreateTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      toast({
        title: '团队创建成功',
      })
    },
  })
}

export const useCheckTeamName = (name: string) => {
  return useQuery({
    queryKey: ['teams', 'check-name', name],
    queryFn: () => checkTeamNameNotExisted(name),
    enabled: !!name, // 当 name 存在时，才执行查询
    select: (data) => !!data, // 将查询结果转换为布尔值
  })
}
