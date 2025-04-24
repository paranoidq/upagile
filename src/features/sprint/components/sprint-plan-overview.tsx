import { FC, useMemo, useState } from 'react'
import {
  IconArrowBackUp,
  IconArrowRight,
  IconCalendarTime,
  IconCheck,
  IconCube,
  IconInfoSquare,
  IconListCheck,
  IconLoader,
  IconPencil,
  IconReload,
  IconTrash,
} from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useUpdateSprint } from '../_lib/services'
import { Sprint, sprintStatus } from '../types'
import { DeleteSprintsDialog } from './delete-dialog'
import { SprintPlanDialog } from './sprint-plan-dialog'
import { UpdateOrCreateSprintSheet } from './update-sheet'

type Action = {
  type: 'update' | 'delete' | 'schedule'
  data: Sprint | null | undefined
}

interface SprintPlanOverviewProps {
  sprint: Sprint | undefined | null
  refetchSprint: () => void
}

const SprintPlanOverview: FC<SprintPlanOverviewProps> = ({ sprint, refetchSprint }) => {
  return (
    <div className='space-y-4'>
      <SprintInfoCard sprint={sprint} refetchSprint={refetchSprint} />
    </div>
  )
}

export default SprintPlanOverview

const SprintInfoCard = ({
  sprint,
  refetchSprint,
}: {
  sprint: Sprint | undefined | null
  refetchSprint: () => void
}) => {
  const navigate = useNavigate()
  const [action, setAction] = useState<Action | null>(null)
  const { mutateAsync: updateSprint, isPending: isUpdatingSprint } = useUpdateSprint()

  // calculate sprint duration as working days
  const sprintDuration = useMemo(() => {
    if (!sprint) return 0
    const startTime = new Date(sprint.startTime as string)
    const endTime = new Date(sprint.endTime as string)

    let workingDays = 0
    for (let date = startTime; date <= endTime; date.setDate(date.getDate() + 1)) {
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        workingDays++
      }
    }
    return workingDays
  }, [sprint])

  // calculate sprint progress(completed issues + canceled issues / total issues)
  const [progress, progressText] = useMemo(() => {
    if (!sprint) return [0, '']
    const completedIssues = sprint.issues?.filter((issue) => issue?.status === 'completed')?.length ?? 0
    const canceledIssues = sprint.issues?.filter((issue) => issue?.status === 'canceled')?.length ?? 0
    const totalIssues = sprint.issues?.length ?? 1
    return [(completedIssues + canceledIssues) / totalIssues, `${completedIssues + canceledIssues}/${totalIssues}`]
  }, [sprint])

  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between'>
        <CardTitle className='font-semibold text-muted-foreground'>{sprint?.title}</CardTitle>
        <div className='flex items-center'>
          <Button variant='ghost' size='icon' onClick={() => setAction({ type: 'update', data: sprint })}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconPencil className='h-4 w-4' />
                </TooltipTrigger>
                <TooltipContent>Edit Sprint</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>

          <Button variant='ghost' size='icon' onClick={() => setAction({ type: 'delete', data: sprint })}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconTrash className='h-4 w-4' />
                </TooltipTrigger>
                <TooltipContent>Delete Sprint</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>

          <Button variant='ghost' size='icon' onClick={() => refetchSprint()}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconReload className='h-4 w-4' />
                </TooltipTrigger>
                <TooltipContent>Reload Sprint</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>

          <Button variant='ghost' size='icon' onClick={() => navigate('/sprints')}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconArrowBackUp className='h-4 w-4' />
                </TooltipTrigger>
                <TooltipContent>Back to Sprint List</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex-col items-center justify-between space-y-3'>
          <div className='flex items-center space-x-2'>
            <IconCalendarTime className='h-4 w-4' />
            <div className='flex items-center space-x-2'>
              <div>{sprint?.startTime || '?'}</div>
              <IconArrowRight className='h-4 w-4' />
              <div>{sprint?.endTime || '?'}</div>
              <Button variant='outline' size='sm'>
                {`${sprintDuration} working days`}
              </Button>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-2'>
              <IconInfoSquare className='h-4 w-4' />
              <div>{sprint?.description || '-'}</div>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <div>
              {sprintStatus
                .filter((status) => status.value === sprint?.status)
                .map((status) => (
                  <div className='flex items-center space-x-2' key={status.value}>
                    <div
                      className={`flex h-4 w-4 px-0.5 font-extrabold items-center justify-center rounded-full ${status?.color || ''} text-white`}
                    >
                      {status?.icon}
                    </div>
                    <div>{status?.label}</div>
                  </div>
                ))}
            </div>
            {progress === 1 && sprint?.status !== 'completed' && (
              <Button
                disabled={isUpdatingSprint}
                variant='outline'
                size='sm'
                onClick={() => {
                  toast.promise(
                    updateSprint({
                      id: sprint?.id ?? '',
                      status: 'completed',
                    }),
                    {
                      loading: 'Marking sprint as completed...',
                      success: 'Sprint status updated',
                      error: (e) => {
                        return {
                          message: e.msg,
                          description: e.reason,
                        }
                      },
                    },
                  )
                }}
                className='text-green-700 hover:text-white hover:bg-green-700'
              >
                {isUpdatingSprint ? <IconLoader className='h-4 w-4 animate-spin' /> : <IconCheck className='h-4 w-4' />}
                Mark sprint as completed
              </Button>
            )}
          </div>

          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-2'>
              <IconCube className='h-4 w-4' />
              <div>{sprint?.team.name}</div>
            </div>
          </div>
        </div>
      </CardContent>

      <UpdateOrCreateSprintSheet
        open={action?.type === 'update'}
        onOpenChange={() => setAction(null)}
        sprint={action?.data ?? null}
      />

      <DeleteSprintsDialog
        open={action?.type === 'delete'}
        onOpenChange={() => setAction(null)}
        sprints={action?.data ? [action?.data] : []}
        showTrigger={false}
        onSuccess={() => navigate('/sprints')}
      />
    </Card>
  )
}

const SprintIssuesCard = ({ sprint }: { sprint: Sprint | undefined | null }) => {
  const navigate = useNavigate()
  const [action, setAction] = useState<Action | null>(null)

  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between'>
        <CardTitle className='font-semibold text-muted-foreground'>Sprint issues</CardTitle>
        <div className='flex items-center space-x-2'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => {
              setAction({ type: 'schedule', data: sprint })
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <IconListCheck className='h-4 w-4' />
                </TooltipTrigger>
                <TooltipContent>Plan Sprint</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex items-center space-x-2'></div>
      </CardContent>

      <SprintPlanDialog
        open={action?.type === 'schedule'}
        onOpenChange={() => setAction(null)}
        sprint={action?.data ?? null}
      />
    </Card>
  )
}
