'use client'

import * as React from 'react'
import type { Row } from '@tanstack/react-table'
import { Loader, Trash } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useDeleteBacklogs } from '../services'
import { Backlog } from '../types'

interface DeleteBacklogsDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  backlogs: Row<Backlog>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteBacklogsDialog({ backlogs, showTrigger = true, onSuccess, ...props }: DeleteBacklogsDialogProps) {
  const { mutateAsync: deleteBacklogs, isPending: isDeletePending } = useDeleteBacklogs()

  function onDelete() {
    toast.promise(
      deleteBacklogs({
        ids: backlogs.map((backlog) => Number(backlog.id)),
      }),
      {
        loading: 'Deleting backlogs...',
        success: () => {
          props.onOpenChange?.(false)
          toast.success('Backlogs deleted')
          onSuccess?.()
          return 'Backlogs deleted'
        },
        error: () => {
          return 'Failed to delete backlogs'
        },
      },
    )
  }

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant='outline' size='sm'>
            <Trash className='mr-2 size-4' aria-hidden='true' />
            Delete ({backlogs.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{' '}
            <span className='font-medium'>{backlogs.length}</span>
            {backlogs.length === 1 ? ' backlog' : ' backlogs'} from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='gap-2 sm:space-x-0'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button aria-label='Delete selected rows' variant='destructive' onClick={onDelete} disabled={isDeletePending}>
            {isDeletePending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
