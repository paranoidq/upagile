import React, { type FC } from 'react'
import { IconFlag3 } from '@tabler/icons-react'
import { DataTableSkeleton } from '@/components/data-table/components/data-table-skeleton'
import { FeatureFlagsProvider, useFeatureFlags } from '@/components/data-table/components/feature-flags-provider'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/components/data-table/hooks/use-data-table'
import { DataTableAdvancedFilterField, DataTableFilterField, DataTableRowAction } from '@/components/data-table/types'
import { Header } from '@/components/layout/header.tsx'
import { Main } from '@/components/layout/main.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { useIssues } from './_lib/services'
import { DeleteIssuesDialog } from './components/delete-dialog'
import { IssueTableFloatingBar } from './components/table-floating-bar'
import { UpdateIssueSheet } from './components/update-sheet'
import { getColumns } from './data/columns'
import { Issue, issueStatus } from './types'

const IssuePage: FC = () => {
  const { data: issues, isLoading } = useIssues()

  return (
    <>
      {/* common header */}
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <span className='text-lg font-bold'>Issues</span>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <FeatureFlagsProvider>
          {isLoading ? <DataTableSkeleton columnCount={10} rowCount={10} /> : <IssueTable data={issues ?? []} />}
        </FeatureFlagsProvider>
      </Main>
    </>
  )
}

export default IssuePage

type IssueTableProps = {
  data: Issue[]
}

function IssueTable({ data: issues }: IssueTableProps) {
  const { featureFlags } = useFeatureFlags()

  const pageCount = issues?.length % 10 === 0 ? issues?.length / 10 : Math.floor(issues?.length / 10) + 1

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Issue> | null>(null)

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
  const filterFields: DataTableFilterField<Issue>[] = [
    {
      id: 'title',
      label: 'Title',
      placeholder: 'Filter titles...',
    },
    {
      id: 'status',
      label: 'Status',
      options: issueStatus.map((status) => ({
        label: status.label,
        value: status.value,
        icon: IconFlag3,
        color: status.color,
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
  const advancedFilterFields: DataTableAdvancedFilterField<Issue>[] = [
    {
      id: 'title',
      label: 'Title',
      type: 'text',
    },
  ]

  const enableAdvancedTable = featureFlags.includes('advancedTable')
  const enableFloatingBar = featureFlags.includes('floatingBar')

  const { table } = useDataTable({
    data: issues,
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
      <DataTable table={table} floatingBar={enableFloatingBar ? <IssueTableFloatingBar table={table} /> : null}>
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

      <UpdateIssueSheet
        open={rowAction?.type === 'update'}
        onOpenChange={(_) => setRowAction(null)}
        issue={rowAction?.row.original ?? null}
      />

      <DeleteIssuesDialog
        open={rowAction?.type === 'delete'}
        onOpenChange={() => setRowAction(null)}
        issues={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  )
}
