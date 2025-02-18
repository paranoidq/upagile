import { ViewType } from '@/components/view-table/types.ts'

export const views: ViewType[] = [
  {
    id: 1,
    name: '这是一个很长的文本内容，当超过最大宽度时会显示省略号',
    type: 'task',
    conditions: {
      filters: [{ field: 'status', operator: 'not_equals', value: 'done' }],
      sorts: [{ field: 'title', direction: 'desc' }],
      groups: [{ field: 'status', direction: 'asc' }],
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
  {
    id: 5,
    name: 'view5',
    type: 'task',
    conditions: {
      filters: [
        { field: 'status', operator: 'not_equals', value: 'done' },
        { field: 'priority', operator: 'equals', value: 'high' },
      ],
      sorts: [{ field: 'title', direction: 'desc' }],
      groups: [],
    },
  },
]
