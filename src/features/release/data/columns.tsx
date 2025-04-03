import React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { IconCalendar } from '@tabler/icons-react'
import { Ellipsis } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table/components/data-table-column-header'
import { DataTableRowAction } from '@/components/data-table/types'
import { Release, releaseStatus } from '../types'

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Release> | null>>
}

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<Release>[] {
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
      cell: ({ cell }) => <div className='flex items-center gap-2 max-w-10'>{cell.getValue() as number}</div>,
      enableHiding: false,
      size: 10,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Release名称' />,
      cell: ({ row }) => {
        return (
          <div className='flex items-center gap-2 max-w-96'>
            <span className='truncate text-ellipsis'>{row.getValue('title')}</span>
            {/* <IconEdit className='size-4 bg-gray-200 rounded-full p-0.5' /> */}
          </div>
        )
      },
      minSize: 200,
      size: Number.MAX_SAFE_INTEGER,
    },
    {
      accessorKey: 'testTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='提测时间' />,
      cell: ({ cell }) => (
        <div className='flex items-center gap-2'>
          <IconCalendar className='size-4' />
          {formatDate(cell.getValue() as string) || '-'}
        </div>
      ),
      size: 10,
    },
    {
      accessorKey: 'releaseTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='发版时间' />,
      cell: ({ cell }) => (
        <div className='flex items-center gap-2'>
          <IconCalendar className='size-4' />
          {formatDate(cell.getValue() as string) || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'productionTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='发上线时间' />,
      cell: ({ cell }) => (
        <div className='flex items-center gap-2'>
          <IconCalendar className='size-4' />
          {formatDate(cell.getValue() as string) || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='状态' />,
      cell: ({ cell }) => {
        const statusValue = cell.getValue() as string
        const status = releaseStatus.find((s) => s.value === statusValue)

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
    },
    {
      accessorKey: 'application.name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='系统' />,
      cell: ({ row }) => <div className='max-w-36 truncate text-ellipsis'>{row.original.application.name}</div>,
    },
    {
      accessorKey: 'principal.name',
      header: ({ column }) => <DataTableColumnHeader column={column} title='负责人' />,
      cell: ({ row }) => (
        <div className='w-[50px] flex items-center gap-2'>
          {row.original.principal?.name && (
            <TooltipProvider key={row.original.principal.id} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className='h-6 w-6 cursor-pointer'>
                    <AvatarImage src={row.original.principal.avatar} />
                    <AvatarFallback className='bg-gray-200 text-gray-400 text-[10px] font-bold'>
                      {row.original.principal.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{row.original.principal.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ),
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
