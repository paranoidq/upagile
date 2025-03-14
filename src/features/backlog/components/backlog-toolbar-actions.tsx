import { Table } from '@tanstack/react-table'
import { UploadIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

      <Button variant='outline' size='sm' disabled>
        <UploadIcon className='mr-2 size-4' aria-hidden='true' />
        Batch
      </Button>
    </div>
  )
}
