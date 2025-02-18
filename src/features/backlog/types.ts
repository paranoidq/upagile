import { z } from 'zod'

export const backlogSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string().optional(),
  label: z.string().optional(),
  priority: z.string().optional(),
})
export type BacklogType = z.infer<typeof backlogSchema>
