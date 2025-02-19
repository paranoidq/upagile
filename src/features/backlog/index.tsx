import { type FC } from 'react'
import { Header } from '@/components/layout/header.tsx'
import { Main } from '@/components/layout/main.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { Search } from '@/components/search.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { ViewTablePrimaryButtons } from '@/components/view-table/components/view-table-primary-buttons'
import { ViewTable } from '@/components/view-table/view-table'
import ViewTableProvider from '@/components/view-table/view-table-context'
import { BacklogDialogs } from './components/backlog-dialogs'
import { backlogs } from './data/backlogs'
import { columns } from './data/columns'
import { BacklogType } from './types'

const Backlog: FC = () => {
  return (
    <>
      {/* common header */}
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <ViewTableProvider<BacklogType>>
          {/* title and button */}
          <div className='mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Backlogs</h2>
              <p className='text-muted-foreground'>可以在这里收集你的任何想法和未决事项哦 😀</p>
            </div>

            <ViewTablePrimaryButtons />
          </div>

          {/* view table*/}
          <ViewTable data={backlogs} columns={columns} searchColumn='title' />

          {/* customized dialogs */}
          <BacklogDialogs />
        </ViewTableProvider>
      </Main>
    </>
  )
}

export default Backlog
