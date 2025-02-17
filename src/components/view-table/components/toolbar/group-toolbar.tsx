import { useState } from 'react'
import { GroupIcon, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ViewType } from '../../types'

interface GroupToolbarProps {
  currentView?: ViewType
  onUpdate?: (view: ViewType) => Promise<void>
}

export function GroupToolbar({ currentView, onUpdate }: GroupToolbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleAddGroup = async (field: string, direction: 'asc' | 'desc') => {
    if (!currentView || !onUpdate) return

    const newGroup = {
      field,
      direction,
    }

    await onUpdate({
      ...currentView,
      conditions: {
        ...currentView.conditions,
        groups: [...(currentView.conditions?.groups || []), newGroup],
      },
    })

    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 border-dashed'>
          <PlusIcon className='mr-2 h-4 w-4' />
          添加分组
          <GroupIcon className='ml-2 h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>添加分组规则</h4>
            <p className='text-sm text-muted-foreground'>设置数据分组方式</p>
          </div>
          <div className='grid gap-2'>
            <Select onValueChange={(field) => {}}>
              <SelectTrigger>
                <SelectValue placeholder='选择分组字段' />
              </SelectTrigger>
              <SelectContent>
                {/* 这里需要根据实际列配置动态生成 */}
                <SelectItem value='status'>状态</SelectItem>
                <SelectItem value='priority'>优先级</SelectItem>
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
            <Button onClick={() => {}}>添加分组</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
