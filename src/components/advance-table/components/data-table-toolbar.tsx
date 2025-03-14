import { useRouter, useSearch } from '@tanstack/react-router'
import { PlusIcon, RefreshCcwIcon, SaveIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTableInstanceContext } from '../table-instance-provider'
import { DataTableFilterField, DataTableGroupField, DataTableSortField, SearchParams, View } from '../types'
import { DataTableColumnsVisibility } from './data-table-column-visibility'
import { DataTableToolbarSort } from './data-table-toolbar-sort'

interface DataTableToolbarProps<TData> {
  sortFields: DataTableSortField<TData>[]
  filterFields: DataTableFilterField<TData>[]
  groupFields: DataTableGroupField<TData>[]
  currentView: View | undefined
}

export function DataTableToolbar<TData>({
  sortFields,
  filterFields,
  groupFields,
  currentView,
}: DataTableToolbarProps<TData>) {
  const { tableInstance: table } = useTableInstanceContext()
  const router = useRouter()
  const search = useSearch({ strict: false }) as SearchParams

  const isUpdated = false

  return (
    <div className='flex items-center justify-between my-2'>
      <div className='flex items-center gap-2'>
        <DataTableColumnsVisibility />

        <Button variant='outline' size={'sm'}>
          <PlusIcon className='size-4' />
          Filters
        </Button>

        <DataTableToolbarSort sortFields={sortFields} currentView={currentView} />

        <Button variant='outline' size={'sm'}>
          <PlusIcon className='size-4' />
          Groups
        </Button>
      </div>

      {/* actions */}
      <div className='flex items-center gap-2'>
        {/* reset */}
        {isUpdated && (
          <Button variant='outline' size={'sm'}>
            <RefreshCcwIcon className='size-4' />
            Reset
          </Button>
        )}

        {/* save */}
        {isUpdated && (
          <Button variant='outline' size={'sm'}>
            <SaveIcon className='size-4' />
            Save
          </Button>
        )}
      </div>
    </div>
  )
}
