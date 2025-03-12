import { z } from 'zod'

export const BacklogSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  backlogType: z.string().optional(),
  priority: z.string().optional(),
  dueTime: z.string().optional(),
  estimatedTime: z.number().optional(),
  createdTime: z.string().optional(),
  modifiedTime: z.string().optional(),
})
export type Backlog = z.infer<typeof BacklogSchema>

export const backlogTypes = [
  { label: '缺陷', value: 'BUG', color: 'bg-red-300' },
  { label: '梳理', value: 'ARRANGE', color: 'bg-blue-300' },
  { label: '功能点', value: 'FEATURE', color: 'bg-green-300' },
  { label: '版本', value: 'RELEASE', color: 'bg-yellow-300' },
  { label: '回顾', value: 'RETRO', color: 'bg-purple-300' },
  { label: '优化', value: 'IMPROVEMENT', color: 'bg-orange-300' },
  { label: '调研', value: 'RESEARCH', color: 'bg-pink-300' },
  { label: '其他', value: 'OTHERS', color: 'bg-gray-300' },
]

export const createBacklogSchema = z.object({
  title: z.string().min(1, { message: '标题不能为空' }),
  description: z.string().optional(),
  backlogType: z.string().optional(),
  priority: z.string().optional(),
  dueTime: z.string().optional(),
})

export type CreateBacklogSchema = z.infer<typeof createBacklogSchema>
