import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ViewType } from '@/features/tasks/types.ts'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchColumn?: string
  currentView?: ViewType
}

type GroupData<TData> = {
  key: string
  field?: string
  data: TData[] | GroupData<TData>[]
}

// 抽取表格和分页为独立组件
function GroupTable<TData, TValue>({
  data,
  columns,
  columnVisibility,
  columnFilters,
}: {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  columnVisibility: VisibilityState
  columnFilters: ColumnFiltersState
}) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableFilters: false,
    enableSorting: false,
    enableHiding: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className='space-y-2'>
      <div className='round-md'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}

export function DataTable<TData, TValue>({ columns, data, searchColumn, currentView }: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])

  // 创建主表格实例（仅用于工具栏）
  const mainTable = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableSorting: false,
    enableHiding: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  // 修改分组逻辑
  const groupedData = React.useMemo(() => {
    if (!currentView?.conditions?.groups?.length) {
      return [{ key: 'all', data }]
    }

    // 递归分组函数
    const groupBy = (
      items: TData[],
      groupFields: typeof currentView.conditions.groups,
      depth = 0,
    ): TData[] | GroupData<TData>[] => {
      if (depth >= groupFields.length) {
        return items
      }

      const field = groupFields[depth].field
      const direction = groupFields[depth].direction

      // 按字段分组，同时收集未分组的记录
      const { groups, ungrouped } = items.reduce(
        (acc, item) => {
          const value = (item as any)[field]
          if (value === null || value === undefined || value === '') {
            acc.ungrouped.push(item)
          } else {
            const key = value.toString()
            if (!acc.groups[key]) {
              acc.groups[key] = []
            }
            acc.groups[key].push(item)
          }
          return acc
        },
        { groups: {} as Record<string, TData[]>, ungrouped: [] as TData[] },
      )

      // 对每个分组进行排序
      const sortedGroups = Object.entries(groups)
        .sort(([a], [b]) => {
          return direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
        })
        .map(([key, groupData]) => ({
          key,
          field,
          data: groupBy(groupData, groupFields, depth + 1),
        }))

      // 如果有未分组的记录，添加到最后
      if (ungrouped.length > 0) {
        sortedGroups.push({
          key: '未分组',
          field,
          data: groupBy(ungrouped, groupFields, depth + 1),
        })
      }

      return sortedGroups
    }

    return groupBy(data, currentView.conditions.groups)
  }, [data, currentView?.conditions?.groups])

  // 添加折叠状态管理
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({})

  const toggleGroup = (groupKey: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }))
  }

  // 修改渲染分组的标题显示
  const renderGroupTitle = (group: GroupData<TData>) => {
    if (group.key === '未分组') {
      return (
        <>
          <span className='font-semibold'>{group.field}: 未分组</span>
          <span className='ml-2 text-muted-foreground'>({(group.data as TData[]).length || '0'} 条记录)</span>
        </>
      )
    }

    return (
      <>
        <span className='font-semibold'>
          {group.field}: {group.key}
        </span>
        <span className='ml-2 text-muted-foreground'>({(group.data as TData[]).length || '0'} 条记录)</span>
      </>
    )
  }

  const renderGroupedTable = (groupData: GroupData<TData>[] | TData[], parentKey = '') => {
    if (Array.isArray(groupData) && groupData.length > 0 && !('field' in groupData[0])) {
      return (
        <GroupTable
          data={groupData as TData[]}
          columns={columns}
          columnVisibility={columnVisibility}
          columnFilters={columnFilters}
        />
      )
    }

    return (groupData as GroupData<TData>[]).map((group) => {
      const groupKey = parentKey ? `${parentKey}-${group.key}` : group.key
      const isCollapsed = collapsedGroups[groupKey]

      return (
        <Card key={groupKey} className='mb-2'>
          <CardHeader className='p-3'>
            <Button
              variant='ghost'
              className='h-8 w-full flex items-center justify-start hover:bg-transparent pl-0'
              onClick={() => toggleGroup(groupKey)}
            >
              {isCollapsed ? (
                <ChevronRight className='h-4 w-4 shrink-0' />
              ) : (
                <ChevronDown className='h-4 w-4 shrink-0' />
              )}
              {renderGroupTitle(group)}
            </Button>
          </CardHeader>
          <CardContent className={cn('pl-1', isCollapsed && 'hidden')}>
            {renderGroupedTable(group.data, groupKey)}
          </CardContent>
        </Card>
      )
    })
  }

  return (
    <div className='space-y-2'>
      <DataTableToolbar table={mainTable} searchColumn={searchColumn} currentView={currentView} />
      <div className='rounded-md border p-2'>{renderGroupedTable(groupedData)}</div>
    </div>
  )
}
