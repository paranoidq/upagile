'use client'

import * as React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import { useTeamStore } from '@/stores/teamStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import * as Kanban from '@/components/ui/kanban'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useUpdateIssue } from '@/features/issue/_lib/services'
import { issueStatus } from '@/features/issue/types'
import { Sprint } from '../types'

type Issue = NonNullable<Sprint['issues']>[number]

interface SprintPlanKanbanProps {
  sprint: Sprint | undefined | null
}

const getColumnTitle = (value: string, groupBy: 'assignee' | 'status', members: any[]) => {
  if (groupBy === 'status') {
    return issueStatus.find((status) => status.value === value)?.label || value
  }
  if (value === 'unassigned') {
    return 'Unassigned'
  }
  return members.find((member) => member.id === value)?.name || value
}

export function SprintPlanKanban({ sprint }: SprintPlanKanbanProps) {
  const queryClient = useQueryClient() // 添加这行
  const [groupBy, setGroupBy] = React.useState<'assignee' | 'status'>('status')
  const { teams } = useTeamStore()
  const { mutateAsync: updateIssue } = useUpdateIssue()
  const members = React.useMemo(() => {
    return teams.find((team) => team.id === sprint?.team.id)?.members || []
  }, [teams, sprint?.team.id])

  const issues = sprint?.issues || []

  const getInitialColumns = React.useCallback(() => {
    if (!issues?.length) return {}

    if (groupBy === 'assignee') {
      const columns: Record<string, Issue[]> = {}

      members.forEach((member) => {
        columns[member.id] = []
      })

      columns['unassigned'] = []

      issues.forEach((issue) => {
        if (!issue) return

        if (issue?.assignee?.id) {
          if (columns[issue.assignee.id]) {
            columns[issue.assignee.id].push(issue)
          }
        } else {
          columns['unassigned'].push(issue)
        }
      })

      return columns
    } else {
      return issueStatus.reduce(
        (acc, status) => {
          acc[status.value] = issues.filter((issue) => issue && issue.status === status.value)
          return acc
        },
        {} as Record<string, Issue[]>,
      )
    }
  }, [groupBy, issues, members])

  const [columns, setColumns] = React.useState<Record<string, Issue[]>>({})

  React.useEffect(() => {
    setColumns(getInitialColumns())
  }, [groupBy, issues, members])

  const handleDragEnd = React.useCallback(
    async (event: { active: { id: string }; over: { id: string } | null }) => {
      const { active, over } = event
      if (!over) return

      const activeIssue = Object.values(columns)
        .flat()
        .find((issue) => issue?.id === active.id)

      if (!activeIssue) return

      // 检查是否在同一列内拖动
      const activeColumnId = Object.entries(columns).find(([_, issues]) =>
        issues.some((issue) => issue.id === active.id),
      )?.[0]

      if (!activeColumnId) return

      // 找到目标列ID和目标Issue
      let targetColumnId = activeColumnId
      const overIssueId = over.id

      // 如果over.id存在于columns的键中，说明是拖到了列上
      if (Object.keys(columns).includes(over.id)) {
        targetColumnId = over.id
      } else {
        // 否则是拖到了某个issue上，需要找到该issue所在的列
        targetColumnId =
          Object.entries(columns).find(([_, issues]) => issues.some((issue) => issue.id === over.id))?.[0] ||
          activeColumnId
      }

      // 如果是同一列内的拖动且目标是列而不是具体的issue，不执行任何操作
      if (activeColumnId === targetColumnId && !columns[targetColumnId].some((issue) => issue.id === overIssueId))
        return

      // 更新本地状态
      const newColumns = { ...columns }
      // 从原列中移除
      newColumns[activeColumnId] = newColumns[activeColumnId].filter((issue) => issue.id !== activeIssue.id)

      // 添加到新列
      if (!newColumns[targetColumnId]) {
        newColumns[targetColumnId] = []
      }

      // 如果是拖到具体issue上，找到目标位置插入
      const targetIndex = newColumns[targetColumnId].findIndex((issue) => issue.id === overIssueId)

      if (targetIndex !== -1) {
        // 如果找到目标位置，在目标位置插入
        newColumns[targetColumnId].splice(targetIndex, 0, activeIssue)
      } else {
        // 否则添加到列表末尾
        newColumns[targetColumnId].push(activeIssue)
      }

      setColumns(newColumns)

      // 只有在跨列拖动时才更新后端
      if (activeColumnId !== targetColumnId) {
        const updateData = {
          id: activeIssue.id,
          ...(groupBy === 'status'
            ? { status: targetColumnId }
            : {
                assignee:
                  targetColumnId === 'unassigned'
                    ? null
                    : {
                        id: targetColumnId,
                        name: members.find((m) => m.id === targetColumnId)?.name || '',
                        username: members.find((m) => m.id === targetColumnId)?.username || '',
                      },
              }),
        }

        toast.promise(updateIssue(updateData), {
          loading: 'Updating...',
          success: () => {
            return 'Updated successfully'
          },
          error: () => {
            setColumns(getInitialColumns())
            return 'Failed to update'
          },
        })
      }
    },
    [columns, groupBy, members, updateIssue, getInitialColumns],
  )

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

      <Kanban.Root value={columns} getItemValue={(item) => item.id} onDragEnd={handleDragEnd}>
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
