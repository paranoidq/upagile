import React, { useMemo, type FC } from 'react'
import { PRIORITIES } from '@/consts/enums'
import { useViews } from '@/components/advance-table/components/actions/view-services'
import { DataTable } from '@/components/advance-table/components/data-table'
import { DataTableSkeleton } from '@/components/advance-table/components/data-table-skeleton'
import { DataTableToolbar } from '@/components/advance-table/components/data-table-toolbar'
import { DataTableViewList } from '@/components/advance-table/components/data-table-view-list'
import { useDataTable } from '@/components/advance-table/hooks/use-data-table'
import { TableInstanceProvider } from '@/components/advance-table/table-instance-provider'
import { DataTableFilterField, DataTableGroupField, DataTableSortField } from '@/components/advance-table/types'
import { Header } from '@/components/layout/header.tsx'
import { Main } from '@/components/layout/main.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { BacklogTableFloatingBar } from './components/backlog-table-floating-bar'
import { BacklogToolbarActions } from './components/backlog-toolbar-actions'
import { getColumns } from './data/backlog-table-columns'
import { useBacklogs } from './services'
import { Backlog, backlogTypes } from './types'

const BacklogPage: FC = () => {
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
      <Main>
        <BacklogTable />
      </Main>
    </>
  )
}

const BacklogTable = () => {
  const { data: backlogs, isPending } = useBacklogs()
  const { data: views } = useViews()
  const columns = useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<Backlog>[] = [
    {
      label: 'Title',
      value: 'title',
      placeholder: 'Filter titles...',
    },
    {
      label: 'Priority',
      value: 'priority',
      options: PRIORITIES.map((priority) => ({
        label: priority.label,
        value: priority.value,
        icon: React.createElement(priority.icon),
        withCount: true,
      })),
    },
    {
      label: 'Type',
      value: 'backlogType',
      options: backlogTypes.map((type) => ({
        label: type.label,
        value: type.value,
        withCount: true,
      })),
    },
    {
      label: 'Deadline',
      value: 'dueTime',
      placeholder: 'Filter deadlines...',
    },
    {
      label: 'Created Time',
      value: 'createdTime',
      placeholder: 'Filter created times...',
    },
    {
      label: 'Estimated Time',
      value: 'estimatedTime',
      placeholder: 'Filter estimated times...',
    },
  ]

  const sortFields: DataTableSortField<Backlog>[] = [
    {
      label: 'Priority',
      value: 'priority',
    },
    {
      label: 'Deadline',
      value: 'dueTime',
    },
    {
      label: 'Estimated Time',
      value: 'estimatedTime',
    },
  ]

  const groupFields: DataTableGroupField<Backlog>[] = [
    {
      label: 'Priority',
      value: 'priority',
    },
  ]

  const { table } = useDataTable({
    data: backlogs ?? [],
    columns: columns,
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
        {/* view list and toolbar actions */}
        <DataTableViewList views={views ?? []}>
          <BacklogToolbarActions table={table} />
        </DataTableViewList>

        {/* toolbar */}
        <DataTableToolbar
          sortFields={sortFields}
          filterFields={filterFields}
          groupFields={groupFields}
          currentView={currentView}
        ></DataTableToolbar>

        {/* table */}
        <DataTable table={table} floatingBar={<BacklogTableFloatingBar table={table} />}></DataTable>
      </TableInstanceProvider>
    </>
  )
}

export default BacklogPage
