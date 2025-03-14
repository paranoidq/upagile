import { useState } from 'react'
import { useRouter, useSearch } from '@tanstack/react-router'
import { ArrowUpDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { DataTableSortField, View } from '../types'

type SortParam = {
  field: string
  direction: 'asc' | 'desc'
}

type Props<TData> = {
  sortFields: DataTableSortField<TData>[]
  currentView: View | undefined
}

export function DataTableToolbarSort<TData>({ sortFields, currentView }: Props<TData>) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const search = useSearch({ strict: false })

  const sortParams = search?.sortParams ?? []

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* trigger */}
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn('h-8 border-dashed', sortFields?.length > 0 && 'border-primary')}
        >
          <ArrowUpDown className='mr-2 h-4 w-4' />
          Sorts
          {sortParams.length > 0 && (
            <span className='ml-1 rounded-full bg-primary px-1 text-xs text-primary-foreground'>
              {sortParams.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      {/* dialog content */}
      <PopoverContent className='w-80' align='start'>
        <div className='space-y-4'>
          <Button type='button' variant='outline' size='sm' className='w-full' onClick={void 0}>
            <Plus className='mr-2 h-4 w-4' />
            添加排序
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
