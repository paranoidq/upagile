import { z } from 'zod'

export const applicationSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  level: z.number(),
  abbr: z.string(),
  team: z.object({
    id: z.string(),
    name: z.string().optional(),
  }),
})
