import React, { type FC } from 'react'
import { IconFlag3 } from '@tabler/icons-react'
import { PRIORITIES } from '@/consts/enums'
import { DataTableSkeleton } from '@/components/data-table/components/data-table-skeleton'
import { FeatureFlagsProvider, useFeatureFlags } from '@/components/data-table/components/feature-flags-provider'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/components/data-table/hooks/use-data-table'
import { DataTableAdvancedFilterField, DataTableFilterField, DataTableRowAction } from '@/components/data-table/types'
import { Header } from '@/components/layout/header.tsx'
import { Main } from '@/components/layout/main.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { BacklogTableFloatingBar } from './components/backlog-table-floating-bar'
import { DeleteBacklogsDialog } from './components/delete-backlog-dialog'
import { UpdateBacklogSheet } from './components/update-backlog-sheet'
import { getColumns } from './data/backlog-table-columns'
import { useBacklogs } from './services'
import { Backlog } from './types'

const BacklogPage: FC = () => {
  const { data: backlogs, isLoading } = useBacklogs()

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
        <FeatureFlagsProvider>
          {isLoading ? <DataTableSkeleton columnCount={10} rowCount={10} /> : <BacklogTable data={backlogs} />}
        </FeatureFlagsProvider>
      </Main>
    </>
  )
}

export default BacklogPage

type BacklogTableProps = {
  data: Backlog[]
}

function BacklogTable({ data: backlogs }: BacklogTableProps) {
  const { featureFlags } = useFeatureFlags()

  const pageCount = backlogs?.length % 10 === 0 ? backlogs?.length / 10 : Math.floor(backlogs?.length / 10) + 1

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Backlog> | null>(null)

  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  /**
   * This component can render either a faceted filter or a search filter based on the `options` prop.
   *
   * @prop options - An array of objects, each representing a filter option. If provided, a faceted filter is rendered. If not, a search filter is rendered.
   *
   * Each `option` object has the following properties:
   * @prop {string} label - The label for the filter option.
   * @prop {string} value - The value for the filter option.
   * @prop {React.ReactNode} [icon] - An optional icon to display next to the label.
   * @prop {boolean} [withCount] - An optional boolean to display the count of the filter option.
   */
  const filterFields: DataTableFilterField<Backlog>[] = [
    {
      id: 'title',
      label: 'Title',
      placeholder: 'Filter titles...',
    },
    {
      id: 'priority',
      label: 'Priority',
      options: PRIORITIES.map((priority) => ({
        label: priority.label,
        value: priority.value,
        icon: IconFlag3,
        color: priority.color,
        count: 0,
      })),
    },
  ]

  /**
   * Advanced filter fields for the data table.
   * These fields provide more complex filtering options compared to the regular filterFields.
   *
   * Key differences from regular filterFields:
   * 1. More field types: Includes 'text', 'multi-select', 'date', and 'boolean'.
   * 2. Enhanced flexibility: Allows for more precise and varied filtering options.
   * 3. Used with DataTableAdvancedToolbar: Enables a more sophisticated filtering UI.
   * 4. Date and boolean types: Adds support for filtering by date ranges and boolean values.
   */
  const advancedFilterFields: DataTableAdvancedFilterField<Backlog>[] = [
    {
      id: 'title',
      label: 'Title',
      type: 'text',
    },
    {
      id: 'priority',
      label: 'Priority',
      type: 'multi-select',
      options: PRIORITIES.map((priority) => ({
        label: priority.label,
        value: priority.value,
        icon: IconFlag3,
        color: priority.color,
        count: 0,
      })),
    },
    {
      id: 'createdTime',
      label: 'Created at',
      type: 'date',
    },
  ]

  const enableAdvancedTable = featureFlags.includes('advancedTable')
  const enableFloatingBar = featureFlags.includes('floatingBar')

  const { table } = useDataTable({
    data: backlogs,
    columns,
    pageCount,
    filterFields,
    enableAdvancedFilter: enableAdvancedTable,
    initialState: {
      sorting: [{ id: 'createdTime', desc: true }],
      columnPinning: { right: ['actions'] },
    },
    getRowId: (originalRow) => originalRow.id,
    shallow: false,
    clearOnDefault: true,
  })

  return (
    <>
      <DataTable table={table} floatingBar={enableFloatingBar ? <BacklogTableFloatingBar table={table} /> : null}>
        {/* {enableAdvancedTable ? (
          <DataTableAdvancedToolbar table={table} filterFields={advancedFilterFields} shallow={false}>
            <TasksTableToolbarActions table={table} />
          </DataTableAdvancedToolbar>
        ) : (
          <DataTableToolbar table={table} filterFields={filterFields}>
            <TasksTableToolbarActions table={table} />
          </DataTableToolbar>
        )} */}
      </DataTable>

      <UpdateBacklogSheet
        open={rowAction?.type === 'update'}
        onOpenChange={() => setRowAction(null)}
        backlog={rowAction?.row.original ?? null}
      />

      <DeleteBacklogsDialog
        open={rowAction?.type === 'delete'}
        onOpenChange={() => setRowAction(null)}
        backlogs={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  )
}
