import React from 'react'
import { useRouter, useSearch } from '@tanstack/react-router'
import { isEqual } from 'lodash'
import { PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useTableInstanceContext } from '../table-instance-provider'
import { DataTableFilterField, DataTableFilterOption, SearchParams } from '../types'
import { calcFilterParams, calcViewSearchParams, getIsFiltered } from '../utils/utils'
import { DataTableColumnsVisibility } from './data-table-column-visibility'
import { DataTableFilterCombobox } from './data-table-filter-combox'
import { DataTableFilterItem } from './data-table-filter-item'
import { DataTableMultiFilter } from './data-table-multi-filter'
import { CreateViewPopover } from './views/create-view-popover'
import { DataTableViewsDropdown } from './views/data-table-view-dropdown'
import { View } from './views/types'
import UpdateViewForm from './views/update-view-form'

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

  // 所有支持过滤和隐藏的列
  const ALL_COLUMNS = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
    .map((column) => column.id)

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
  const [openCombobox, setOpenCombobox] = React.useState(false)

  function onFilterComboboxItemSelect() {
    setOpenCombobox(true)
  }

  const multiFilterOptions = React.useMemo(() => selectedOptions.filter((option) => option.isMulti), [selectedOptions])

  const selectableOptions = options.filter(
    (option) => !selectedOptions.some((selectedOption) => selectedOption.value === option.value),
  )

  // 计算是否需要过滤
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

  // 计算当前view是否需要更新（列可见性是否调整 or 过滤条件是否调整）
  const isColumnsUpdated = currentView ? !isEqual(currentView?.columns, columns) : !isEqual(ALL_COLUMNS, columns)
  const isDefaultViewUpdated = !currentView && (isFiltered || isColumnsUpdated)
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
  }, [search])

  return (
    <div className={cn('flex w-full flex-col space-y-2.5 overflow-auto p-1', className)} {...props}>
      <div className='flex flex-col items-end justify-between gap-3 sm:flex-row sm:items-center'>
        <DataTableViewsDropdown views={views} filterParams={filterParams} />

        <div className='flex items-center gap-2'>
          {/* 自定义toolbar actions */}
          {children}

          {/* 列可见性 */}
          <DataTableColumnsVisibility />
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex h-8 items-center gap-2'>
          {/* 展示单选过滤条件 */}
          {selectedOptions
            .filter((option) => !option.isMulti)
            .map((selectedOption) => (
              <DataTableFilterItem
                key={String(selectedOption.value)}
                selectedOption={selectedOption}
                setSelectedOptions={setSelectedOptions}
                defaultOpen={openCombobox}
              />
            ))}

          {/* 展示多选过滤条件 */}
          {selectedOptions.some((option) => option.isMulti) ? (
            <DataTableMultiFilter
              allOptions={options}
              options={multiFilterOptions}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              defaultOpen={openCombobox}
            />
          ) : null}

          {/* 添加过滤条件button和combox */}
          {selectableOptions.length > 0 ? (
            <DataTableFilterCombobox
              selectableOptions={selectableOptions}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              onSelect={onFilterComboboxItemSelect}
            >
              <Button
                variant='outline'
                size='sm'
                role='combobox'
                className='h-7 rounded-full'
                onClick={() => setOpenCombobox(true)}
              >
                <PlusIcon className='mr-2 size-4 opacity-50' aria-hidden='true' />
                Add filter
              </Button>
            </DataTableFilterCombobox>
          ) : null}
        </div>

        <div className='ml-auto flex items-center gap-2'>
          {/* 如果不是默认视图，则可以重置到当前视图 */}
          {isUpdated && currentView && (
            <Button variant='ghost' size='sm' onClick={resetToCurrentView}>
              Reset
            </Button>
          )}

          {/* 如果是默认视图，则可以创建新视图 */}
          {isDefaultViewUpdated && !currentView && <CreateViewPopover selectedOptions={selectedOptions} />}

          {/* 更新视图 */}
          <UpdateViewForm isUpdated={isUpdated} currentView={currentView} filterParams={filterParams} />
        </div>
      </div>
    </div>
  )
}
