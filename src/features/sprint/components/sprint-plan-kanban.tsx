'use client'

import * as React from 'react'
import { AvatarImage } from '@radix-ui/react-avatar'
import { IconCalendarTime, IconFilterEdit, IconPlus, IconUserCircle } from '@tabler/icons-react'
import { DragEndEvent } from '@dnd-kit/core'
import { GripVertical } from 'lucide-react'
import { toast } from 'sonner'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import * as Kanban from '@/components/ui/kanban'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useUpdateIssue } from '@/features/issue/_lib/services'
import { UpdateOrCreateIssueSheet } from '@/features/issue/components/update-sheet'
import { issueStatus } from '@/features/issue/types'
import { useGetTeamMembers } from '@/features/workspace/_lib/services'
import { Team } from '@/features/workspace/types'
import { Sprint } from '../types'

type Issue = NonNullable<Sprint['issues']>[number]
type Member = NonNullable<Team['members']>[number]

interface SprintPlanKanbanProps {
  sprint: Sprint | undefined | null
  onPlan: () => void
}

const getColumnTitle = (value: string, groupBy: 'assignee' | 'status', members: Member[]) => {
  let title
  if (groupBy === 'status') {
    const { color, label, icon } = issueStatus.find((status) => status.value === value) || {}
    title = label || value

    return (
      <div className='flex items-center gap-1'>
        <div
          className={`flex size-4 px-0.5 font-extrabold items-center justify-center cursor-pointer rounded-full ${color || ''} text-white`}
        >
          {icon}
        </div>
        <span className='text-xs'>{label}</span>
      </div>
    )
  } else if (groupBy === 'assignee') {
    const member = members.find((member) => member.username === value)
    if (value === 'unassigned') {
      title = 'Unassigned'
    } else {
      title = member?.name || value
    }

    return (
      <div className='flex items-center gap-1'>
        <Avatar className='w-4 h-4 rounded-full'>
          <AvatarImage src={member?.avatar} />
          <AvatarFallback>
            <IconUserCircle className='w-4 h-4' />
          </AvatarFallback>
        </Avatar>
        <span className='line-clamp-1'>{title}</span>
      </div>
    )
  }
}

