import React, { type FC } from 'react'
import { IconCopyPlus, IconFlag3, IconPlus } from '@tabler/icons-react'
import { Tooltip } from 'antd'
import { parseAsBoolean, parseAsString, useQueryState } from 'nuqs'
import { useNavigate, useParams } from 'react-router-dom'
import { useTeamStore } from '@/stores/teamStore'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTableSkeleton } from '@/components/data-table/components/data-table-skeleton'
import { FeatureFlagsProvider, useFeatureFlags } from '@/components/data-table/components/feature-flags-provider'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/components/data-table/hooks/use-data-table'
import { DataTableAdvancedFilterField, DataTableFilterField, DataTableRowAction } from '@/components/data-table/types'
import { Header } from '@/components/layout/header.tsx'
import { Main } from '@/components/layout/main.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { useSprints } from './_lib/services'
import { DeleteSprintsDialog } from './components/delete-dialog'
import SprintCalendar from './components/sprint-calendar'
import SprintKanban from './components/sprint-kanban'
import { SprintTableFloatingBar } from './components/table-floating-bar'
import { UpdateSprintSheet } from './components/update-sheet'
import { getColumns } from './data/columns'
import { Sprint, sprintStatus } from './types'

const SprintPage: FC = () => {
  const { teamId } = useParams()
  const { teams } = useTeamStore()
  // 获取当前工作区名称
  const workspaceName = teamId ? teams.find((t) => t.id === teamId)?.name || '工作区' : undefined

  const { data: sprints, isLoading } = useSprints()

  // 根据团队 ID 过滤数据
  const filteredSprints = React.useMemo(() => {
    if (!sprints) return []
    if (!teamId) return sprints

    return sprints.filter((sprint) => sprint.team?.id === teamId)
  }, [sprints, teamId])

  // view
  const [view, setView] = useQueryState('view', parseAsString.withDefault('list'))

  return (
    <>
      {/* common header */}
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <div className='text-lg font-bold'>{workspaceName ? `${workspaceName} - Sprints` : 'Sprints'}</div>
          <div>
            <Tabs value={view} onValueChange={(value) => setView(value)}>
              <TabsList>
                <TabsTrigger value='list'>List</TabsTrigger>
                <TabsTrigger value='kanban'>Kanban</TabsTrigger>
                <TabsTrigger value='calendar'>Calendar</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <FeatureFlagsProvider>
          {isLoading ? (
            <DataTableSkeleton columnCount={6} rowCount={10} />
          ) : (
            <>
              {view === 'list' && <SprintTable data={filteredSprints ?? []} />}

              {view === 'kanban' && <SprintKanban data={filteredSprints ?? []} />}

              {view === 'calendar' && <SprintCalendar data={filteredSprints ?? []} />}
            </>
          )}
        </FeatureFlagsProvider>
      </Main>
    </>
  )
}

export default SprintPage

type SprintTableProps = {
  data: Sprint[]
}

function SprintTable({ data: sprints }: SprintTableProps) {
  const { featureFlags } = useFeatureFlags()
  const navigate = useNavigate()

  const pageCount = sprints?.length % 10 === 0 ? sprints?.length / 10 : Math.floor(sprints?.length / 10) + 1

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Sprint> | null>(null)

  const columns = React.useMemo(() => getColumns({ setRowAction, navigate }), [])

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
  const filterFields: DataTableFilterField<Sprint>[] = [
    {
      id: 'title',
      label: 'Title',
      placeholder: 'Filter titles...',
    },
    {
      id: 'status',
      label: 'Status',
      options: sprintStatus.map((status) => ({
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
  const advancedFilterFields: DataTableAdvancedFilterField<Sprint>[] = [
    {
      id: 'title',
      label: 'Title',
      type: 'text',
    },
  ]

  const enableAdvancedTable = featureFlags.includes('advancedTable')
  const enableFloatingBar = featureFlags.includes('floatingBar')

  const { table } = useDataTable({
    data: sprints,
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

  // display recent
  const [displayRecent, setDisplayRecent] = useQueryState('displayRecent', parseAsBoolean.withDefault(true))

  return (
    <>
      <DataTable table={table} floatingBar={enableFloatingBar ? <SprintTableFloatingBar table={table} /> : null}>
        <div className='flex justify-between gap-2'>
          <div className='items-center flex space-x-2'>
            <Switch
              id='displayOnlyRecent'
              checked={displayRecent}
              onCheckedChange={(value) => setDisplayRecent(value)}
            />
            <label htmlFor='displayOnlyRecent' className=' text-gray-500'>
              Only show recent sprints
            </label>
          </div>

          <div className='flex items-center'>
            <Tooltip title='New Sprint'>
              <Button variant='ghost' size='icon'>
                <IconPlus className='size-4' />
              </Button>
            </Tooltip>

            <Tooltip title='Batch create'>
              <Button variant='ghost' size='icon'>
                <IconCopyPlus className='size-4' />
              </Button>
            </Tooltip>
          </div>
        </div>
      </DataTable>

      <UpdateSprintSheet
        open={rowAction?.type === 'update'}
        onOpenChange={() => setRowAction(null)}
        sprint={rowAction?.row.original ?? null}
      />

      <DeleteSprintsDialog
        open={rowAction?.type === 'delete'}
        onOpenChange={() => setRowAction(null)}
        sprints={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  )
}
