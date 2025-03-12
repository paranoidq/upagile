import React from 'react'
import { CaretSortIcon } from '@radix-ui/react-icons'
import { useRouter, useSearch } from '@tanstack/react-router'
import { isEqual } from 'lodash'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTableInstanceContext } from '../table-instance-provider'
import { DataTableFilterField, DataTableFilterOption, SearchParams } from '../types'
import { calcFilterParams, calcViewSearchParams, getIsFiltered } from '../utils/utils'
import { DataTableColumnsVisibility } from './data-table-column-visibility'
import { DataTableFilterCombobox } from './data-table-filter-combox'
import { DataTableViewsDropdown } from './views/data-table-view-dropdown'
import { View } from './views/types'

interface DataTableAdvancedToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  filterFields?: DataTableFilterField<TData>[]
  views: View[] | undefined
}

export function DataTableAdvancedToolbar<TData>({
  filterFields = [],
  views = [],
  children,
  className,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  const router = useRouter()
  const search = useSearch({ strict: false }) as SearchParams
  const { tableInstance: table } = useTableInstanceContext()

  // 解析出所有支持过滤的字段和取值
  const options = React.useMemo<DataTableFilterOption<TData>[]>(() => {
    return filterFields.map((field) => {
      return {
        id: crypto.randomUUID(),
        label: field.label,
        value: field.value,
        options: field.options ?? [],
      }
    })
  }, [filterFields])

  // 根据URL参数计算初始选中的过滤选项
  const initialSelectedOptions = React.useMemo(() => {
    return options
      .filter((option) => search[option.value as keyof SearchParams] !== undefined)
      .map((option) => {
        const value = search[option.value as keyof SearchParams]
        const [filterValue, filterOperator, isMulti] = String(value)?.split('~').filter(Boolean) ?? []

        return {
          ...option,
          filterValues: filterValue?.split('.') ?? [],
          filterOperator,
          isMulti: !!isMulti,
        }
      })
  }, [options, search])

  const [selectedOptions, setSelectedOptions] = React.useState<DataTableFilterOption<TData>[]>(initialSelectedOptions)
  const [openFilterBuilder, setOpenFilterBuilder] = React.useState(initialSelectedOptions.length > 0 || false)
  const [openCombobox, setOpenCombobox] = React.useState(false)

  function onFilterComboboxItemSelect() {
    setOpenFilterBuilder(true)
    setOpenCombobox(true)
  }

  const multiFilterOptions = React.useMemo(() => selectedOptions.filter((option) => option.isMulti), [selectedOptions])

  const selectableOptions = options.filter(
    (option) => !selectedOptions.some((selectedOption) => selectedOption.value === option.value),
  )

  const isFiltered = getIsFiltered(search)

  // view
  const viewId = search.viewId
  const currentView = views.find((view) => view.id === viewId)

  const columns = table
    .getVisibleFlatColumns()
    .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
    .map((column) => column.id)

  const filterParams = calcFilterParams(selectedOptions, {
    ...search,
    page: Number(search.page) || 1,
    per_page: Number(search.per_page) || 10,
  })

  const isColumnsUpdated = currentView
    ? !isEqual(currentView?.columns, columns)
    : !isEqual(table.getVisibleFlatColumns(), columns)
  const isDefaultViewUpdated = isFiltered || isColumnsUpdated
  const isUpdated = !isEqual(currentView?.filterParams, filterParams) || isColumnsUpdated

  function resetColumns(view: View) {
    alert('resetColumns')
  }

  function resetToCurrentView() {
    if (!currentView) return

    resetColumns(currentView)

    const searchObj = calcViewSearchParams(currentView)
    router.navigate({
      to: '.',
      search: searchObj,
    })
  }

  // update table state when search params are changed
  React.useEffect(() => {
    const searchParamsObj = search
    const newSelectedOptions: DataTableFilterOption<TData>[] = []

    for (const [key, value] of Object.entries(searchParamsObj) as [keyof SearchParams, string][]) {
      const option = options.find((option) => option.value === key)
      if (!option) continue

      const [filterValue, comparisonOperator, isMulti] = value.split('~') ?? []
      newSelectedOptions.push({
        ...option,
        filterValues: filterValue?.split('.') ?? [],
        filterOperator: comparisonOperator,
        isMulti: !!isMulti,
      })
    }

    setSelectedOptions(newSelectedOptions)
    if (newSelectedOptions.length > 0) {
      setOpenFilterBuilder(true)
    }
  }, [search])

  return (
    <div className={cn('flex w-full flex-col space-y-2.5 overflow-auto p-1', className)} {...props}>
      <div className='flex flex-col items-end justify-between gap-3 sm:flex-row sm:items-center'>
        <DataTableViewsDropdown views={views} filterParams={filterParams} />

        <div className='flex items-center gap-2'>
          {/* 自定义toolbar actions */}
          {children}

          {/* 展示当前的filter列表 */}
          {(options.length > 0 && selectedOptions.length > 0) || openFilterBuilder ? (
            <Button variant='outline' size='sm' onClick={() => setOpenFilterBuilder(!openFilterBuilder)}>
              <CaretSortIcon className='mr-2 size-4 shrink-0' aria-hidden='true' />
              Filter
            </Button>
          ) : (
            <DataTableFilterCombobox
              selectableOptions={selectableOptions}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              onSelect={onFilterComboboxItemSelect}
            />
          )}

          {/* 列可见性 */}
          <DataTableColumnsVisibility />
        </div>
      </div>

      <div className='flex items-center justify-between'>
        {/* filters and add filter button */}
        <div>filters and add filter button</div>

        {/* reset and update view */}
        <div className='ml-auto flex items-center gap-2'>
          {isUpdated && currentView && (
            <Button variant='ghost' size='sm' onClick={resetToCurrentView}>
              Reset
            </Button>
          )}

          {/* {isDefaultViewUpdated && !currentView && <CreateViewPopover selectedOptions={selectedOptions} />}

          <UpdateViewForm isUpdated={isUpdated} currentView={currentView} filterParams={filterParams} /> */}
        </div>
      </div>
    </div>
  )
}
