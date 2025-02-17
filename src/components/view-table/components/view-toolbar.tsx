import { DividerVerticalIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { BaseData, ViewType } from '../types'
import { ColumnVisibility } from './toolbar/column-visibility'
import { FilterToolbar } from './toolbar/filter-toolbar'
import { GroupToolbar } from './toolbar/group-toolbar'
import { SortToolbar } from './toolbar/sort-toolbar'

interface ViewToolbarProps<TData extends BaseData> {
  currentView?: ViewType
  table: Table<TData>
  toolbar: {
    filter?: boolean
    sort?: boolean
    group?: boolean
    columnVisibility?: boolean
  }
  onViewUpdate?: (view: ViewType) => Promise<void>
}

export function ViewToolbar<TData extends BaseData>({
  currentView,
  table,
  toolbar,
  onViewUpdate,
}: ViewToolbarProps<TData>) {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {table.getColumn('title') && (
          <Input
            placeholder='搜索...'
            value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}

        {toolbar.filter && <FilterToolbar currentView={currentView} onUpdate={onViewUpdate} />}

        {toolbar.sort && <SortToolbar currentView={currentView} onUpdate={onViewUpdate} />}

        {toolbar.group && <GroupToolbar currentView={currentView} onUpdate={onViewUpdate} />}

        <DividerVerticalIcon className='h-4 w-4 text-muted-foreground' />

        {toolbar.columnVisibility && <ColumnVisibility table={table} />}
      </div>
    </div>
  )
}
