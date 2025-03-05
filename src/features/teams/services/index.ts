import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { teamSchema, TeamType } from '../types'

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

export const useListMyTeams = () => {
  return useQuery({
    queryKey: ['teams'],
    queryFn: listMyTeams,
  })
}
