import React, { type FC } from 'react'
import { TooltipTrigger } from '@radix-ui/react-tooltip'
import { IconCopyPlus, IconFlag3, IconPlus } from '@tabler/icons-react'
import { parseAsBoolean, parseAsString, useQueryState } from 'nuqs'
import { useNavigate } from 'react-router-dom'
import { useCurrentTeam, useTeamStore } from '@/stores/teamStore'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider } from '@/components/ui/tooltip'
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
import { UpdateOrCreateSprintSheet } from './components/update-sheet'
import { getColumns } from './data/columns'
import { Sprint, sprintStatus } from './types'

const SprintPage: FC = () => {
  const { id: teamId } = useCurrentTeam()
  const { teams } = useTeamStore()
  // 获取当前工作区名称
  const workspaceName = teamId ? teams.find((t) => t.id === teamId)?.name || '工作区' : undefined

  const { data: sprints, isLoading } = useSprints(teamId)

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
              {view === 'list' && <SprintTable data={sprints ?? []} />}

              {view === 'kanban' && <SprintKanban data={sprints ?? []} />}

              {view === 'calendar' && <SprintCalendar data={sprints ?? []} />}
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

  // display recent
  const [showRecent, setShowRecent] = useQueryState('showRecent', parseAsBoolean.withDefault(false))

  const filteredSprints = React.useMemo(() => {
    if (showRecent) {
      return sprints?.filter(
        (sprint) =>
          !sprint.startTime ||
          (sprint.startTime && new Date(sprint.startTime) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
      )
    }
    return sprints
  }, [sprints, showRecent])

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
    data: filteredSprints,
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
      <DataTable table={table} floatingBar={enableFloatingBar ? <SprintTableFloatingBar table={table} /> : null}>
        <div className='flex justify-between gap-2'>
          <div className='items-center flex space-x-2'>
            {/* 仅展示近30天内的releases的勾选框 */}
            <Checkbox
              id='showRecent'
              checked={showRecent}
              onCheckedChange={(checked) => {
                setShowRecent(checked === true)
              }}
            />
            <Label htmlFor='showRecent'>Show recent 30 days sprints</Label>
          </div>

          <div className='flex items-center'>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' onClick={() => setRowAction({ type: 'create' })}>
                    <IconPlus className='size-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Issue</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <IconCopyPlus className='size-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Batch create</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </DataTable>

      <UpdateOrCreateSprintSheet
        open={rowAction?.type === 'update' || rowAction?.type === 'create'}
        onOpenChange={() => setRowAction(null)}
        sprint={rowAction?.row?.original ?? null}
      />

      <DeleteSprintsDialog
        open={rowAction?.type === 'delete'}
        onOpenChange={() => setRowAction(null)}
        sprints={rowAction?.row?.original ? [rowAction?.row?.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row?.toggleSelected(false)}
      />
    </>
  )
}
