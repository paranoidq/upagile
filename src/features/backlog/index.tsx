import React, { type FC } from 'react'
import { IconFlag3 } from '@tabler/icons-react'
import { PRIORITIES } from '@/consts/enums'
import { DataTableSkeleton } from '@/components/data-table/component/data-table-skeleton'
import { DataTableAdvancedFilterField, DataTableFilterField, DataTableRowAction } from '@/components/data-table/types'
import { Header } from '@/components/layout/header.tsx'
import { Main } from '@/components/layout/main.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { getColumns } from './data/backlog-table-columns'
import { listBacklogs } from './services'
import { Backlog } from './types'

const BacklogPage: FC = () => {
  const promise = listBacklogs()

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
        <React.Suspense fallback={<DataTableSkeleton columnCount={10} rowCount={10} />}>
          <BacklogTable promises={promise} />
        </React.Suspense>
      </Main>
    </>
  )
}

export default BacklogPage

type BacklogTableProps = {
  promises: Promise<Backlog[]>
}

function BacklogTable({ promises }: BacklogTableProps) {
  const [backlogs] = React.use(promises)

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

  return <div></div>
}
