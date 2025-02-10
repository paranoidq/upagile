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
      <div className='rounded-md'>
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
      <div className='px-2'>
        <DataTablePagination table={table} />
      </div>
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

  const groupedData = React.useMemo(() => {
    if (!currentView?.conditions?.groups?.length) {
      return [{ key: 'all', data }]
    }

    // 创建分组字段的值格式化函数缓存
    const formatters = new Map<string, (value: any) => string>()
    const getFormatter = (field: string) => {
      if (!formatters.has(field)) {
        formatters.set(field, (value: any) => {
          if (value === null || value === undefined || value === '') {
            return ''
          }
          return value.toString()
        })
      }
      return formatters.get(field)!
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
      const formatter = getFormatter(field)

      // 使用 Map 代替普通对象来提高性能
      const groupMap = new Map<string, TData[]>()
      const ungrouped: TData[] = []

      // 优化分组过程
      for (const item of items) {
        const value = (item as any)[field]
        const formattedValue = formatter(value)

        if (!formattedValue) {
          ungrouped.push(item)
        } else {
          if (!groupMap.has(formattedValue)) {
            groupMap.set(formattedValue, [])
          }
          groupMap.get(formattedValue)!.push(item)
        }
      }

      // 优化排序过程
      const sortedGroups = Array.from(groupMap.entries())
        .sort(([a], [b]) => (direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a)))
        .map(([key, groupData]) => ({
          key,
          field,
          data: groupBy(groupData, groupFields, depth + 1),
        }))

      // 添加未分组数据
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

  // 优化折叠状态管理
  const [collapsedGroups, setCollapsedGroups] = React.useState<Map<string, boolean>>(new Map())

  const toggleGroup = React.useCallback((groupKey: string) => {
    setCollapsedGroups((prev) => {
      const next = new Map(prev)
      next.set(groupKey, !prev.get(groupKey))
      return next
    })
  }, [])

  // 优化获取所有分组 key 的函数
  const getAllGroupKeys = React.useCallback((groups: GroupData<TData>[] | TData[]): string[] => {
    if (Array.isArray(groups) && groups.length > 0 && !('field' in groups[0])) {
      return []
    }

    const keys: string[] = []
    const stack = [...(groups as GroupData<TData>[])]

    while (stack.length > 0) {
      const group = stack.pop()!
      keys.push(group.key)

      if (Array.isArray(group.data) && group.data.length > 0 && 'field' in group.data[0]) {
        stack.push(...(group.data as GroupData<TData>[]))
      }
    }

    return keys
  }, [])

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

  // 折叠所有分组
  const collapseAll = React.useCallback(() => {
    const allGroups = getAllGroupKeys(groupedData)
    setCollapsedGroups(
      allGroups.reduce((acc, key) => {
        acc.set(key, true)
        return acc
      }, new Map<string, boolean>()),
    )
  }, [groupedData, getAllGroupKeys])

  // 展开所有分组
  const expandAll = React.useCallback(() => {
    setCollapsedGroups(new Map())
  }, [])

  const renderGroupedTable = (groupData: GroupData<TData>[] | TData[], parentKey = '', depth = 0) => {
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
      const isCollapsed = collapsedGroups.get(groupKey) ?? false
      const indentLevel = Math.min(depth, 2) // 限制最大缩进层级为2

      return (
        <Card key={groupKey} className='mb-2'>
          <CardHeader className='p-2'>
            <Button
              variant='ghost'
              className={cn(
                'h-8 w-full flex items-center justify-start hover:bg-transparent',
                indentLevel === 1 && 'pl-4',
                indentLevel >= 2 && 'pl-8',
              )}
              onClick={() => toggleGroup(groupKey)}
            >
              <div className='w-4 h-4 mr-2'>
                {isCollapsed ? (
                  <ChevronRight className='h-4 w-4 shrink-0' />
                ) : (
                  <ChevronDown className='h-4 w-4 shrink-0' />
                )}
              </div>
              {renderGroupTitle(group)}
            </Button>
          </CardHeader>
          <CardContent className={cn('px-2 py-1', isCollapsed && 'hidden')}>
            {renderGroupedTable(group.data, groupKey, depth + 1)}
          </CardContent>
        </Card>
      )
    })
  }

  const hasGroups = Boolean(currentView?.conditions?.groups?.length)

  return (
    <div className='space-y-2'>
      <DataTableToolbar
        table={mainTable}
        searchColumn={searchColumn}
        currentView={currentView}
        onCollapseAll={collapseAll}
        onExpandAll={expandAll}
        hasGroups={hasGroups}
      />

      {hasGroups ? (
        <div className='rounded-md border p-2'>{renderGroupedTable(groupedData)}</div>
      ) : (
        <GroupTable data={data} columns={columns} columnVisibility={columnVisibility} columnFilters={columnFilters} />
      )}
    </div>
  )
}
