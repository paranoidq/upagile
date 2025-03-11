import React from 'react'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type ColumnDef } from '@tanstack/react-table'
import { priorities } from '@/consts/enums'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/view-table/components/data-table-column-header'
import { BacklogDeleteDialog } from '../components/backlog-delete-dialog'
import { Backlog } from '../types'

export function getColumns(): ColumnDef<Backlog>[] {
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
      header: ({ column }) => <DataTableColumnHeader column={column} title='Backlog' />,
      cell: ({ row }) => <div className='w-10'>{row.getValue('id')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Title' />,
      cell: ({ row }) => {
        return (
          <div className='flex space-x-2'>
            <span className='max-w-[31.25rem] truncate font-medium'>{row.getValue('title')}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Priority' />,
      cell: ({ row }) => {
        const priority = priorities.find((priority) => priority.value === row.original.priority)

        if (!priority) return null

        const Icon = priority.icon

        return (
          <div className='flex items-center'>
            <Icon className='mr-2 size-4 text-muted-foreground' aria-hidden='true' />
            <span className='capitalize'>{priority.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return Array.isArray(value) && value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: 'createdTime',
      header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showUpdateTaskSheet, setShowUpdateTaskSheet] = React.useState(false)
        const [showDeleteTaskDialog, setShowDeleteTaskDialog] = React.useState(false)

        return (
          <>
            {/* <UpdateTaskSheet open={showUpdateTaskSheet} onOpenChange={setShowUpdateTaskSheet} task={row.original} /> */}
            <BacklogDeleteDialog
              open={showDeleteTaskDialog}
              onOpenChange={setShowDeleteTaskDialog}
              backlogs={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />

            {/* menu actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
                  <DotsHorizontalIcon className='size-4' aria-hidden='true' />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align='end'
                className='w-40 overflow-visible dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'
              >
                <DropdownMenuItem onSelect={() => setShowUpdateTaskSheet(true)}>Edit</DropdownMenuItem>
                {/* <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.label}
                      onValueChange={(value) => {
                        startUpdateTransition(() => {
                          toast.promise(
                            updateTask({
                              id: row.original.id,
                              label: value as Task['label'],
                            }),
                            {
                              loading: 'Updating...',
                              success: 'Label updated',
                              error: (err) => getErrorMessage(err),
                            },
                          )
                        })
                      }}
                    >
                      {tasks.label.enumValues.map((label) => (
                        <DropdownMenuRadioItem
                          key={label}
                          value={label}
                          className='capitalize'
                          disabled={isUpdatePending}
                        >
                          {label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setShowDeleteTaskDialog(true)}>
                  Delete
                  <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
    },
  ]
}
