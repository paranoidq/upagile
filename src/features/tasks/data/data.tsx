import {
  IconArrowDown,
  IconArrowRight,
  IconArrowUp,
  IconCircle,
  IconCircleCheck,
  IconCircleX,
  IconExclamationCircle,
  IconStopwatch,
} from '@tabler/icons-react'
import { ViewType } from '@/features/tasks/types.ts'

export const labels = [
  {
    value: 'bug',
    label: 'Bug',
  },
  {
    value: 'feature',
    label: 'Feature',
  },
  {
    value: 'documentation',
    label: 'Documentation',
  },
]

export const statuses = [
  {
    value: 'backlog',
    label: 'Backlog',
    icon: IconExclamationCircle,
  },
  {
    value: 'todo',
    label: 'Todo',
    icon: IconCircle,
  },
  {
    value: 'in progress',
    label: 'In Progress',
    icon: IconStopwatch,
  },
  {
    value: 'done',
    label: 'Done',
    icon: IconCircleCheck,
  },
  {
    value: 'canceled',
    label: 'Canceled',
    icon: IconCircleX,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low',
    icon: IconArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium',
    icon: IconArrowRight,
  },
  {
    label: 'High',
    value: 'high',
    icon: IconArrowUp,
  },
]

export const views: ViewType[] = [
  {
    id: 1,
    name: '这是一个很长的文本内容，当超过最大宽度时会显示省略号',
    type: 'task',
    conditions: {
      filters: [{ field: 'status', operator: 'not_equals', value: 'done' }],
      sorts: [{ field: 'title', direction: 'desc' }],
      groups: [{ field: 'status', direction: 'asc' }, { field: 'priority', direction: 'asc' }],
    },
  },
  {
    id: 2,
    name: 'view2',
    type: 'task',
    conditions: {
      filters: [{ field: 'priority', operator: 'equals', value: 'medium' }],
      sorts: [{ field: 'title', direction: 'asc' }],
      groups: [{ field: 'status', direction: 'asc' }],
    },
  },
  {
    id: 3,
    name: 'view3',
    type: 'task',
    conditions: {
      filters: [{ field: 'status', operator: 'not_equals', value: 'done' }],
      sorts: [{ field: 'title', direction: 'desc' }],
      groups: [{ field: 'status', direction: 'asc' }],
    },
  },
  {
    id: 4,
    name: 'view4',
    type: 'task',
    conditions: {
      filters: [
        { field: 'status', operator: 'not_equals', value: 'done' },
        { field: 'priority', operator: 'equals', value: 'high' },
      ],
      sorts: [{ field: 'title', direction: 'desc' }],
      groups: [{ field: 'status', direction: 'asc' }],
    },
  },
]
