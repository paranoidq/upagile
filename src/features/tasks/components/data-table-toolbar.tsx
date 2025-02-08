import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { ViewType } from '@/features/tasks/types.ts'
import { DataTableViewOptions } from '../components/data-table-view-options'
import { FilterToolbar } from './toolbar/filter-toolbar'
import { GroupToolbar } from './toolbar/group-toolbar'
import { SortToolbar } from './toolbar/sort-toolbar'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchColumn?: string
  currentView?: ViewType
}

interface Condition {
  field?: string
  operator?: string
  value?: string
  direction?: 'asc' | 'desc'

  [key: string]: string | undefined // 添加索引签名以修复类型错误
}

export function DataTableToolbar<TData>({ table, searchColumn, currentView }: DataTableToolbarProps<TData>) {
  const [openFilterDialog, setOpenFilterDialog] = useState(false)
  const [openSortDialog, setOpenSortDialog] = useState(false)
  const [openGroupDialog, setOpenGroupDialog] = useState(false)

  const initialSortConditions =
    currentView?.conditions?.sorts?.map((sort) => ({
      field: sort.field,
      direction: sort.direction,
    })) || []

  const initialGroupConditions =
    currentView?.conditions?.groups?.map((group) => ({
      field: group.field,
      direction: group.direction,
    })) || []

  const getSortFormValues = (conditions: Condition[]) =>
    conditions?.reduce(
      (acc, sort, index) => {
        acc[`field-${index}`] = sort.field || ''
        acc[`direction-${index}`] = sort.direction || 'asc'
        return acc
      },
      {} as Record<string, string>,
    ) || {}

  const getGroupFormValues = (conditions: Condition[]) =>
    conditions?.reduce(
      (acc, group, index) => {
        acc[`field-${index}`] = group.field || ''
        acc[`direction-${index}`] = group.direction || 'asc'
        return acc
      },
      {} as Record<string, string>,
    ) || {}

  const sortForm = useForm({
    defaultValues: {
      ...getSortFormValues(initialSortConditions),
      ...Array(10 - initialSortConditions.length)
        .fill(0)
        .reduce(
          (acc, _, i) => ({
            ...acc,
            [`field-${i + initialSortConditions.length}`]: '',
            [`direction-${i + initialSortConditions.length}`]: 'asc',
          }),
          {},
        ),
    },
  })

  const groupForm = useForm({
    defaultValues: {
      ...getGroupFormValues(initialGroupConditions),
      ...Array(10 - initialGroupConditions.length)
        .fill(0)
        .reduce(
          (acc, _, i) => ({
            ...acc,
            [`field-${i + initialGroupConditions.length}`]: '',
            [`direction-${i + initialGroupConditions.length}`]: 'asc',
          }),
          {},
        ),
    },
  })

  const resetToInitialValues = () => {
    setFilterConditions(initialFilterConditions)
    setSortConditions(initialSortConditions)
    setGroupConditions(initialGroupConditions)

    filterForm.reset({
      ...getFilterFormValues(initialFilterConditions),
      ...Array(10 - initialFilterConditions.length)
        .fill(0)
        .reduce(
          (acc, _, i) => ({
            ...acc,
            [`field-${i + initialFilterConditions.length}`]: '',
            [`operator-${i + initialFilterConditions.length}`]: '',
            [`value-${i + initialFilterConditions.length}`]: '',
          }),
          {},
        ),
    })
    sortForm.reset({
      ...getSortFormValues(initialSortConditions),
      ...Array(10 - initialSortConditions.length)
        .fill(0)
        .reduce(
          (acc, _, i) => ({
            ...acc,
            [`field-${i + initialSortConditions.length}`]: '',
            [`direction-${i + initialSortConditions.length}`]: 'asc',
          }),
          {},
        ),
    })
    groupForm.reset({
      ...getGroupFormValues(initialGroupConditions),
      ...Array(10 - initialGroupConditions.length)
        .fill(0)
        .reduce(
          (acc, _, i) => ({
            ...acc,
            [`field-${i + initialGroupConditions.length}`]: '',
            [`direction-${i + initialGroupConditions.length}`]: 'asc',
          }),
          {},
        ),
    })
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* search input */}
        {searchColumn && (
          <Input
            placeholder='Filter tasks...'
            value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(searchColumn)?.setFilterValue(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}

        <FilterToolbar
          table={table}
          open={openFilterDialog}
          onOpenChange={setOpenFilterDialog}
          currentView={currentView}
        />

        <SortToolbar table={table} open={openSortDialog} onOpenChange={setOpenSortDialog} currentView={currentView} />

        <GroupToolbar
          table={table}
          open={openGroupDialog}
          onOpenChange={setOpenGroupDialog}
          currentView={currentView}
        />

        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
