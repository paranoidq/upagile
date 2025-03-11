import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons'
import { useSearch } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTableInstanceContext } from '@/components/advance-table/table-instance-provider'

interface DataTablePaginationProps {
  pageSizeOptions?: number[]
}

export function DataTablePagination({ pageSizeOptions = [10, 20, 30, 40, 50] }: DataTablePaginationProps) {
  const { tableInstance: table } = useTableInstanceContext()
  const { page, per_page: perPage } = useSearch({ strict: false })

  return (
    <div className='flex w-full flex-col-reverse items-center justify-between gap-4 overflow-auto p-1 sm:flex-row sm:gap-8'>
      <div className='flex-1 whitespace-nowrap text-sm text-muted-foreground'>
        {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className='flex flex-col-reverse items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
        <div className='flex items-center space-x-2'>
          <p className='whitespace-nowrap text-sm font-medium'>Rows per page</p>
          <Select
            value={`${perPage}`}
            onValueChange={(value) => {
              table.setPageIndex(0)
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className='h-8 w-[4.5rem]'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent
              side='top'
              className='dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'
            >
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center justify-center text-sm font-medium'>
          Page {page} of {table.getPageCount()}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            aria-label='Go to first page'
            variant='outline'
            className='hidden size-8 p-0 lg:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <DoubleArrowLeftIcon className='size-4' aria-hidden='true' />
          </Button>
          <Button
            aria-label='Go to previous page'
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className='size-4' aria-hidden='true' />
          </Button>
          <Button
            aria-label='Go to next page'
            variant='outline'
            size='icon'
            className='size-8'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className='size-4' aria-hidden='true' />
          </Button>
          <Button
            aria-label='Go to last page'
            variant='outline'
            size='icon'
            className='hidden size-8 lg:flex'
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <DoubleArrowRightIcon className='size-4' aria-hidden='true' />
          </Button>
        </div>
      </div>
    </div>
  )
}
