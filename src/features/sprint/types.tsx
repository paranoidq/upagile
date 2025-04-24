import React from 'react'
import { z } from 'zod'
import { IconCheck, IconCircle, IconRotateClockwise2, IconX } from '@tabler/icons-react'
import { prioritySchema } from '@/consts/enums'
import { issueStatusSchema, issueTypeSchema } from '../issue/types'

export const sprintStatus: {
  label: string
  value: string
  color: string
  icon?: React.ReactNode
}[] = [
  { label: 'Pending', value: 'init', color: 'bg-gray-600', icon: <IconCircle /> },
  { label: 'Progressing', value: 'progressing', color: 'bg-blue-600', icon: <IconRotateClockwise2 /> },
  { label: 'Completed', value: 'completed', color: 'bg-green-600', icon: <IconCheck /> },
  { label: 'Canceled', value: 'canceled', color: 'bg-red-600', icon: <IconX /> },
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

export const sprintSchema = z.object({
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
  issues: z
    .array(
      z
        .object({
          id: z.string(),
          title: z.string(),
          description: z.string().optional(),
          status: issueStatusSchema.optional(),
          type: issueTypeSchema.optional(),
          priority: prioritySchema.optional(),
          assignee: z
            .object({
              id: z.string(),
              name: z.string(),
              username: z.string(),
              avatar: z.string().optional(),
            })
            .optional(),
          deadline: z.string().optional(),
          duration: z.number().optional(),
        })
        .optional(),
    )
    .optional(),
  createdTime: z.string().optional(),
  modifiedTime: z.string().optional(),
})
export type Sprint = z.infer<typeof sprintSchema>
