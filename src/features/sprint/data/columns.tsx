import React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { IconCalendar } from '@tabler/icons-react'
import { Ellipsis } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table/components/data-table-column-header'
import { DataTableRowAction } from '@/components/data-table/types'
import { Sprint, sprintStatus } from '../types'

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Sprint> | null>>
}

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<Sprint>[] {
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
      cell: ({ cell }) => <div className='flex items-center gap-2'>{cell.getValue() as number}</div>,
      enableHiding: false,
      size: 100,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Sprint名称' />,
      cell: ({ row }) => {
        return (
          <div className='flex items-center gap-2'>
            <span className='max-w-[400px] truncate text-ellipsis'>{row.getValue('title')}</span>
            {/* <IconEdit className='size-4 bg-gray-200 rounded-full p-0.5' /> */}
          </div>
        )
      },
    },
    {
      accessorKey: 'startTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='开始时间' />,
      cell: ({ cell }) => (
        <div className='flex items-center gap-2'>
          <IconCalendar className='size-4' />
          {formatDate(cell.getValue() as string)}
        </div>
      ),
    },
    {
      accessorKey: 'endTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='结束时间' />,
      cell: ({ cell }) => (
        <div className='flex items-center gap-2'>
          <IconCalendar className='size-4' />
          {formatDate(cell.getValue() as string)}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='状态' />,
      cell: ({ cell }) => {
        const statusValue = cell.getValue() as string
        const status = sprintStatus.find((s) => s.value === statusValue)

        return (
          <div className='flex items-center gap-2'>
            <div
              className={`flex h-4 w-4 px-0.5 font-extrabold items-center justify-center rounded-full ${status?.color || ''} text-white`}
            >
              {status?.icon}
            </div>
            <span className='inline-flex items-center'>{status?.label || statusValue}</span>
          </div>
        )
      },
      size: 100,
    },
    {
      accessorKey: 'team.id',
      header: ({ column }) => <DataTableColumnHeader column={column} title='归属团队' />,
      cell: ({ row }) => <div className='w-[100px]'>{row.original.team.name}</div>,
    },
    {
      accessorKey: 'createdTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='创建时间' />,
      cell: ({ cell }) => <div className='w-[100px]'>{formatDate(cell.getValue() as Date)}</div>,
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
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
