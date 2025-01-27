import { Table } from '@tanstack/react-table'
import { IconFilterCog } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '../components/data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchColumn?: string
}

export function DataTableToolbar<TData>({
  table,
  searchColumn,
}: DataTableToolbarProps<TData>) {
  return (
    <div className='flex items-center justify-between'>
      {/* toolbar */}
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* search */}
        {searchColumn && (
          <Input
            placeholder='Filter tasks...'
            value={
              (table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn(searchColumn)?.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}

        {/* view specs button */}
        <Button
          variant='outline'
          size='sm'
          className='ml-auto h-8 lg:flex'
          onClick={() => {}}
        >
          <IconFilterCog className='mr-2 h-4 w-4' />
          Filters
        </Button>

        {/* 筛选cols */}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
