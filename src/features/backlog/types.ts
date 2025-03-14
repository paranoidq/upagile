import { z } from 'zod'
import { PRIORITIES } from '@/consts/enums'

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

const backlogTypeEnums = backlogTypes.map((type) => type.value)

export const createBacklogSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  backlogType: z.enum(backlogTypeEnums as [string, ...string[]]),
  priority: z.enum(PRIORITIES.map((priority) => priority.value) as [string, ...string[]]),
  dueTime: z.string().optional(),
  estimatedTime: z.number().optional(),
})

export const updateBacklogSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  backlogType: z.enum().optional(),
  priority: z.string().optional(),
  dueTime: z.string().optional(),
  estimatedTime: z.number().optional(),
})

export type GetTasksSchema = z.infer<typeoc>
export type CreateTaskSchema = z.infer<typeof createBacklogSchema>
export type UpdateTaskSchema = z.infer<typeof updateBacklogSchema>

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
