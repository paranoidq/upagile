import { FC } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sprint } from '../types'

interface SprintPlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sprint: Sprint
}

export const SprintPlanDialog: FC<SprintPlanDialogProps> = ({ open, onOpenChange, sprint }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{sprint?.title}</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
