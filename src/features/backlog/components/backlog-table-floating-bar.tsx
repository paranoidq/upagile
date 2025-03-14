import * as React from 'react'
import { SelectTrigger } from '@radix-ui/react-select'
import type { Table } from '@tanstack/react-table'
import { PRIORITIES } from '@/consts/enums'
import { ArrowUp, Loader, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Portal } from '@/components/ui/portal'
import { Select, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Kbd } from '@/components/kbd'
import { useDeleteBacklogs, useUpdateBacklogs } from '../services'
import { Backlog } from '../types'

interface BacklogTableFloatingBarProps {
  table: Table<Backlog>
}

export function BacklogTableFloatingBar({ table }: BacklogTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows

  const [action, setAction] = React.useState<'update-status' | 'update-priority' | 'export' | 'delete'>()

  // Clear selection on Escape key press
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        table.toggleAllRowsSelected(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [table])

  const { mutateAsync: updateBacklogs, isPending: isUpdatingBacklogs } = useUpdateBacklogs()

  const { mutateAsync: deleteBacklogs, isPending: isDeletingBacklogs } = useDeleteBacklogs()

  return (
    <Portal>
      <div className='fixed inset-x-0 bottom-6 z-50 mx-auto w-fit px-2.5'>
        <div className='w-full overflow-x-auto'>
          <div className='mx-auto flex w-fit items-center gap-2 rounded-md border bg-background p-2 text-foreground shadow'>
            <div className='flex h-7 items-center rounded-md border border-dashed pr-1 pl-2.5'>
              <span className='whitespace-nowrap text-xs'>{rows.length} selected</span>
              <Separator orientation='vertical' className='mr-1 ml-2' />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='size-5 hover:border'
                    onClick={() => table.toggleAllRowsSelected(false)}
                  >
                    <X className='size-3.5 shrink-0' aria-hidden='true' />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className='flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-zinc-900'>
                  <p className='mr-2'>Clear selection</p>
                  <Kbd abbrTitle='Escape' variant='outline'>
                    Esc
                  </Kbd>
                </TooltipContent>
              </Tooltip>
            </div>
            <Separator orientation='vertical' className='hidden h-5 sm:block' />

            <Select
              onValueChange={(value: Backlog['priority']) => {
                setAction('update-priority')

                toast.promise(
                  updateBacklogs({
                    ids: rows.map((row) => Number(row.original.id)),
                    priority: value,
                  }),
                  {
                    loading: 'Updating backlogs...',
                    success: 'Backlogs updated',
                    error: 'Failed to update backlogs',
                  },
                )
              }}
            >
              <Tooltip>
                <SelectTrigger asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant='secondary'
                      size='icon'
                      className='size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground'
                      disabled={isUpdatingBacklogs}
                    >
                      {isUpdatingBacklogs && action === 'update-priority' ? (
                        <Loader className='size-3.5 animate-spin' aria-hidden='true' />
                      ) : (
                        <ArrowUp className='size-3.5' aria-hidden='true' />
                      )}
                    </Button>
                  </TooltipTrigger>
                </SelectTrigger>
                <TooltipContent className='border bg-accent font-semibold text-foreground dark:bg-zinc-900'>
                  <p>Update priority</p>
                </TooltipContent>
              </Tooltip>
              <SelectContent align='center'>
                <SelectGroup>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value} className='capitalize'>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='secondary'
                  size='icon'
                  className='size-7 border'
                  onClick={() => {
                    setAction('delete')

                    toast.promise(
                      deleteBacklogs({
                        ids: rows.map((row) => Number(row.original.id)),
                      }),
                      {
                        loading: 'Deleting backlogs...',
                        success: () => {
                          table.toggleAllRowsSelected(false)
                          return 'Backlogs deleted'
                        },
                        error: 'Failed to delete backlogs',
                      },
                    )
                  }}
                  disabled={isDeletingBacklogs}
                >
                  {isDeletingBacklogs && action === 'delete' ? (
                    <Loader className='size-3.5 animate-spin' aria-hidden='true' />
                  ) : (
                    <Trash2 className='size-3.5' aria-hidden='true' />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className='border bg-accent font-semibold text-foreground dark:bg-zinc-900'>
                <p>Delete backlogs</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </Portal>
  )
}
