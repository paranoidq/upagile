import { useState } from 'react'
import { MoreHorizontalIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { ViewType } from '../types'

interface ViewTabActionsProps {
  view: ViewType
  onUpdate?: (view: ViewType) => Promise<void>
  onDelete?: (id: number) => Promise<void>
}

export function ViewTabActions({ view, onUpdate, onDelete }: ViewTabActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editName, setEditName] = useState(view.name)

  const handleEdit = async () => {
    if (!onUpdate) return
    await onUpdate({
      ...view,
      name: editName,
    })
    setIsEditOpen(false)
  }

  const handleDelete = async () => {
    if (!onDelete) return
    await onDelete(view.id)
    setIsDeleteOpen(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className='inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50'>
            <span className='sr-only'>打开菜单</span>
            <MoreHorizontalIcon className='h-4 w-4' />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <PencilIcon className='mr-2 h-4 w-4' />
            编辑视图
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} className='text-destructive'>
            <TrashIcon className='mr-2 h-4 w-4' />
            删除视图
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑视图</DialogTitle>
            <DialogDescription>修改视图名称</DialogDescription>
          </DialogHeader>
          <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder='输入视图名称' />
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsEditOpen(false)}>
              取消
            </Button>
            <Button onClick={handleEdit}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除视图</DialogTitle>
            <DialogDescription>确定要删除此视图吗？此操作无法撤销。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setIsDeleteOpen(false)}>
              取消
            </Button>
            <Button variant='destructive' onClick={handleDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
