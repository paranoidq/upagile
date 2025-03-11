import * as React from 'react'
import { ArrowUpIcon, Cross2Icon, TrashIcon } from '@radix-ui/react-icons'
import { SelectTrigger } from '@radix-ui/react-select'
import { type Table } from '@tanstack/react-table'
import { priorities } from '@/consts/enums'
import { LoaderIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Kbd } from '@/components/kbd'
import { deleteBacklog, updateBacklogs } from '../services'
import { Backlog } from '../types'

interface BacklogTableFloatingBarProps {
  table: Table<Backlog>
}

export function BacklogTableFloatingBar({ table }: BacklogTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows

  const [isPending, startTransition] = React.useTransition()
  const [method, setMethod] = React.useState<'update-status' | 'update-priority' | 'export' | 'delete'>()

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

  return (
    <div className='fixed inset-x-0 bottom-4 z-50 mx-auto w-fit px-4'>
      <div className='w-full overflow-x-auto'>
        <div className='mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-2xl'>
          <div className='flex h-7 items-center rounded-md border border-dashed pl-2.5 pr-1'>
            <span className='whitespace-nowrap text-xs'>{rows.length} selected</span>
            <Separator orientation='vertical' className='ml-2 mr-1' />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-5 hover:border'
                  onClick={() => table.toggleAllRowsSelected(false)}
                >
                  <Cross2Icon className='size-3.5 shrink-0' aria-hidden='true' />
                </Button>
              </TooltipTrigger>
              <TooltipContent className='flex items-center border bg-accent px-2 py-1 font-semibold text-foreground dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'>
                <p className='mr-2'>Clear selection</p>
                <Kbd abbrTitle='Escape' variant='outline'>
                  Esc
                </Kbd>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            onValueChange={(value: Backlog['priority']) => {
              setMethod('update-priority')
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
            <Tooltip delayDuration={250}>
              <SelectTrigger asChild>
                <TooltipTrigger asChild>
                  <Button
                    variant='secondary'
                    size='icon'
                    className='size-7 border data-[state=open]:bg-accent data-[state=open]:text-accent-foreground'
                    disabled={isPending}
                  >
                    {isPending && method === 'update-priority' ? (
                      <LoaderIcon className='size-3.5 animate-spin' aria-hidden='true' />
                    ) : (
                      <ArrowUpIcon className='size-3.5' aria-hidden='true' />
                    )}
                  </Button>
                </TooltipTrigger>
              </SelectTrigger>
              <TooltipContent className='border bg-accent font-semibold text-foreground dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'>
                <p>Update priority</p>
              </TooltipContent>
            </Tooltip>
            <SelectContent align='center'>
              <SelectGroup>
                {priorities.map((priority) => (
                  <SelectItem key={priority.value} value={priority.value} className='capitalize'>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Tooltip delayDuration={250}>
            <TooltipTrigger asChild>
              <Button
                variant='secondary'
                size='icon'
                className='size-7 border'
                onClick={() => {
                  setMethod('delete')

                  startTransition(async () => {
                    await deleteBacklog({
                      ids: rows.map((row) => Number(row.original.id)),
                    }).catch((error) => {
                      toast.error(error.message, {
                        description: error.reason,
                      })
                      return
                    })

                    table.toggleAllRowsSelected(false)
                  })
                }}
                disabled={isPending}
              >
                {isPending && method === 'delete' ? (
                  <LoaderIcon className='size-3.5 animate-spin' aria-hidden='true' />
                ) : (
                  <TrashIcon className='size-3.5' aria-hidden='true' />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent className='border bg-accent font-semibold text-foreground dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'>
              <p>Delete tasks</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
