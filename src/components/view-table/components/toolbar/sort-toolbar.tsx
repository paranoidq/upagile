import { useState } from 'react'
import { ArrowUpDownIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ViewType } from '../../types'

interface SortToolbarProps {
  currentView?: ViewType
  onUpdate?: (view: ViewType) => Promise<void>
}

export function SortToolbar({ currentView, onUpdate }: SortToolbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleAddSort = async (field: string, direction: 'asc' | 'desc') => {
    if (!currentView || !onUpdate) return

    const newSort = {
      field,
      direction,
    }

    await onUpdate({
      ...currentView,
      conditions: {
        ...currentView.conditions,
        sorts: [...(currentView.conditions?.sorts || []), newSort],
      },
    })

    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusIcon className='mr-2 h-4 w-4' />
          添加排序
          <ArrowUpDownIcon className='ml-2 h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>添加排序规则</h4>
            <p className='text-sm text-muted-foreground'>设置数据排序方式</p>
          </div>
          <div className='grid gap-2'>
            <Select onValueChange={(field) => {}}>
              <SelectTrigger>
                <SelectValue placeholder='选择排序字段' />
              </SelectTrigger>
              <SelectContent>
                {/* 这里需要根据实际列配置动态生成 */}
                <SelectItem value='title'>标题</SelectItem>
                <SelectItem value='status'>状态</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(direction) => {}}>
              <SelectTrigger>
                <SelectValue placeholder='选择排序方向' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='asc'>升序</SelectItem>
                <SelectItem value='desc'>降序</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => {}}>添加排序</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
