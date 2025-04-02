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
import { useDeleteReleases } from '../_lib/services'
import { Release } from '../types'

interface DeleteReleasesDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  releases: Row<Release>['original'][]
  showTrigger?: boolean
  onSuccess?: () => void
}

export function DeleteReleasesDialog({ releases, showTrigger = true, onSuccess, ...props }: DeleteReleasesDialogProps) {
  const { mutateAsync: deleteReleases, isPending: isDeletePending } = useDeleteReleases()

  function onDelete() {
    toast.promise(
      deleteReleases({
        ids: releases.map((release) => Number(release.id)),
      }),
      {
        loading: 'Deleting releases...',
        success: () => {
          props.onOpenChange?.(false)
          onSuccess?.()
          return 'Releases deleted'
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
            Delete ({releases.length})
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your{' '}
            <span className='font-medium'>{releases.length}</span>
            {releases.length === 1 ? ' release' : ' releases'} from our servers.
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
