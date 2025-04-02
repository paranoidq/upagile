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
import { useDeleteSprints } from '../_lib/services'
import { Sprint } from '../types'

interface DeleteSprintsDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  sprints: Row<Sprint>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteSprintsDialog({ sprints, showTrigger = true, onSuccess, ...props }: DeleteSprintsDialogProps) {
  const { mutateAsync: deleteSprints, isPending: isDeletePending } = useDeleteSprints()

  function onDelete() {
    toast.promise(
      deleteSprints({
        ids: sprints.map((sprint) => Number(sprint.id)),
      }),
      {
        loading: 'Deleting sprints...',
        success: () => {
          props.onOpenChange?.(false)
          onSuccess?.()
          return 'Sprints deleted'
        },
        error: (e) => {
          props.onOpenChange?.(false)
          return {
            message: e.msg,
            description: e.reason,
          }
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
            Delete ({sprints.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{' '}
            <span className='font-medium'>{sprints.length}</span>
            {sprints.length === 1 ? ' sprint' : ' sprints'} from our servers.
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
