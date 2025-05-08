import React, { type FC } from 'react'
import { IconCopyPlus, IconFlag3, IconPlus } from '@tabler/icons-react'
import { parseAsBoolean, useQueryState } from 'nuqs'
import { useCurrentTeam, useTeamStore } from '@/stores/teamStore'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DataTableSkeleton } from '@/components/data-table/components/data-table-skeleton'
import { FeatureFlagsProvider, useFeatureFlags } from '@/components/data-table/components/feature-flags-provider'
import { DataTable } from '@/components/data-table/data-table'
import { useDataTable } from '@/components/data-table/hooks/use-data-table'
import { DataTableAdvancedFilterField, DataTableFilterField, DataTableRowAction } from '@/components/data-table/types'
import { Header } from '@/components/layout/header.tsx'
import { Main } from '@/components/layout/main.tsx'
import { ProfileDropdown } from '@/components/profile-dropdown.tsx'
import { ThemeSwitch } from '@/components/theme-switch.tsx'
import { useReleases } from './_lib/services'
import { DeleteReleasesDialog } from './components/delete-dialog'
import { ReleaseTableFloatingBar } from './components/table-floating-bar'
import { UpdateReleaseSheet } from './components/update-sheet'
import { getColumns } from './data/columns'
import { Release, releaseStatus } from './types'

const ReleasePage: FC = () => {
  const { id: teamId } = useCurrentTeam()

  const { teams } = useTeamStore()
  const { data: releases, isLoading } = useReleases(teamId)

  // 获取当前工作区名称
  const workspaceName = teamId ? teams.find((t) => t.id === teamId)?.name || '工作区' : undefined

  return (
    <>
      {/* common header */}
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <span className='text-lg font-bold'>{workspaceName ? `${workspaceName} - Releases` : 'Releases'}</span>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <FeatureFlagsProvider>
          {isLoading ? <DataTableSkeleton columnCount={10} rowCount={10} /> : <ReleaseTable data={releases ?? []} />}
        </FeatureFlagsProvider>
      </Main>
    </>
  )
}

export default ReleasePage

type ReleaseTableProps = {
  data: Release[]
}

function ReleaseTable({ data: releases }: ReleaseTableProps) {
  const { featureFlags } = useFeatureFlags()

  const pageCount = releases?.length % 10 === 0 ? releases?.length / 10 : Math.floor(releases?.length / 10) + 1

  // display releases in 30 days
  const [showRecent, setShowRecent] = useQueryState('showRecent', parseAsBoolean.withDefault(false))

  const filteredReleases = React.useMemo(() => {
    if (!releases) return []
    if (showRecent) {
      return releases?.filter(
        (release) =>
          !release.testTime ||
          (release.testTime && new Date(release.testTime) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
      )
    }
    return releases
  }, [releases, showRecent])

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<Release> | null>(null)

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
  const filterFields: DataTableFilterField<Release>[] = [
    {
      id: 'title',
      label: 'Title',
      placeholder: 'Filter titles...',
    },
    {
      id: 'status',
      label: 'Status',
      options: releaseStatus.map((status) => ({
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
  const advancedFilterFields: DataTableAdvancedFilterField<Release>[] = [
    {
      id: 'title',
      label: 'Title',
      type: 'text',
    },
  ]

  const enableAdvancedTable = featureFlags.includes('advancedTable')
  const enableFloatingBar = featureFlags.includes('floatingBar')

  const { table } = useDataTable({
    data: filteredReleases,
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
      <DataTable table={table} floatingBar={enableFloatingBar ? <ReleaseTableFloatingBar table={table} /> : null}>
        <div className='flex justify-between gap-2'>
          <div className='items-center flex space-x-2'>
            {/* 仅展示近30天内的releases的勾选框 */}
            <Checkbox
              id='show-recent-releases'
              onCheckedChange={(checked) => {
                setShowRecent(checked === true)
              }}
            />
            <Label htmlFor='show-recent-releases'>Show recent 30 days releases</Label>
          </div>

          <div className='flex items-center'>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' onClick={() => setRowAction({ type: 'create' })}>
                    <IconPlus className='size-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Release</TooltipContent>
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

      <UpdateReleaseSheet
        open={rowAction?.type === 'update' || rowAction?.type === 'create'}
        onOpenChange={() => setRowAction(null)}
        release={rowAction?.row?.original ?? null}
      />

      <DeleteReleasesDialog
        open={rowAction?.type === 'delete'}
        onOpenChange={() => setRowAction(null)}
        releases={rowAction?.row?.original ? [rowAction?.row?.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row?.toggleSelected(false)}
      />
    </>
  )
}
