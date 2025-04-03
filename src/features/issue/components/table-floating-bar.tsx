import * as React from 'react'
import { SelectTrigger } from '@radix-ui/react-select'
import type { Table } from '@tanstack/react-table'
import { IconFlag3Filled } from '@tabler/icons-react'
import { PRIORITIES } from '@/consts/enums'
import { ArrowUp, Loader, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Portal } from '@/components/ui/portal'
import { Select, SelectContent, SelectGroup, SelectItem } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Kbd } from '@/components/kbd'
import { useBatchUpdateIssue, useDeleteIssues } from '../_lib/services'
import { Issue, issueStatus, issueType } from '../types'

interface IssueTableFloatingBarProps {
  table: Table<Issue>
}

export function IssueTableFloatingBar({ table }: IssueTableFloatingBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows

  const [action, setAction] = React.useState<
    'update-status' | 'update-priority' | 'update-type' | 'export' | 'delete'
  >()

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

  const { mutateAsync: updateIssues, isPending: isUpdatingIssues } = useBatchUpdateIssue()

  const { mutateAsync: deleteIssues, isPending: isDeletingIssues } = useDeleteIssues()

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

            {/* batch change status */}
            <Select
              onValueChange={(value: Issue['status']) => {
                setAction('update-status')

                toast.promise(
                  updateIssues({
                    ids: rows.map((row) => Number(row.original.id)),
                    status: value,
                    priority: undefined,
                    type: undefined,
                  }),
                  {
                    loading: 'Updating issues...',
                    success: 'Issues updated',
                    error: 'Failed to update issues',
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
                      disabled={isUpdatingIssues}
                    >
                      {isUpdatingIssues && action === 'update-status' ? (
                        <Loader className='size-3.5 animate-spin' aria-hidden='true' />
                      ) : (
                        <ArrowUp className='size-3.5' aria-hidden='true' />
                      )}
                    </Button>
                  </TooltipTrigger>
                </SelectTrigger>
                <TooltipContent className='border bg-accent font-semibold text-foreground dark:bg-zinc-900'>
                  <p>Update status</p>
                </TooltipContent>
              </Tooltip>
              <SelectContent align='center'>
                <SelectGroup>
                  {issueStatus.map((item) => (
                    <SelectItem key={item.value} value={item.value} className='capitalize'>
                      <div className='flex items-center gap-2'>
                        <div
                          className={`flex h-4 w-4 px-0.5 font-extrabold items-center justify-center rounded-full ${item?.color || ''} text-white`}
                        >
                          {item?.icon}
                        </div>
                        <span className='inline-flex items-center'>{item?.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* batch change priority */}
            <Select
              onValueChange={(value: Issue['priority']) => {
                setAction('update-priority')

                toast.promise(
                  updateIssues({
                    ids: rows.map((row) => Number(row.original.id)),
                    status: undefined,
                    priority: value,
                    type: undefined,
                  }),
                  {
                    loading: 'Updating issues...',
                    success: 'Issues updated',
                    error: 'Failed to update issues',
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
                      disabled={isUpdatingIssues}
                    >
                      {isUpdatingIssues && action === 'update-status' ? (
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
                  {PRIORITIES.map((item) => (
                    <SelectItem key={item.value} value={item.value} className='capitalize'>
                      <div className='flex items-center'>
                        <IconFlag3Filled
                          className={cn('mr-2 size-4 text-muted-foreground', item.color)}
                          aria-hidden='true'
                        />
                        <span className='capitalize'>{item.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* batch change type */}
            <Select
              onValueChange={(value: Issue['type']) => {
                setAction('update-type')

                toast.promise(
                  updateIssues({
                    ids: rows.map((row) => Number(row.original.id)),
                    status: undefined,
                    priority: undefined,
                    type: value,
                  }),
                  {
                    loading: 'Updating issues...',
                    success: 'Issues updated',
                    error: 'Failed to update issues',
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
                      disabled={isUpdatingIssues}
                    >
                      {isUpdatingIssues && action === 'update-status' ? (
                        <Loader className='size-3.5 animate-spin' aria-hidden='true' />
                      ) : (
                        <ArrowUp className='size-3.5' aria-hidden='true' />
                      )}
                    </Button>
                  </TooltipTrigger>
                </SelectTrigger>
                <TooltipContent className='border bg-accent font-semibold text-foreground dark:bg-zinc-900'>
                  <p>Update type</p>
                </TooltipContent>
              </Tooltip>
              <SelectContent align='center'>
                <SelectGroup>
                  {issueType.map((item) => (
                    <SelectItem key={item.value} value={item.value} className='capitalize'>
                      <div className='flex items-center gap-2'>
                        <span className='inline-flex items-center'>{item?.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {/* delete issues */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='secondary'
                  size='icon'
                  className='size-7 border'
                  onClick={() => {
                    setAction('delete')

                    toast.promise(
                      deleteIssues({
                        ids: rows.map((row) => Number(row.original.id)),
                      }),
                      {
                        loading: 'Deleting issues...',
                        success: () => {
                          table.toggleAllRowsSelected(false)
                          return 'Issues deleted'
                        },
                        error: (e) => {
                          return {
                            message: e.msg,
                            description: e.reason,
                          }
                        },
                      },
                    )
                  }}
                  disabled={isDeletingIssues}
                >
                  {isDeletingIssues && action === 'delete' ? (
                    <Loader className='size-3.5 animate-spin' aria-hidden='true' />
                  ) : (
                    <Trash2 className='size-3.5' aria-hidden='true' />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent className='border bg-accent font-semibold text-foreground dark:bg-zinc-900'>
                <p>Delete issues</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </Portal>
  )
}
