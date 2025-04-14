import React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { IconCalendar, IconLayoutKanban, IconPencil, IconTrash } from '@tabler/icons-react'
import { Tooltip } from 'antd'
import { Ellipsis } from 'lucide-react'
import { NavigateFunction } from 'react-router-dom'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table/components/data-table-column-header'
import { DataTableRowAction } from '@/components/data-table/types'
import { Sprint, sprintStatus } from '../types'

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Sprint> | null>>
  navigate: NavigateFunction
}

export function getColumns({ setRowAction, navigate }: GetColumnsProps): ColumnDef<Sprint>[] {
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
      cell: ({ cell }) => <div className='flex items-center gap-2 max-w-4'>{cell.getValue() as number}</div>,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Sprint名称' />,
      cell: ({ row }) => {
        return (
          <div className='flex items-center gap-2'>
            <span className='w-96 truncate text-ellipsis'>{row.getValue('title')}</span>
            {/* <IconEdit className='size-4 bg-gray-200 rounded-full p-0.5' /> */}
          </div>
        )
      },
      enableSorting: false,
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
      enableSorting: false,
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
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='状态' />,
      cell: ({ cell }) => {
        const statusValue = cell.getValue() as string
        const status = sprintStatus.find((s) => s.value === statusValue)

        return (
          <div className='flex items-center gap-2 w-24'>
            <div
              className={`flex h-4 w-4 px-0.5 font-extrabold items-center justify-center rounded-full ${status?.color || ''} text-white`}
            >
              {status?.icon}
            </div>
            <span className='inline-flex items-center'>{status?.label || statusValue}</span>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: 'team.id',
      header: ({ column }) => <DataTableColumnHeader column={column} title='归属团队' />,
      cell: ({ row }) => <div className='w-[100px]'>{row.original.team.name}</div>,
      enableSorting: false,
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        return (
          <div className='flex items-center gap-0'>
            {/* plan action */}
            <Tooltip title='plan sprint issues'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                  navigate(`/sprints/${row.original.id}`)
                }}
              >
                <IconLayoutKanban className='size-4' />
              </Button>
            </Tooltip>

            {/* edit action */}
            <Tooltip title='edit sprint'>
              <Button variant='ghost' size='icon' onClick={() => setRowAction({ row, type: 'update' })}>
                <IconPencil className='size-4' />
              </Button>
            </Tooltip>

            {/* delete action */}
            <Tooltip title='remove sprint'>
              <Button variant='ghost' size='icon' onClick={() => setRowAction({ row, type: 'delete' })}>
                <IconTrash className='size-4 text-red-500' />
              </Button>
            </Tooltip>

            {/* other actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label='Open menu' variant='ghost' size='icon'>
                  <Ellipsis className='size-4' aria-hidden='true' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {/* <DropdownMenuItem>
                  <IconPencil className='size-4' />
                  Edit
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}
