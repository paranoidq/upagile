import React from 'react'
import { z } from 'zod'
import { IconCheck, IconCircle, IconRocket, IconRotateClockwise2, IconX } from '@tabler/icons-react'

export const releaseStatus: {
  label: string
  value: string
  color: string
  icon?: React.ReactNode
}[] = [
  { label: '未开始', value: 'init', color: 'bg-gray-600', icon: <IconCircle /> },
  { label: '准备中', value: 'preparing', color: 'bg-gray-600', icon: <IconCircle /> },
  { label: '提测中', value: 'testing', color: 'bg-blue-600', icon: <IconRotateClockwise2 /> },
  { label: '已发版', value: 'released', color: 'bg-green-600', icon: <IconCheck /> },
  { label: '已上线', value: 'production', color: 'bg-green-600', icon: <IconRocket /> },
  { label: '已取消', value: 'canceled', color: 'bg-red-600', icon: <IconX /> },
]

export const createReleaseSchema = z.object({
  title: z.string().min(1, 'title is required'),
  description: z.string().optional(),
  testTime: z.string().optional(),
  releaseTime: z.string().optional(),
  productionTime: z.string().optional(),
  status: z.enum(releaseStatus.map((status) => status.value) as [string, ...string[]]).optional(),
  principalId: z.string().optional(),
  applicationId: z.string({ message: 'application is required' }),
  teamId: z.string().optional(),
})

export const updateReleaseSchema = createReleaseSchema.extend({
  id: z.string(),
})

export const ReleaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  testTime: z.string().optional(),
  releaseTime: z.string().optional(),
  productionTime: z.string().optional(),
  status: z.enum(releaseStatus.map((status) => status.value) as [string, ...string[]]).optional(),
  principal: z
    .object({
      id: z.string(),
      name: z.string(),
      username: z.string(),
      avatar: z.string().optional(),
    })
    .optional(),
  application: z.object({
    id: z.string(),
    name: z.string(),
    team: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
  issues: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .optional(),
  createdTime: z.string().optional(),
  modifiedTime: z.string().optional(),
})
export type Release = z.infer<typeof ReleaseSchema>
