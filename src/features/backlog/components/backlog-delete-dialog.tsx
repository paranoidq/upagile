'use client'

import * as React from 'react'
import { TrashIcon } from '@radix-ui/react-icons'
import { type Row } from '@tanstack/react-table'
import { LoaderIcon } from 'lucide-react'
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
import { useDeleteBacklog } from '../services'
import { Backlog } from '../types'

interface DeleteTasksDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  backlogs: Row<Backlog>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function BacklogDeleteDialog({ backlogs, showTrigger = true, onSuccess, ...props }: DeleteTasksDialogProps) {
  const { mutateAsync: deleteBacklog, isPending: isDeletePending } = useDeleteBacklog()

  return (
    <Dialog {...props}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button variant='outline' size='sm'>
            <TrashIcon className='mr-2 size-4' aria-hidden='true' />
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
          <Button
            aria-label='Delete selected rows'
            variant='destructive'
            onClick={() => {
              deleteBacklog({
                ids: backlogs.map((backlog) => Number(backlog.id)),
              }).catch((error) => {
                toast.error(error.message, {
                  description: 'Please try again later',
                })
              })

              props.onOpenChange?.(false)
              toast.success(`${backlogs.length > 1 ? 'Tasks' : 'Task'} deleted`)
              onSuccess?.()
            }}
            disabled={isDeletePending}
          >
            {isDeletePending && <LoaderIcon className='mr-1.5 size-4 animate-spin' aria-hidden='true' />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
