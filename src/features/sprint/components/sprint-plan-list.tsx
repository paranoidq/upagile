import { FC, useState } from 'react'
import { Collapse, CollapseProps } from 'antd'
import { Sprint } from '../types'

interface SprintPlanListProps {
  sprint: Sprint | undefined | null
}

type Issue = Sprint['issues']

const SprintPlanList: FC<SprintPlanListProps> = ({ sprint }) => {
  const [view, setView] = useState<'kanban' | 'list'>('list')
  const issues: Issue = sprint?.issues || []

  // 提前返回，如果没有 issues
  if (!issues.length) {
    return (
      <div className='flex h-[200px] items-center justify-center'>
        <div className='text-center'>
          <p className='text-muted-foreground'>暂无任务</p>
        </div>
      </div>
    )
  }

  // 将issues按issueStatus中的value分组
  const groupedIssues = issues.reduce(
    (acc, issue) => {
      const status = issue?.status || 'unknown'
      if (!acc[status]) {
        acc[status] = []
      }
      acc[status].push(issue as Issue)
      return acc
    },
    {} as Record<string, Issue[]>,
  )

  const items: CollapseProps['items'] = Object.entries(groupedIssues).map(([status, issues]) => ({
    key: status,
    label: <div className='text-sm font-medium'>{status}</div>,
    children: (
      <div>
        {issues.map((issue) => (
          <div key={issue?.id}>
            <div>{issue?.title}</div>
            <div>{issue?.description}</div>
          </div>
        ))}
      </div>
    ),
  }))

  return (
    <div className='w-full mt-4'>
      <Collapse items={items} className='w-full' size='small' defaultActiveKey={['completed']} />
    </div>
  )
}

export default SprintPlanList
