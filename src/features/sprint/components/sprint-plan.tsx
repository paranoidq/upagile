import { FC, useState } from 'react'
import {
  IconArrowRight,
  IconCalendarTime,
  IconCube,
  IconFilter,
  IconInfoSquare,
  IconPencil,
  IconReload,
  IconTrash,
} from '@tabler/icons-react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { SprintPlanKanban } from './sprint-plan-kanban'
import SprintPlanList from './sprint-plan-list'
import { UpdateSprintSheet } from './update-sheet'

type Action = {
  type: 'update' | 'delete'
  data: Sprint | null | undefined
}

const SprintPlanPage: FC = () => {
  const { sprintId } = useParams()
  const navigate = useNavigate()
  const [action, setAction] = useState<Action | null>(null)

  const { data: sprint } = useSprint(sprintId, true)
  return (
    <>
      {/* common header */}
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <div className='text-lg font-bold'>Sprints</div>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/sprints')}>Sprints</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{sprint?.id}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className='mt-4'>
          <Card>
            <CardHeader>
              <CardTitle className=''>
                <div className='flex items-center justify-between'>
                  <div className='text-lg font-bold'>{sprint?.title}</div>
                  <div className='flex items-center space-x-2'>
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
                    <Button variant='ghost' size='icon'>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <IconReload className='h-4 w-4' />
                          </TooltipTrigger>
                          <TooltipContent>Reload Sprint</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Button>
                  </div>
                </div>
              </CardTitle>

              <CardDescription className='flex flex-col gap-2 text-base'>
                <div className='flex items-center space-x-2'>
                  <IconCalendarTime className='h-4 w-4' />
                  <div className='flex items-center space-x-2'>
                    <div>{sprint?.startTime}</div>
                    <IconArrowRight className='h-4 w-4' />
                    <div>{sprint?.endTime}</div>
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
                  </div>
                </div>

                <div className='flex items-center space-x-2'>
                  <div className='flex items-center space-x-2'>
                    <IconCube className='h-4 w-4' />
                    <div>{sprint?.team.name}</div>
                  </div>
                </div>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue='kanban'>
                <div className='flex items-center justify-between'>
                  <TabsList>
                    <TabsTrigger value='kanban'>Kanban</TabsTrigger>
                    <TabsTrigger value='list'>List</TabsTrigger>
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
                <TabsContent value='kanban' className='mt-4'>
                  <SprintPlanKanban />
                </TabsContent>
                <TabsContent value='list'>
                  <SprintPlanList />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </Main>

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
    </>
  )
}

export default SprintPlanPage
