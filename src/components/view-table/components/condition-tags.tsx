import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FilterCondition, GroupCondition, SortCondition, View } from '../types'

interface ConditionTagsProps {
  currentView?: View
  onUpdate?: (view: View) => Promise<void>
}

export function ConditionTags({ currentView, onUpdate }: ConditionTagsProps) {
  if (!currentView?.conditions) return null

  const { filters, sorts, groups } = currentView.conditions

  const handleRemoveFilter = async (filter: FilterCondition) => {
    if (!onUpdate) return
    await onUpdate({
      ...currentView,
      conditions: {
        ...currentView.conditions,
        filters: filters?.filter(
          (f) => f.field !== filter.field || f.operator !== filter.operator || f.value !== filter.value,
        ),
      },
    })
  }

  const handleRemoveSort = async (sort: SortCondition) => {
    if (!onUpdate) return
    await onUpdate({
      ...currentView,
      conditions: {
        ...currentView.conditions,
        sorts: sorts?.filter((s) => s.field !== sort.field || s.direction !== sort.direction),
      },
    })
  }

  const handleRemoveGroup = async (group: GroupCondition) => {
    if (!onUpdate) return
    await onUpdate({
      ...currentView,
      conditions: {
        ...currentView.conditions,
        groups: groups?.filter((g) => g.field !== group.field || g.direction !== group.direction),
      },
    })
  }

  return (
    <div className='flex flex-wrap gap-2'>
      {filters?.map((filter, index) => (
        <div key={`filter-${index}`} className='flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm'>
          <span>
            {filter.field} {filter.operator} {filter.value}
          </span>
          <Button variant='ghost' size='sm' className='h-4 w-4 p-0' onClick={() => handleRemoveFilter(filter)}>
            <XIcon className='h-3 w-3' />
          </Button>
        </div>
      ))}

      {sorts?.map((sort, index) => (
        <div key={`sort-${index}`} className='flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm'>
          <span>
            {sort.field} {sort.direction}
          </span>
          <Button variant='ghost' size='sm' className='h-4 w-4 p-0' onClick={() => handleRemoveSort(sort)}>
            <XIcon className='h-3 w-3' />
          </Button>
        </div>
      ))}

      {groups?.map((group, index) => (
        <div key={`group-${index}`} className='flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-sm'>
          <span>
            {group.field} {group.direction}
          </span>
          <Button variant='ghost' size='sm' className='h-4 w-4 p-0' onClick={() => handleRemoveGroup(group)}>
            <XIcon className='h-3 w-3' />
          </Button>
        </div>
      ))}
    </div>
  )
}
