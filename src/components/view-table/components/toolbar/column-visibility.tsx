import { Table } from '@tanstack/react-table'
import { FilesIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { BaseData } from '../../types'

interface ColumnVisibilityProps<TData extends BaseData> {
  table: Table<TData>
}

export function ColumnVisibility<TData extends BaseData>({ table }: ColumnVisibilityProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='ml-auto h-8'>
          <FilesIcon className='mr-2 h-4 w-4' />
          显示列
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className='capitalize'
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
