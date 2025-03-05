import { z } from 'zod'

export const backlogSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  backlogType: z.string().optional(),
  priority: z.string().optional(),
  dueTime: z.string().optional(),
  estimatedTime: z.number().optional(),
  createdTime: z.string().optional(),
  modifiedTime: z.string().optional(),
})
export type BacklogType = z.infer<typeof backlogSchema>

export const backlogTypes = [
  { label: '缺陷', value: 'BUG' },
  { label: '梳理', value: 'ARRANGE' },
  { label: '功能点', value: 'FEATURE' },
  { label: '版本', value: 'RELEASE' },
  { label: '回顾', value: 'RETRO' },
  { label: '优化', value: 'IMPROVEMENT' },
  { label: '调研', value: 'RESEARCH' },
  { label: '其他', value: 'OTHERS' },
]
