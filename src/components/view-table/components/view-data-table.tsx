import { useState } from 'react'
import { ColumnDef, flexRender, Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table as TableUI } from '@/components/ui/table'
import { BaseData, ViewType } from '../types'
import { DataTablePagination } from './data-table-pagination'

interface ViewDataTableProps<TData extends BaseData> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  searchColumn?: keyof TData
  currentView?: ViewType
  table: Table<TData>
}

export function ViewDataTable<TData extends BaseData>({
  data,
  columns,
  searchColumn,
  currentView,
  table,
}: ViewDataTableProps<TData>) {
  const [globalFilter, setGlobalFilter] = useState('')

  return (
    <div className='space-y-4'>
      {searchColumn && (
        <Input
          placeholder={`搜索 ${String(searchColumn)}...`}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className='max-w-sm'
        />
      )}

      <div className='rounded-md border'>
        <TableUI>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                <TableCell colSpan={table.getAllColumns().length} className='h-24 text-center'>
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableUI>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}
