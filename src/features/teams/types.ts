import { z } from 'zod'

export const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  owner: z.object({
    id: z.string(),
    username: z.string(),
  }),
  createdTime: z.string().optional(),
  modifiedTime: z.string().optional(),
})

export type TeamType = z.infer<typeof teamSchema>
