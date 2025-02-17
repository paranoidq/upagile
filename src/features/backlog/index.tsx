import { type FC } from 'react'
import { ViewTable } from '@/components/view-table/view-table'

const data = [
  { id: 1, title: '任务1', status: '进行中' },
  { id: 2, title: '任务2', status: '已完成' },
]

const columns = [
  {
    accessorKey: 'title',
    header: '标题',
  },
  {
    accessorKey: 'status',
    header: '状态',
  },
]

const views = [
  {
    id: 1,
    name: '默认视图',
    conditions: {
      filters: [],
      sorts: [],
    },
  },
]

const Backlog: FC = () => {
  return <ViewTable data={data} columns={columns} views={views} searchColumn='title' />
}

export default Backlog
