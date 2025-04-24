import React from 'react'
import { z } from 'zod'
import { IconCheck, IconCircle, IconRotateClockwise2, IconX } from '@tabler/icons-react'
import { PRIORITIES, prioritySchema } from '@/consts/enums'

export const issueStatus: {
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
export const issueType: {
  label: string
  value: string
  color: string
}[] = [
  { label: '待定', value: 'unset', color: 'bg-gray-600' },
  { label: '需求', value: 'req', color: 'bg-blue-600' },
  { label: '功能', value: 'feature', color: 'bg-green-600' },
  { label: '事务', value: 'task', color: 'bg-red-600' },
  { label: '缺陷', value: 'bug', color: 'bg-yellow-600' },
  { label: '评审', value: 'review', color: 'bg-purple-600' },
  { label: '回顾', value: 'retro', color: 'bg-pink-600' },
  { label: '调研', value: 'research', color: 'bg-gray-600' },
  { label: '整理', value: 'doc', color: 'bg-gray-600' },
  { label: '项目', value: 'project', color: 'bg-gray-600' },
  { label: '其他', value: 'other', color: 'bg-gray-600' },
]

export const createIssueSchema = z.object({
  title: z.string().min(1, 'title is required'),
  description: z.string().optional(),
  priority: z.enum(PRIORITIES.map((priority) => priority.value) as [string, ...string[]]).optional(),
  sprintPriority: z.enum(PRIORITIES.map((priority) => priority.value) as [string, ...string[]]).optional(),
  status: z.enum(issueStatus.map((status) => status.value) as [string, ...string[]]).optional(),
  type: z.enum(issueType.map((type) => type.value) as [string, ...string[]]).optional(),
  progress: z.number().min(0).max(100).optional(),
  startTime: z.string().optional(),
  deadline: z.string().optional(),
  duration: z.number().optional(),
  parentId: z.string().optional(),
  inParentOrder: z.number().optional(),
  teamId: z.string().optional(),
  assigneeId: z.string().or(z.null()).optional(),
  labelsIds: z.array(z.string()).optional(),
  sprintIds: z.array(z.string()).optional(),
  releaseId: z.string().optional(),
})

export const updateIssueSchema = createIssueSchema.extend({
  id: z.string(),
  title: z.string().optional(),
})

export type CreateIssueSchema = z.infer<typeof createIssueSchema>
export type UpdateIssueSchema = z.infer<typeof updateIssueSchema>

export const issueStatusSchema = z.enum(issueStatus.map((status) => status.value) as [string, ...string[]])

export const issueTypeSchema = z.enum(issueType.map((type) => type.value) as [string, ...string[]])

export const BaseIssueSchema = z.object({
  id: z.string(),
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  priority: prioritySchema.optional(),
  sprintPriority: prioritySchema.optional(),
  status: issueStatusSchema.optional(),
  type: issueTypeSchema.optional(),
  progress: z.number().min(0).max(100).optional(),
  startTime: z.string().date().optional(),
  deadline: z.string().date().optional(),
  duration: z.number().optional(),
  inParentOrder: z.number().optional(),
  team: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  assignee: z
    .object({
      id: z.string(),
      username: z.string(),
      name: z.string(),
      email: z.string().optional(),
      avatar: z.string().optional(),
    })
    .optional(),
  labels: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        color: z.string().optional(),
      }),
    )
    .optional(),
  sprints: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
      }),
    )
    .optional(),
  release: z
    .object({
      id: z.string(),
      title: z.string(),
    })
    .optional(),
  createdTime: z.string().optional(),
  modifiedTime: z.string().optional(),
})

export type Issue = z.infer<typeof BaseIssueSchema> & {
  parent: Issue | undefined
  children: Issue[] | undefined
}

export const IssueSchema = BaseIssueSchema.extend({
  parent: BaseIssueSchema.optional(),
  children: z.array(BaseIssueSchema).optional(),
})