export function SprintPlanKanban({ sprint, onPlan }: SprintPlanKanbanProps) {
  const [groupBy, setGroupBy] = React.useState<'assignee' | 'status'>('status')
  const { data: team } = useGetTeamMembers(sprint?.team.id || '')
  const members = team?.members || []
  const { mutateAsync: updateIssue } = useUpdateIssue()

  const issues = sprint?.issues || []

  const getInitialColumns = React.useCallback(() => {
    if (!issues?.length) return {}

    if (groupBy === 'assignee') {
      const columns: Record<string, Issue[]> = {
        unassigned: [],
      }

      members.forEach((member) => {
        columns[member.username] = []
      })

      // group issues by assignee
      issues.forEach((issue) => {
        if (!issue) return

        if (issue?.assignee?.username) {
          if (columns[issue.assignee.username]) {
            columns[issue.assignee.username].push(issue)
          }
        } else {
          columns['unassigned'].push(issue)
        }
      })

      return columns
    } else {
      // group issues by status
      return issueStatus.reduce(
        (acc, status) => {
          acc[status.value] = issues.filter((issue) => issue && issue.status === status.value)
          return acc
        },
        {} as Record<string, Issue[]>,
      )
    }
  }, [groupBy, issues, members])

  const previousColumns = React.useRef<Record<string, Issue[]>>({})
  const [columns, setColumns] = React.useState<Record<string, Issue[]>>({})

  // 初始化 columns
  React.useEffect(() => {
    const initialColumns = getInitialColumns()
    if (JSON.stringify(initialColumns) !== JSON.stringify(columns)) {
      setColumns(initialColumns)
    }
  }, [groupBy, issues, members])

  // handle drag
  const handleDragEnd = React.useCallback(
    (e: DragEndEvent) => {
      const {
        active: { id },
      } = e

      const issue = issues.find((issue) => issue?.id === id)

      if (!issue) return

      // find status of the issue in the current columns
      const currentColumn = Object.keys(columns).find((column) => columns[column].includes(issue))

      const columnUnChanged =
        (groupBy === 'status' && currentColumn === issue.status) ||
        (groupBy === 'assignee' && currentColumn === (issue.assignee?.username || 'unassigned'))

      if (!currentColumn || columnUnChanged) return

      if (groupBy === 'status') {
        toast.promise(
          updateIssue({
            id: issue.id,
            status: currentColumn,
          }),
          {
            loading: 'Updating issue status...',
            success: 'Issue status updated',
            error: (e) => ({
              message: e.msg,
              description: e.error,
            }),
          },
        )
      } else {
        toast.promise(
          updateIssue({
            id: issue.id,
            assigneeId: members.find((member) => member.username === currentColumn)?.id || null,
          }),
          {
            loading: 'Updating issue assignee...',
            success: 'Issue assignee updated',
            error: (e) => ({
              message: e.msg,
              description: e.error,
            }),
          },
        )
      }
    },
    [columns],
  )

  if (!sprint) return null

  return (
    <div className='w-full'>
      {/*  group by select */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2 mb-4 min-w-[250px]'>
          <Select value={groupBy} onValueChange={(value) => setGroupBy(value as 'assignee' | 'status')}>
            <SelectTrigger>
              <SelectValue placeholder='Group by' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='status'>Group by status</SelectItem>
              <SelectItem value='assignee'>Group by assignee</SelectItem>
            </SelectContent>
          </Select>

          <Separator orientation='vertical' className='h-4 ml-4' />

          <div className='flex items-center gap-2'>
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' onClick={onPlan}>
                    <IconFilterEdit className='w-4 h-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>replan issues in sprint</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* kanban */}
      <Kanban.Root
        value={columns}
        onValueChange={(value) => {
          setColumns(value)
        }}
        onDragStart={() => {
          previousColumns.current = columns
        }}
        onDragEnd={(e) => {
          handleDragEnd(e)
        }}
        getItemValue={(item) => item.id}
      >
        <div className='w-full overflow-x-auto'>
          <Kanban.Board className='inline-flex gap-4 min-w-max'>
            {Object.entries(columns).map(([columnValue, issues]) => (
              <IssueColumn
                key={columnValue}
                value={columnValue}
                issues={issues}
                groupBy={groupBy}
                teamId={team?.id}
                members={members}
                sprintId={sprint?.id}
              />
            ))}
          </Kanban.Board>
        </div>
        <Kanban.Overlay>
          {({ value, variant }) => {
            if (variant === 'column') {
              const issues = columns[value] ?? []

              return (
                <IssueColumn
                  value={value}
                  issues={issues}
                  groupBy={groupBy}
                  members={members}
                  teamId={team?.id}
                  sprintId={sprint?.id}
                />
              )
            }

            const issue = Object.values(columns)
              .flat()
              .find((issue): issue is Issue => !!issue && issue.id === value)

            if (!issue) return null

            return <IssueCard issue={issue} groupBy={groupBy} sprintId={sprint?.id} />
          }}
        </Kanban.Overlay>
      </Kanban.Root>
    </div>
  )
}

interface IssueCardProps extends Omit<React.ComponentProps<typeof Kanban.Item>, 'value'> {
  issue: NonNullable<Issue>
  groupBy: 'assignee' | 'status'
  sprintId: string
}

function IssueCard({ issue, groupBy, sprintId, ...props }: IssueCardProps) {
  const [isEditing, setIsEditing] = React.useState(false)

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditing(true)
  }

  if (!issue) return null

  const { color, label, icon } = issueStatus.find((status) => status.value === issue.status) || {}

  return (
    <>
      <Kanban.Item key={issue.id} value={issue.id} {...props}>
        <div className='rounded-md border bg-card p-3 shadow-xs group relative'>
          {/* 拖动手柄区域 */}
          <Kanban.ItemHandle asChild>
            <div className='absolute left-1 top-1/2 -translate-y-1/2 cursor-move p-1'>
              <GripVertical className='h-4 w-4 text-muted-foreground' />
            </div>
          </Kanban.ItemHandle>

          <div className='flex flex-col gap-2 pl-5'>
            <div className='flex items-center justify-between gap-2'>
              {/* 标题区域 */}
              <div onClick={handleEdit} className='cursor-pointer'>
                <span className='line-clamp-1 font-medium text-sm hover:text-primary hover:underline'>
                  {issue.title}
                </span>
              </div>

              {issue.priority && (
                <Badge
                  variant={
                    issue.priority === 'high' ? 'destructive' : issue.priority === 'medium' ? 'default' : 'secondary'
                  }
                  className='pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize'
                >
                  {issue.priority}
                </Badge>
              )}
            </div>

            <div className='flex items-center justify-between text-muted-foreground text-xs'>
              {groupBy === 'status' &&
                (issue.assignee ? (
                  <div className='flex items-center gap-1'>
                    <Avatar className='w-3 h-3 rounded-full overflow-hidden'>
                      <AvatarImage src={issue.assignee.avatar} />
                      <AvatarFallback>
                        <IconUserCircle className='w-3 h-3' />
                      </AvatarFallback>
                    </Avatar>
                    <span className='line-clamp-1'>{issue.assignee.name}</span>
                  </div>
                ) : (
                  <div className='flex items-center gap-1'>
                    <span className='text-xs bg-red-300 text-white px-1.5 py-0.5'>unassigned</span>
                  </div>
                ))}

              {groupBy === 'assignee' && issue.status && (
                <div className='flex items-center gap-1'>
                  <div
                    className={`flex size-4 px-0.5 font-extrabold items-center justify-center cursor-pointer rounded-full ${color || ''} text-white`}
                  >
                    {icon}
                  </div>
                  <span className='text-xs'>{label}</span>
                </div>
              )}

              {issue.deadline && (
                <time className='text-xs flex items-center gap-1'>
                  <IconCalendarTime className='w-3 h-3' />
                  {issue.deadline}
                </time>
              )}
            </div>
          </div>
        </div>
      </Kanban.Item>

      {isEditing && (
        <UpdateOrCreateIssueSheet
          issue={issue}
          givenSprintId={sprintId}
          givenWorkspaceId={issue.team?.id}
          defaultAssignee={issue.assignee?.id}
          enableGivenFieldsChange={true}
          open={isEditing}
          onOpenChange={() => setIsEditing(false)}
        />
      )}
    </>
  )
}

