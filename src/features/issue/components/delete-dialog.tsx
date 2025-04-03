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
import { useDeleteIssues } from '../_lib/services'
import { Issue } from '../types'

interface DeleteIssuesDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  issues: Row<Issue>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteIssuesDialog({ issues, showTrigger = true, onSuccess, ...props }: DeleteIssuesDialogProps) {
  const { mutateAsync: deleteIssues, isPending: isDeletePending } = useDeleteIssues()

  function onDelete() {
    toast.promise(
      deleteIssues({
        ids: issues.map((issue) => Number(issue.id)),
      }),
      {
        loading: 'Deleting issues...',
        success: () => {
          props.onOpenChange?.(false)
          onSuccess?.()
          return 'Issues deleted'
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
            Delete ({issues.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{' '}
            <span className='font-medium'>{issues.length}</span>
            {issues.length === 1 ? ' issue' : ' issues'} from our servers.
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
