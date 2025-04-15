import { FC, useMemo, useState } from 'react'
import {
  IconArrowBackUp,
  IconArrowRight,
  IconCalendarTime,
  IconCube,
  IconFilter,
  IconInfoSquare,
  IconListCheck,
  IconPencil,
  IconReload,
  IconTrash,
} from '@tabler/icons-react'
import { useNavigate, useParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { useSprint } from '../_lib/services'
import { Sprint, sprintStatus } from '../types'
import { DeleteSprintsDialog } from './delete-dialog'
import { SprintPlanDialog } from './sprint-plan-dialog'
import { SprintPlanKanban } from './sprint-plan-kanban'
import SprintPlanList from './sprint-plan-list'
import SprintPlanStats from './sprint-plan-stats'
import { UpdateSprintSheet } from './update-sheet'

type Action = {
  type: 'update' | 'delete' | 'schedule'
  data: Sprint | null | undefined
}

const SprintPlanPage: FC = () => {
  const { sprintId } = useParams()

  const { data: sprint } = useSprint(sprintId, true)

  return (
    <>
      {/* common header */}
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <div className='text-lg font-bold'>{sprint?.title}</div>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='mt-4'>
          <SprintInfoCard sprint={sprint} />

          <Card className='mt-4'>
            <CardHeader>
              <CardTitle>Sprint Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue='list' className='mt-4'>
                <div className='flex items-center justify-between'>
                  <TabsList>
                    <TabsTrigger value='kanban'>Kanban</TabsTrigger>
                    <TabsTrigger value='list'>List</TabsTrigger>
                    <TabsTrigger value='stats'>Stats</TabsTrigger>
                  </TabsList>
                  <div className='flex items-center w-[150px]'>
                    <Select defaultValue='status'>
                      <SelectTrigger>
                        <IconFilter className='h-4 w-4' />
                        <SelectValue placeholder='View' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='status'>Status</SelectItem>
                        <SelectItem value='assignee'>Assignee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <TabsContent value='kanban'>
                    <SprintPlanKanban sprint={sprint} />
                  </TabsContent>
                  <TabsContent value='list'>
                    <SprintPlanList sprint={sprint} />
                  </TabsContent>

                  <TabsContent value='stats'>
                    <SprintPlanStats />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </Main>
    </>
  )
}

export default SprintPlanPage

const SprintInfoCard = ({ sprint }: { sprint: Sprint }) => {
  const navigate = useNavigate()
  const [action, setAction] = useState<Action | null>(null)

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

  // calculate sprint progress(completed issues / total issues)
  const [progress, progressText] = useMemo(() => {
    if (!sprint) return [0, '']
    const completedIssues = sprint.issues?.filter((issue) => issue?.status === 'completed')?.length ?? 0
    const totalIssues = sprint.issues?.length ?? 1
    return [completedIssues / totalIssues, `${completedIssues}/${totalIssues}`]
  }, [sprint])

  return (
    <Card>
      <CardHeader className='flex-row items-center justify-between'>
        <CardTitle className='font-semibold text-muted-foreground'>Overview</CardTitle>
        <div className='flex items-center'>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => {
              setAction({ type: 'schedule', data: sprint })
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <IconListCheck className='h-4 w-4' />
                </TooltipTrigger>
                <TooltipContent>Plan Sprint</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>

          <Button variant='ghost' size='icon' onClick={() => setAction({ type: 'update', data: sprint })}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <IconPencil className='h-4 w-4' />
                </TooltipTrigger>
                <TooltipContent>Edit Sprint</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>

          <Button variant='ghost' size='icon' onClick={() => setAction({ type: 'delete', data: sprint })}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <IconTrash className='h-4 w-4' />
                </TooltipTrigger>
                <TooltipContent>Delete Sprint</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>

          <Button variant='ghost' size='icon' onClick={() => {}}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <IconReload className='h-4 w-4' />
                </TooltipTrigger>
                <TooltipContent>Reload Sprint</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>

          <Button variant='ghost' size='icon' onClick={() => navigate('/sprints')}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <IconArrowBackUp className='h-4 w-4' />
                </TooltipTrigger>
                <TooltipContent>Back to Sprint List</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className='flex-col items-center justify-between space-y-2'>
          <div className='flex items-center space-x-2'>
            <IconCalendarTime className='h-4 w-4' />
            <div className='flex items-center space-x-2'>
              <div>{sprint?.startTime}</div>
              <IconArrowRight className='h-4 w-4' />
              <div>{sprint?.endTime}</div>
              <div className='text-sm rounded-md px-1 border border-blue-500 text-blue-500'>
                {sprintDuration <= 0 ? '' : `${sprintDuration} working days`}
              </div>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-2'>
              <IconInfoSquare className='h-4 w-4' />
              <div>{sprint?.description}</div>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-2'>
              <div>
                {sprintStatus
                  .filter((status) => status.value === sprint?.status)
                  .map((status) => (
                    <div className='flex items-center space-x-2'>
                      <div
                        className={`flex h-4 w-4 px-0.5 font-extrabold items-center justify-center rounded-full ${status?.color || ''} text-white`}
                      >
                        {status?.icon}
                      </div>
                      <div>{status?.label}</div>
                    </div>
                  ))}
              </div>
              <div
                className={cn(
                  'text-sm rounded-md px-1 text-white border',
                  progress === 1
                    ? 'text-green-500 border-green-500'
                    : progress === 0
                      ? 'text-gray-500 border-gray-500'
                      : 'text-blue-500 border-blue-500',
                )}
              >
                {progressText}
              </div>

              {/* {progress === 1 && (
                      <Button variant='outline' onClick={() => {}} size='sm'>
                        Mark as Completed
                      </Button>
                    )} */}
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <div className='flex items-center space-x-2'>
              <IconCube className='h-4 w-4' />
              <div>{sprint?.team.name}</div>
            </div>
          </div>
        </div>
      </CardContent>

      <UpdateSprintSheet
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

      <SprintPlanDialog
        open={action?.type === 'schedule'}
        onOpenChange={() => setAction(null)}
        sprint={action?.data ?? null}
      />
    </Card>
  )
}
