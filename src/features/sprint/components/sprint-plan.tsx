import { FC, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { useSprint } from '../_lib/services'
import { SprintPlanDialog } from './sprint-plan-dialog'
import { SprintPlanKanban } from './sprint-plan-kanban'
import SprintPlanOverview from './sprint-plan-overview'

const SprintPlanPage: FC = () => {
  const { sprintId } = useParams()
  const { data: sprint, refetch: refetchSprint } = useSprint(sprintId, true)

  const [open, setOpen] = useState(false)

  return (
    <>
      {/* common header */}
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <div className='text-lg font-bold'>
            <Link to='/sprints' className='hover:underline hover:text-muted-foreground'>
              Sprints
            </Link>{' '}
            / {sprint?.id}
          </div>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='space-y-4'>
          <SprintPlanOverview sprint={sprint} refetchSprint={refetchSprint} />

          <SprintPlanKanban sprint={sprint} onPlan={() => setOpen(true)} />
        </div>

        <SprintPlanDialog open={open} onOpenChange={setOpen} sprint={sprint} />
      </Main>
    </>
  )
}

export default SprintPlanPage
