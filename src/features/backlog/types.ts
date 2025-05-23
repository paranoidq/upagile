import { z } from 'zod'
import { PRIORITIES } from '@/consts/enums'

export const backlogTypes = [
  { label: '缺陷', value: 'bug', color: 'bg-red-300' },
  { label: '梳理', value: 'arrange', color: 'bg-blue-300' },
  { label: '功能', value: 'feature', color: 'bg-green-300' },
  { label: '版本', value: 'release', color: 'bg-yellow-300' },
  { label: '回顾', value: 'retro', color: 'bg-purple-300' },
  { label: '优化', value: 'improvement', color: 'bg-orange-300' },
  { label: '调研', value: 'research', color: 'bg-pink-300' },
  { label: '其他', value: 'other', color: 'bg-gray-300' },
]

const backlogTypeEnums = backlogTypes.map((type) => type.value)

export const createBacklogSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  backlogType: z.enum(backlogTypeEnums as [string, ...string[]]),
  priority: z.enum(PRIORITIES.map((priority) => priority.value) as [string, ...string[]]),
  deadline: z.string().optional(),
  estimateWorkload: z
    .union([z.string(), z.number()])
    .transform((val) => (val === '' ? undefined : typeof val === 'string' ? Number(val) : val))
    .optional(),
})

export const updateBacklogSchema = z.object({
  id: z.string(),
  title: z.string().min(1, '标题不能为空').optional(),
  description: z.string().optional(),
  backlogType: z.enum(backlogTypeEnums as [string, ...string[]]).optional(),
  priority: z.enum(PRIORITIES.map((priority) => priority.value) as [string, ...string[]]).optional(),
  deadline: z.string().optional(),
  estimateWorkload: z
    .union([z.string(), z.number()])
    .transform((val) => (val === '' ? undefined : typeof val === 'string' ? Number(val) : val))
    .optional(),
})

export type CreateBacklogSchema = z.infer<typeof createBacklogSchema>
export type UpdateBacklogSchema = z.infer<typeof updateBacklogSchema>

export const BacklogSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  backlogType: z.string().optional(),
  priority: z.string().optional(),
  deadline: z.string().optional(),
  estimateWorkload: z.number().optional(),
  createdTime: z.string().optional(),
  modifiedTime: z.string().optional(),
})
export type Backlog = z.infer<typeof BacklogSchema>
