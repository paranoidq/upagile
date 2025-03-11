import * as React from 'react'
import { z } from 'zod'
import { useRouter, useSearch } from '@tanstack/react-router'
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { DataTableFilterField } from '../types'
import { useDebounce } from './use-debounce'

interface UseDataTableProps<TData, TValue> {
  /**
   * The data for the table.
   * @default []
   * @type TData[]
   */
  data: TData[]

  /**
   * The columns of the table.
   * @default []
   * @type ColumnDef<TData, TValue>[]
   */
  columns: ColumnDef<TData, TValue>[]

  /**
   * The number of pages in the table.
   * @type number
   */
  pageCount: number

  /**
   * The default number of rows per page.
   * @default 10
   * @type number | undefined
   * @example 20
   */
  defaultPerPage?: number

  /**
   * The default sort order.
   * @default undefined
   * @type `${Extract<keyof TData, string | number>}.${"asc" | "desc"}` | undefined
   * @example "createdAt.desc"
   */
  defaultSort?: `${Extract<keyof TData, string | number>}.${'asc' | 'desc'}`

  /**
   * Defines filter fields for the table. Supports both dynamic faceted filters and search filters.
   * - Faceted filters are rendered when `options` are provided for a filter field.
   * - Otherwise, search filters are rendered.
   *
   * The indie filter field `value` represents the corresponding column name in the database table.
   * @default []
   * @type { label: string, value: keyof TData, placeholder?: string, options?: { label: string, value: string, icon?: React.ComponentType<{ className?: string }> }[] }[]
   * @example
   * ```ts
   * // Render a search filter
   * const filterFields = [
   *   { label: "Title", value: "title", placeholder: "Search titles" }
   * ];
   * // Render a faceted filter
   * const filterFields = [
   *   {
   *     label: "Status",
   *     value: "status",
   *     options: [
   *       { label: "Todo", value: "todo" },
   *       { label: "In Progress", value: "in-progress" },
   *       { label: "Done", value: "done" },
   *       { label: "Canceled", value: "canceled" }
   *     ]
   *   }
   * ];
   * ```
   */
  filterFields?: DataTableFilterField<TData>[]
}

const schema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().optional(),
  sort: z.string().optional(),
})

export function useDataTable<TData, TValue>({
  data,
  columns,
  pageCount,
  defaultPerPage = 10,
  defaultSort,
  filterFields = [],
}: UseDataTableProps<TData, TValue>) {
  const router = useRouter()
  const pathname = router.state.location.pathname

  // 获取搜索参数
  const search = useSearch({
    from: '/_authenticated/backlog/',
    select: (s) => s,
  })

  console.log(search)

  // 使用 zod 解析和验证搜索参数
  const parsedSearch = schema.parse(search)

  const page = parsedSearch.page
  const perPage = parsedSearch.per_page ?? defaultPerPage
  const sort = parsedSearch.sort ?? defaultSort
  const [column, order] = sort?.split('.') ?? []

  // Memoize computation of searchableColumns and filterableColumns
  const { searchableColumns, filterableColumns } = React.useMemo(() => {
    return {
      searchableColumns: filterFields.filter((field) => !field.options),
      filterableColumns: filterFields.filter((field) => field.options),
    }
  }, [filterFields])

  // Initial column filters
  const initialColumnFilters: ColumnFiltersState = React.useMemo(() => {
    // 从 search 对象中提取过滤条件
    return Object.entries(search).reduce<ColumnFiltersState>((filters, [key, value]) => {
      const filterableColumn = filterableColumns.find((column) => column.value === key)
      const searchableColumn = searchableColumns.find((column) => column.value === key)

      if (filterableColumn && value) {
        filters.push({
          id: key,
          value: String(value).split('.'),
        })
      } else if (searchableColumn && value) {
        filters.push({
          id: key,
          value: [String(value)],
        })
      }

      return filters
    }, [])
  }, [filterableColumns, searchableColumns, search])

  // Table states
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(initialColumnFilters)

  // Handle server-side pagination
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: perPage,
  })

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  )

  // React.useEffect(() => {
  //   router.push(
  //     `${pathname}?${createQueryString(
  //       {
  //         page: pageIndex + 1,
  //         per_page: pageSize,
  //       },
  //       searchParams,
  //     )}`,
  //     {
  //       scroll: false,
  //     },
  //   )

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pageIndex, pageSize])

  // Handle server-side sorting
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: column ?? '',
      desc: order === 'desc',
    },
  ])

  // React.useEffect(() => {
  //   router.push(
  //     `${pathname}?${createQueryString(
  //       {
  //         page,
  //         sort: sorting[0]?.id ? `${sorting[0]?.id}.${sorting[0]?.desc ? 'desc' : 'asc'}` : undefined,
  //       },
  //       searchParams,
  //     )}`,
  //     { scroll: false },
  //   )
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sorting])

  // Handle server-side filtering
  const debouncedSearchableColumnFilters = JSON.parse(
    useDebounce(
      JSON.stringify(
        columnFilters.filter((filter) => {
          return searchableColumns.find((column) => column.value === filter.id)
        }),
      ),
      500,
    ),
  ) as ColumnFiltersState

  const filterableColumnFilters = columnFilters.filter((filter) => {
    return filterableColumns.find((column) => column.value === filter.id)
  })

  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    // Prevent resetting the page on initial render
    if (!mounted) {
      setMounted(true)
      return
    }

    // Initialize new params
    const newParamsObject = {
      page: 1,
    }

    // Handle debounced searchable column filters
    for (const column of debouncedSearchableColumnFilters) {
      if (typeof column.value === 'string') {
        Object.assign(newParamsObject, {
          [column.id]: column.value,
        })
      }
    }

    // Handle filterable column filters
    for (const column of filterableColumnFilters) {
      if (typeof column.value === 'object' && Array.isArray(column.value)) {
        Object.assign(newParamsObject, { [column.id]: column.value.join('.') })
      }
    }

    // Remove deleted values
    for (const key of Object.keys(search)) {
      if (
        (searchableColumns.find((column) => column.value === key) &&
          !debouncedSearchableColumnFilters.find((column) => column.id === key)) ||
        (filterableColumns.find((column) => column.value === key) &&
          !filterableColumnFilters.find((column) => column.id === key))
      ) {
        Object.assign(newParamsObject, { [key]: null })
      }
    }

    // After cumulating all the changes, push new params
    // router.push(`${pathname}?${createQueryString(newParamsObject, searchParams)}`, { scroll: false })

    table.setPageIndex(0)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(debouncedSearchableColumnFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(filterableColumnFilters),
  ])

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      pagination,
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    enableSorting: false,
    enableHiding: false,
  })

  return { table }
}
