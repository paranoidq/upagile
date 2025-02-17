import { useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ViewType } from '../types'

interface CreateViewDialogProps {
  onViewCreate?: (view: Omit<ViewType, 'id'>) => Promise<void>
}

export function CreateViewDialog({ onViewCreate }: CreateViewDialogProps) {
  const [open, setOpen] = useState(false)
  const [viewName, setViewName] = useState('')

  const handleCreate = async () => {
    if (!onViewCreate) return

    await onViewCreate({
      name: viewName,
      conditions: {
        filters: [],
        sorts: [],
        groups: [],
      },
    })

    setViewName('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusIcon className='mr-2 h-4 w-4' />
          新建视图
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新建视图</DialogTitle>
          <DialogDescription>创建一个新的数据视图</DialogDescription>
        </DialogHeader>
        <Input value={viewName} onChange={(e) => setViewName(e.target.value)} placeholder='输入视图名称' />
        <DialogFooter>
          <Button variant='outline' onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleCreate}>创建</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
