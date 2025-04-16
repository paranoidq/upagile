'use client'

import * as React from 'react'
import { GripVertical } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import * as Kanban from '@/components/ui/kanban'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateIssue } from '@/features/issue/_lib/services'
import { issueStatus } from '@/features/issue/types'
import { useGetTeamMembers } from '@/features/workspace/_lib/services'
import { Team } from '@/features/workspace/types'
import { Sprint } from '../types'

type Issue = NonNullable<Sprint['issues']>[number]
type Member = NonNullable<Team['members']>[number]

interface SprintPlanKanbanProps {
  sprint: Sprint | undefined | null
}

const getColumnTitle = (value: string, groupBy: 'assignee' | 'status', members: Member[]) => {
  if (groupBy === 'status') {
    return issueStatus.find((status) => status.value === value)?.label || value
  }
  if (value === 'unassigned') {
    return 'Unassigned'
  }
  return members.find((member) => member.id === value)?.name || value
}

export function SprintPlanKanban({ sprint }: SprintPlanKanbanProps) {
  const [groupBy, setGroupBy] = React.useState<'assignee' | 'status'>('status')
  const { data: team } = useGetTeamMembers(sprint?.team.id || '')
  const members = team?.members || []
  const { mutateAsync: updateIssue } = useUpdateIssue()

  const issues = sprint?.issues || []

  const columns = React.useMemo(() => {
    return issues.reduce(
      (acc, issue) => {
        if (!issue) return acc
        acc[issue.status] = [...(acc[issue.status] || []), issue]
        return acc
      },
      {} as Record<string, Issue[]>,
    )
  }, [issues])

  if (!sprint) return null

  return (
    <div className='w-full'>
      {/*  group by select */}
      <div className='flex items-center gap-2 mb-4 w-[200px]'>
        <Select value={groupBy} onValueChange={(value) => setGroupBy(value as 'assignee' | 'status')}>
          <SelectTrigger>
            <SelectValue placeholder='Group by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='status'>Group by status</SelectItem>
            <SelectItem value='assignee'>Group by assignee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* kanban */}
      <Kanban.Root value={columns} getItemValue={(item) => item.id}>
        <div className='overflow-x-auto'>
          <Kanban.Board className='inline-flex gap-4 min-w-max'>
            {Object.entries(columns).map(([columnValue, issues]) => (
              <IssueColumn key={columnValue} value={columnValue} issues={issues} groupBy={groupBy} members={members} />
            ))}
          </Kanban.Board>
        </div>
        <Kanban.Overlay>
          {({ value, variant }) => {
            if (variant === 'column') {
              const issues = columns[value] ?? []

              return <IssueColumn value={value} issues={issues} groupBy={groupBy} members={members} />
            }

            const issue = Object.values(columns)
              .flat()
              .find((issue): issue is Issue => !!issue && issue.id === value)

            if (!issue) return null

            return <IssueCard issue={issue} />
          }}
        </Kanban.Overlay>
      </Kanban.Root>
    </div>
  )
}

interface IssueCardProps extends Omit<React.ComponentProps<typeof Kanban.Item>, 'value'> {
  issue: NonNullable<Issue>
}

function IssueCard({ issue, ...props }: IssueCardProps) {
  if (!issue) return null

  return (
    <Kanban.Item key={issue.id} value={issue.id} asChild {...props}>
      <div className='rounded-md border bg-card p-3 shadow-xs'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between gap-2'>
            <span className='line-clamp-1 font-medium text-sm'>{issue.title}</span>
            <Badge
              variant={
                issue.priority === 'high' ? 'destructive' : issue.priority === 'medium' ? 'default' : 'secondary'
              }
              className='pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize'
            >
              {issue.priority}
            </Badge>
          </div>
          <div className='flex items-center justify-between text-muted-foreground text-xs'>
            {issue.assignee && (
              <div className='flex items-center gap-1'>
                <div className='size-2 rounded-full bg-primary/20' />
                <span className='line-clamp-1'>{issue.assignee.name}</span>
              </div>
            )}
            {issue.deadline && <time className='text-[10px] tabular-nums'>{issue.deadline}</time>}
          </div>
        </div>
      </div>
    </Kanban.Item>
  )
}

interface IssueColumnProps extends Omit<React.ComponentProps<typeof Kanban.Column>, 'children'> {
  issues: Issue[]
  groupBy: 'assignee' | 'status'
  members: any[]
}

function IssueColumn({ value, issues, groupBy, members, ...props }: IssueColumnProps) {
  return (
    <Kanban.Column value={value} {...props} className='w-[350px] min-w-[350px] shrink-0'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='font-semibold text-sm'>{getColumnTitle(value, groupBy, members)}</span>
          <Badge variant='secondary' className='pointer-events-none rounded-sm'>
            {issues.length}
          </Badge>
        </div>
        <Kanban.ColumnHandle asChild>
          <Button variant='ghost' size='icon'>
            <GripVertical className='h-4 w-4' />
          </Button>
        </Kanban.ColumnHandle>
      </div>
      <div className='flex flex-col gap-2 p-0.5'>
        {issues
          .filter((issue) => !!issue)
          .map((issue) => (
            <IssueCard key={issue.id} issue={issue} asHandle />
          ))}
      </div>
    </Kanban.Column>
  )
}
