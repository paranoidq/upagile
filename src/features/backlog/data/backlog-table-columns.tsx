import React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { IconFlag3 } from '@tabler/icons-react'
import { PRIORITIES } from '@/consts/enums'
import { Ellipsis } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table/components/data-table-column-header'
import { DataTableRowAction } from '@/components/data-table/types'
import { Backlog, backlogTypes } from '../types'

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Backlog> | null>>
}

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<Backlog>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-0.5'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-0.5'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
      cell: ({ cell }) => <div className='w-[10px]'>{cell.getValue() as number}</div>,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='事项名称' />,
      cell: ({ row }) => {
        return <span className='max-w-[31.25rem] truncate'>{row.getValue('title')}</span>
      },
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => <DataTableColumnHeader column={column} title='预估优先级' />,
      cell: ({ row }) => {
        const priority = PRIORITIES.find((priority) => priority.value === row.original.priority)

        if (!priority) return null

        return (
          <div className='flex items-center'>
            <IconFlag3 className={cn('mr-2 size-4 text-muted-foreground', priority.color)} aria-hidden='true' />
            <span className='capitalize'>{priority.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'backlogType',
      header: ({ column }) => <DataTableColumnHeader column={column} title='事项类型' />,
      cell: ({ cell }) => {
        const backlogType = backlogTypes.find((backlogType) => backlogType.value === cell.getValue())

        if (!backlogType) return null

        return (
          <div className='w-[80px]'>
            <Badge variant='outline' className={cn('font-normal', backlogType.color)}>
              {backlogType.label}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: 'dueTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='截止时间' />,
      cell: ({ cell }) => <div className='w-[100px]'>{formatDate(cell.getValue() as Date)}</div>,
    },
    {
      accessorKey: 'estimatedTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='工作量' />,
      cell: ({ row }) => (
        <div className='w-[50px]'>
          {(row.getValue('estimatedTime') as number) < 0 ? '-' : row.getValue('estimatedTime') + 'h'}
        </div>
      ),
    },
    {
      accessorKey: 'createdTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='创建时间' />,
      cell: ({ cell }) => <div className='w-[100px]'>{formatDate(cell.getValue() as Date)}</div>,
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [isUpdatePending, startUpdateTransition] = React.useTransition()

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                <Ellipsis className='size-4' aria-hidden='true' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuItem onSelect={() => setRowAction({ row, type: 'update' })}>Edit</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setRowAction({ row, type: 'delete' })}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 40,
    },
  ]
}
