import React from 'react'
import { z } from 'zod'
import { IconCheck, IconCircle, IconRotateClockwise2, IconX } from '@tabler/icons-react'

export const sprintStatus: {
  label: string
  value: string
  color: string
  icon?: React.ReactNode
}[] = [
  { label: '未开始', value: 'planing', color: 'bg-gray-600', icon: <IconCircle /> },
  { label: '进行中', value: 'active', color: 'bg-blue-600', icon: <IconRotateClockwise2 /> },
  { label: '已完成', value: 'complete', color: 'bg-green-600', icon: <IconCheck /> },
  { label: '已关闭', value: 'cancel', color: 'bg-red-600', icon: <IconX /> },
]

export const createSprintSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: z.enum(sprintStatus.map((status) => status.value) as [string, ...string[]]).optional(),
  teamId: z.string().optional(),
})

export const updateSprintSchema = z.object({
  id: z.string(),
  title: z.string().min(1, '标题不能为空').optional(),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: z.enum(sprintStatus.map((status) => status.value) as [string, ...string[]]).optional(),
  teamId: z.string().optional(),
})

export type CreateSprintSchema = z.infer<typeof createSprintSchema>
export type UpdateSprintSchema = z.infer<typeof updateSprintSchema>

export const SprintSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  status: z.enum(sprintStatus.map((status) => status.value) as [string, ...string[]]).optional(),
  team: z.object({
    id: z.string(),
    name: z.string(),
  }),
  issues: z.array(
    z
      .object({
        id: z.string(),
      })
      .optional(),
  ),
  createdTime: z.string().optional(),
  modifiedTime: z.string().optional(),
})
export type Sprint = z.infer<typeof SprintSchema>
