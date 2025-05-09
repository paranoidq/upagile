import React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import {
  IconCalendar,
  IconCube,
  IconEye,
  IconFlag3Filled,
  IconPencil,
  IconTrash,
  IconUserCircle,
} from '@tabler/icons-react'
import { PRIORITIES } from '@/consts/enums'
import { cn, formatDate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DataTableColumnHeader } from '@/components/data-table/components/data-table-column-header'
import { DataTableRowAction } from '@/components/data-table/types'
import { Issue, issueStatus, issueType } from './types'

interface GetColumnsProps {
  setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Issue> | null>>
}

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<Issue>[] {
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
      header: ({ column }) => <DataTableColumnHeader column={column} title='Issue名称' />,
      cell: ({ row }) => {
        return (
          <div className='flex items-center gap-2'>
            <span className='max-w-[400px] truncate text-ellipsis'>{row.getValue('title')}</span>
            {/* <IconEdit className='size-4 bg-gray-200 rounded-full p-0.5' /> */}
          </div>
        )
      },
      size: Number.MAX_SAFE_INTEGER,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title='类型' />,
      cell: ({ cell }) => {
        const typeValue = cell.getValue() as string
        const type = issueType.find((t) => t.value === typeValue)
        return (
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className={cn('text-white font-semibold', type?.color)}>
              {type?.label || typeValue}
            </Badge>
          </div>
        )
      },
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => <DataTableColumnHeader column={column} title='优先级' />,
      cell: ({ row }) => {
        const priority = PRIORITIES.find((priority) => priority.value === row.original.priority)

        if (!priority) return null

        return (
          <div className='flex items-center gap-2'>
            <IconFlag3Filled
              className={cn('size-4 text-muted-foreground cursor-pointer', priority.color)}
              aria-hidden='true'
            />
            <span className='capitalize'>{priority.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title='状态' />,
      cell: ({ cell }) => {
        const statusValue = cell.getValue() as string
        const status = issueStatus.find((s) => s.value === statusValue)

        return (
          <div className='flex items-center gap-2 w-[100px]'>
            <div
              className={`flex size-4 px-0.5 font-extrabold items-center justify-center cursor-pointer rounded-full ${status?.color || ''} text-white`}
            >
              {status?.icon}
            </div>
            <span className='inline-flex items-center'>{status?.label || statusValue}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'assignee.id',
      header: ({ column }) => <DataTableColumnHeader column={column} title='负责人' />,
      cell: ({ row }) => {
        const assignee = row.original.assignee
        return (
          <div className='w-[150px] flex items-center gap-2'>
            <TooltipProvider key={assignee?.id} delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className='h-6 w-6 cursor-pointer'>
                    <AvatarImage src={row.original.assignee?.avatar} />
                    <AvatarFallback className='bg-transparent text-gray-400'>
                      <IconUserCircle className='size-5' />
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{row.original.assignee?.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {row.original.assignee?.name}
          </div>
        )
      },
    },
    {
      accessorKey: 'startTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='开始时间' />,
      cell: ({ cell }) => (
        <div className='flex items-center gap-2'>
          <IconCalendar className='size-4 cursor-pointer' />
          {formatDate(cell.getValue() as string) || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'deadline',
      header: ({ column }) => <DataTableColumnHeader column={column} title='截止时间' />,
      cell: ({ cell }) => (
        <div className='flex items-center gap-2'>
          <IconCalendar className='size-4 cursor-pointer' />
          {formatDate(cell.getValue() as string) || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'team.id',
      header: ({ column }) => <DataTableColumnHeader column={column} title='归属团队' />,
      cell: ({ row }) => (
        <div className='w-[100px] truncate flex items-center gap-2'>
          <IconCube className='size-4 cursor-pointer' />
          <p>{row.original.team?.name}</p>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        return (
          <div className='flex items-center gap-0'>
            <TooltipProvider key={row.original.id} delayDuration={500}>
              {/* view */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' onClick={() => setRowAction({ row, type: 'view' })}>
                    <IconEye className='size-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View</TooltipContent>
              </Tooltip>

              {/* edit */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' onClick={() => setRowAction({ row, type: 'update' })}>
                    <IconPencil className='size-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>

              {/* delete */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant='ghost' size='icon' onClick={() => setRowAction({ row, type: 'delete' })}>
                    <IconTrash className='size-4' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )
      },
      size: 40,
    },
  ]
}
