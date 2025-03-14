import { View } from '../types'

export const views: View[] = [
  {
    id: 1,
    name: '这是一个很长的文本内容，当超过最大宽度时会显示省略号',
    columns: ['title', 'priority', 'backlogType', 'dueTime', 'estimatedTime', 'createdTime'],
    filterParams: {
      operator: 'and',
      filters: [
        {
          field: 'priority',
          value: 'high',
          operator: 'eq',
        },
      ],
    },
    sortParams: [
      {
        field: 'name',
        direction: 'asc',
      },
    ],
    groupParams: [
      {
        field: 'priority',
        direction: 'asc',
      },
    ],
  },
]
