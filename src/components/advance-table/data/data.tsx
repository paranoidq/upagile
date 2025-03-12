import { View } from '../components/views/types'

export const views: View[] = [
  {
    id: 1,
    name: '这是一个很长的文本内容，当超过最大宽度时会显示省略号',
    columns: [],
    filterParams: {
      operator: 'and',
      sort: 'name',
      filters: [
        {
          field: 'priority',
          value: 'high',
          isMulti: false,
        },
      ],
    },
  },
]
