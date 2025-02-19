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
}

export const DataTable = <TData extends BaseData>({ table: parentTable, groupData = [] }: Props<TData>) => {
  // 为每个分组创建独立的表格实例
  const table = useReactTable({
    data: groupData,
    columns: parentTable.getAllColumns(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnVisibility: parentTable.getState().columnVisibility,
    },
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
