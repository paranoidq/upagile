import React, { type FC } from 'react'
import { priorities } from '@/consts/enums'
import { toast } from 'sonner'
import { DataTable } from '@/components/advance-table/components/data-table'
import { DataTableSkeleton } from '@/components/advance-table/components/data-table-skeleton'
import { useDataTable } from '@/components/advance-table/hooks/use-data-table'
import { TableInstanceProvider } from '@/components/advance-table/table-instance-provider'
import { DataTableFilterField } from '@/components/advance-table/types'
import { Header } from '@/components/layout/header.tsx'
import { Main } from '@/components/layout/main.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { useViews } from '../tasks/services/view-services'
import { BacklogTableFloatingBar } from './components/backlog-table-floating-bar'
import { useBacklogs } from './services'
import { Backlog } from './types'

const BacklogPage: FC = () => {
  const { data: views } = useViews()
  const { data: backlogs, isPending, isSuccess, isError } = useBacklogs()

  if (isError) {
    toast.error('Failed to fetch backlogs')
  }

  return (
    <>
      {/* common header */}
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <span className='text-lg font-bold'>Backlogs</span>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>{isSuccess && <BacklogTable />}</Main>
    </>
  )
}

const BacklogTable = () => {
  const { data: backlogs, isPending } = useBacklogs()
  const { data: views } = useViews()

  const filterFields: DataTableFilterField<Backlog>[] = [
    {
      label: 'Title',
      value: 'title',
      placeholder: 'Filter titles...',
    },
    {
      label: 'Priority',
      value: 'priority',
      options: priorities.map((priority) => ({
        label: priority.label,
        value: priority.value,
        icon: React.createElement(priority.icon),
        withCount: true,
      })),
    },
  ]

  const { table } = useDataTable({
    data: backlogs ?? [],
    columns: [],
    pageCount: 10,
    // optional props
    filterFields,
    defaultPerPage: 10,
    defaultSort: 'modifiedTime.desc',
  })

  return (
    <>
      {isPending && (
        <DataTableSkeleton columnCount={5} cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem']} shrinkZero />
      )}

      <TableInstanceProvider table={table}>
        <DataTable table={table} floatingBar={<BacklogTableFloatingBar table={table} />}>
          {/* <DataTableAdvancedToolbar filterFields={filterFields} views={views}>
            <BacklogToolbarActions table={table} />
          </DataTableAdvancedToolbar> */}
        </DataTable>
      </TableInstanceProvider>
    </>
  )
}

export default BacklogPage
