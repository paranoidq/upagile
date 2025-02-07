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
import { ViewType } from '../services/view-services'

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
      filters: [{ field: 'title', operator: 'eq', value: 'test' }],
      sorts: [{ field: 'title', order: 'desc' }],
      groups: [{ field: 'status', order: 'asc' }],
    },
  },
  {
    id: 2,
    name: 'view2',
    type: 'task',
    conditions: {
      filters: [{ field: 'priority', operator: 'eq', value: 'Medium' }],
      sorts: [{ field: 'title', order: 'asc' }],
      groups: [{ field: 'status', order: 'asc' }],
    },
  },
]

export const viewsDetail = {
  id: 1,
  name: 'view1',
  options: {
    filter: {
      matchType: 'all', // all, any
    },
  },
  querySpecs: {
    // keyType: text, number, person, enum, date, other
    // 每一种对应的filterType和value的可取值都不同
    // text: equal, notEqual, in, notIn, null, notNull
    // number: equal, notEqual, null, notNull, range, gt, gte, lt, lte
    // person: equal, notEqual, in, notIn, null, notNull
    // enum: equal, notEqual, in, notIn, null, notNull
    // date: equal, null, notNull, gt, gte, lt, lte
    // other: null, notNull
    //
    // column类型：
    // text, 数字、单选、多选、日期、人员、枚举、链接、进度
    filters: [
      {
        key: 'status',
        keyType: 'text',
        filterType: 'exclude',
        value: ['canceled', 'done'],
      },
      {
        key: 'createdAt',
        keyType: 'date',
        filterType: 'range', // range, , include
        value: ['canceled', 'done'],
      },
    ],
    sorts: [
      {
        key: 'priority',
        order: 'asc',
      },
      {
        key: 'createdAt',
        order: 'desc',
      },
    ],
    views: ['id', 'priority', 'status', 'title', 'createdAt', 'updatedAt'],
  },
}
