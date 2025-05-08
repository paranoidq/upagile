import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { http } from '@/lib/axios'
import { applicationSchema } from '../types'

const getApplications = async (teamId?: string) => {
  const response = await http.post('/applications', { teamId })
  if (!response) {
    return []
  }

  console.log(response)

  const parsedApplications = z.array(applicationSchema).parse(response)
  return parsedApplications
}

export const useApplications = (teamId?: string) => {
  return useQuery({
    queryKey: ['applications', teamId],
    queryFn: () => getApplications(teamId),
  })
}