interface IssueColumnProps extends Omit<React.ComponentProps<typeof Kanban.Column>, 'children'> {
  issues: Issue[]
  groupBy: 'assignee' | 'status'
  teamId: string | undefined
  members: Member[]
  sprintId: string
}

function IssueColumn({ value, issues, groupBy, teamId, members, sprintId, ...props }: IssueColumnProps) {
  const [isCreating, setIsCreating] = React.useState(false)

  return (
    <>
      <Kanban.Column value={value} {...props} className='w-[350px] min-w-[350px] shrink-0'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <span className='font-semibold text-sm'>{getColumnTitle(value, groupBy, members)}</span>
            <Badge variant='secondary' className='pointer-events-none text-muted-foreground font-bold'>
              ({issues.length})
            </Badge>
          </div>
          <div>
            <Kanban.ColumnHandle asChild>
              <Button variant='ghost' size='icon'>
                <GripVertical className='h-4 w-4' />
              </Button>
            </Kanban.ColumnHandle>
          </div>
        </div>
        <div className='flex flex-col gap-2 p-0.5'>
          {issues
            .filter((issue) => !!issue)
            .map((issue) => (
              <IssueCard key={issue.id} issue={issue} groupBy={groupBy} sprintId={sprintId} />
            ))}
        </div>
        <div className='flex items-center justify-between'>
          <Button variant='outline' size='icon' className='w-full' onClick={() => setIsCreating(true)}>
            <IconPlus className='h-4 w-4' />
          </Button>
        </div>
      </Kanban.Column>

      {isCreating && (
        <UpdateOrCreateIssueSheet
          issue={null}
          open={isCreating}
          givenWorkspaceId={teamId}
          givenSprintId={sprintId}
          defaultStatus={groupBy === 'status' ? (value as string) : undefined}
          defaultAssignee={groupBy === 'assignee' ? (value as string) : undefined}
          onOpenChange={() => setIsCreating(false)}
        />
      )}
    </>
  )
}
