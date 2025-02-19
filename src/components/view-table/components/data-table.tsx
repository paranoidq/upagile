import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  Table as TableType,
  useReactTable,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { columns } from '@/features/users/components/users-columns'
import { BaseData } from '../types'
import { DataTablePagination } from './data-table-pagination'

type Props<TData extends BaseData> = {
  table: TableType<TData>
  groupData?: TData[]
  pageSize: number
}

export const DataTable = <TData extends BaseData>({ table: parentTable, groupData = [], pageSize }: Props<TData>) => {
  const [pageIndex, setPageIndex] = useState(0)
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: groupData,
    columns: parentTable.getAllColumns(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      rowSelection,
      columnVisibility: parentTable.getState().columnVisibility,
      pagination: {
        pageSize: pageSize,
        pageIndex: pageIndex,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({
          pageIndex,
          pageSize,
        })
        setPageIndex(newState.pageIndex)
      }
    },
    manualPagination: false,
    pageCount: Math.ceil(groupData.length / pageSize),
    enableFilters: false,
    enableSorting: false,
    enableHiding: true,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
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
                <TableCell colSpan={columns.length} className='h-24 text-center text-muted-foreground'>
                  没有符合筛选条件的数据
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
