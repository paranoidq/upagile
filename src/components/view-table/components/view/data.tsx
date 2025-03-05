import { ViewType } from '@/components/view-table/types.ts'

export const views: ViewType[] = [
  {
    id: 1,
    name: '这是一个很长的文本内容，当超过最大宽度时会显示省略号',
    type: 'task',
    conditions: {
      filters: [],
      sorts: [{ field: 'name', direction: 'desc' }],
      groups: [],
    },
  },
]
