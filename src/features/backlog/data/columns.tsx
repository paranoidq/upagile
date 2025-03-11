import { ColumnDef } from '@tanstack/react-table'
import { priorities } from '@/consts/enums'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/view-table/components/data-table-column-header'
import { DataTableRowActions } from '../../../components/view-table/components/data-table-row-actions'
import { Backlog, backlogTypes } from '../types'

export const columns: ColumnDef<Backlog>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Name' />,
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>{row.getValue('name')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Priority' />,
    cell: ({ row }) => {
      const priority = priorities.find((priority) => priority.value === row.getValue('priority'))

      if (!priority) {
        return null
      }

      return (
        <div className='flex items-center'>
          {priority.icon && <priority.icon className='mr-2 h-4 w-4 text-muted-foreground' />}
          <span>{priority.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'backlogType',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Backlog Type' />,
    cell: ({ row }) => (
      <div className='w-[80px]'>
        {backlogTypes.find((backlogType) => backlogType.value === row.getValue('backlogType'))?.label}
      </div>
    ),
  },
  {
    accessorKey: 'dueTime',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Due Time' />,
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('dueTime')}</div>,
  },
  {
    accessorKey: 'estimatedTime',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Estimated Time' />,
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('estimatedTime')}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
