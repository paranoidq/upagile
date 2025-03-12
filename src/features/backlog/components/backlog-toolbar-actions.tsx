import { Table } from '@tanstack/react-table'
import { DownloadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Kbd } from '@/components/kbd'
import { Backlog } from '../types'
import { BacklogCreateDialog } from './backlog-create-dialog'
import { BacklogDeleteDialog } from './backlog-delete-dialog'

interface BacklogToolbarActionsProps {
  table: Table<Backlog>
}

export function BacklogToolbarActions({ table }: BacklogToolbarActionsProps) {
  return (
    <div className='flex items-center gap-2'>
      {/* delete dialog */}
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <BacklogDeleteDialog
          backlogs={table.getFilteredSelectedRowModel().rows.map((row) => row.original)}
          onSuccess={() => table.toggleAllRowsSelected(false)}
        />
      ) : null}

      {/* create dialog */}
      <BacklogCreateDialog />

      <TooltipProvider>
        <Tooltip>
          {/* export  */}
          <TooltipTrigger asChild>
            <Button variant='outline' size='sm' disabled>
              <DownloadIcon className='mr-2 size-4' aria-hidden='true' />
              Export
            </Button>
          </TooltipTrigger>
          <TooltipContent className='flex items-center gap-2 border bg-accent font-semibold text-foreground dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'>
            Export csv
            <div>
              <Kbd variant='outline' className='font-sans'>
                ⇧
              </Kbd>{' '}
              <Kbd variant='outline' className='font-sans'>
                E
              </Kbd>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
