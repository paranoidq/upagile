import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'
import { QueryKeys } from '@/utils/query-keys'
import { views } from '../data/data'

const ViewSchema = z.object({
  id: z.number(),
  name: z.string(),
})

export type TypeView = z.infer<typeof ViewSchema>

const getViews = async (): Promise<TypeView[]> => {
  // const response = await http.get('/views')
  const response = views
  if (!response) {
    return []
  }

  return z.array(ViewSchema).parse(response)
}

export const useViews = () => {
  return useQuery({
    queryKey: QueryKeys.view,
    queryFn: getViews,
  })
}
