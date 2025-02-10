import { useState } from 'react'
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
export function DataTableToolbar<TData>({ table, searchColumn, currentView }: DataTableToolbarProps<TData>) {
  const [openFilterDialog, setOpenFilterDialog] = useState(false)
  const [openSortDialog, setOpenSortDialog] = useState(false)
  const [openGroupDialog, setOpenGroupDialog] = useState(false)

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
