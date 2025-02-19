import { useState } from 'react'
import { DividerVerticalIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ColumnVisibility } from '@/components/view-table/components/toolbar/column-visibility'
import { ViewType } from '@/components/view-table/types.ts'
import { FilterToolbar } from './toolbar/filter-toolbar'
import { GroupToolbar } from './toolbar/group-toolbar'
import { SortToolbar } from './toolbar/sort-toolbar'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchColumn?: string
  currentView?: ViewType
  onCollapseAll?: () => void
  onExpandAll?: () => void
  hasGroups?: boolean
  pageSize: number
  onPageSizeChange: (size: number) => void
}

export function DataTableToolbar<TData>({
  table,
  searchColumn,
  currentView,
  onCollapseAll,
  onExpandAll,
  pageSize,
  onPageSizeChange,
}: DataTableToolbarProps<TData>) {
  const [openFilterDialog, setOpenFilterDialog] = useState(false)
  const [openSortDialog, setOpenSortDialog] = useState(false)
  const [openGroupDialog, setOpenGroupDialog] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)

  const handleToggleExpand = () => {
    if (isExpanded) {
      onCollapseAll?.()
    } else {
      onExpandAll?.()
    }
    setIsExpanded(!isExpanded)
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* search input */}
        {searchColumn && (
          <Input
            placeholder='Filter tasks...'
            value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(searchColumn)?.setFilterValue(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}

        <FilterToolbar
          table={table}
          open={openFilterDialog}
          onOpenChange={setOpenFilterDialog}
          currentView={currentView}
        />

        <SortToolbar table={table} open={openSortDialog} onOpenChange={setOpenSortDialog} currentView={currentView} />

        <GroupToolbar
          table={table}
          open={openGroupDialog}
          onOpenChange={setOpenGroupDialog}
          currentView={currentView}
        />

        <DividerVerticalIcon />

        {/* 合并后的折叠/展开按钮 */}
        <Button variant='outline' size='sm' className='h-8 ml-4' onClick={handleToggleExpand}>
          {isExpanded ? <ChevronDown className='h-4 w-4 mr-1' /> : <ChevronRight className='h-4 w-4 mr-1' />}
          {isExpanded ? '折叠分组' : '展开分组'}
        </Button>

        <DividerVerticalIcon />

        {/* 列可见性 */}
        <ColumnVisibility table={table} />

        <DividerVerticalIcon />

        <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className='w-[120px]'>
            <SelectValue placeholder='每页显示' />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                每页 {size} 条
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
