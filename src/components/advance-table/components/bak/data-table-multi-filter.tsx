import * as React from 'react'
import { CopyIcon, DotsHorizontalIcon, TextAlignCenterIcon, TrashIcon } from '@radix-ui/react-icons'
import { useRouter, useSearch } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { useDebounce } from '../hooks/use-debounce'
import { useTableInstanceContext } from '../table-instance-provider'
import { DataTableConfig, dataTableConfig, SearchParams, type DataTableFilterOption } from '../types'
import { DataTableFacetedFilter } from './data-table-facted-filter'

interface DataTableMultiFilterProps<TData> {
  allOptions: DataTableFilterOption<TData>[]
  options: DataTableFilterOption<TData>[]
  selectedOptions: DataTableFilterOption<TData>[]
  setSelectedOptions: React.Dispatch<React.SetStateAction<DataTableFilterOption<TData>[]>>
  defaultOpen: boolean
}

export function DataTableMultiFilter<TData>({
  allOptions,
  options,
  selectedOptions,
  setSelectedOptions,
  defaultOpen,
}: DataTableMultiFilterProps<TData>) {
  const router = useRouter()
  const searchParams = useSearch({ strict: false }) as SearchParams

  const currentOperator = dataTableConfig.logicalOperators.find((operator) => searchParams.operator === operator.value)

  const [open, setOpen] = React.useState(defaultOpen)
  const [operator, setOperator] = React.useState(currentOperator ?? dataTableConfig.logicalOperators[0])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-7 truncate rounded-full'>
          <TextAlignCenterIcon className='mr-2 size-3' aria-hidden='true' />
          {options.length} rule
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-fit p-0 text-xs dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'
        align='start'
      >
        <div className='space-y-2 p-4'>
          {options.map((option, i) => (
            <MultiFilterRow
              key={option.id ?? i}
              i={i}
              option={option}
              allOptions={allOptions}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              operator={operator}
              setOperator={setOperator}
            />
          ))}
        </div>
        <Separator />
        <div className='p-1'>
          <Button
            aria-label='Delete filter'
            variant='ghost'
            size='sm'
            className='w-full justify-start'
            onClick={() => {
              setSelectedOptions((prev) => prev.filter((item) => !item.isMulti))

              const paramsObj: Record<string, null | string> = {}
              for (const option of options) {
                paramsObj[option.value as string] = null
              }
              paramsObj.operator = 'and'

              router.navigate({
                to: '.',
                resetScroll: false,
                search: (prev) => ({
                  ...prev,
                  ...paramsObj,
                }),
              })
            }}
          >
            Delete filter
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface MultiFilterRowProps<TData> {
  i: number
  allOptions: DataTableFilterOption<TData>[]
  option: DataTableFilterOption<TData>
  selectedOptions: DataTableFilterOption<TData>[]
  setSelectedOptions: React.Dispatch<React.SetStateAction<DataTableFilterOption<TData>[]>>
  operator?: DataTableConfig['logicalOperators'][number]
  setOperator: React.Dispatch<React.SetStateAction<DataTableConfig['logicalOperators'][number] | undefined>>
}

export function MultiFilterRow<TData>({
  i,
  option,
  allOptions,
  selectedOptions,
  setSelectedOptions,
  operator,
  setOperator,
}: MultiFilterRowProps<TData>) {
  const router = useRouter()
  const searchParams = useSearch({ strict: false })

  const value = option.filterValues?.[0] ?? ''
  const debounceValue = useDebounce(value, 500)

  const { tableInstance: table } = useTableInstanceContext()

  const column = table.getColumn(option.value ? String(option.value) : '')

  const comparisonOperators =
    option.options.length > 0 ? dataTableConfig.selectableOperators : dataTableConfig.comparisonOperators

  const comparisonOperator =
    comparisonOperators.find((operator) => operator.value === option.filterOperator) ?? comparisonOperators[0]

  const [mounted, setMounted] = React.useState(false)

  // Update query string
  React.useEffect(() => {
    if (!mounted) {
      setMounted(true)
      return
    }

    if (option.options.length > 0) {
      // key=value1.value2.value3~operator
      const filterValues = option.filterValues ?? []
      router.navigate({
        to: '.',
        resetScroll: false,
        search: (prev) => ({
          ...prev,
          [String(option.value)]:
            filterValues.length > 0 ? `${filterValues.join('.')}~${comparisonOperator?.value}~multi` : null,
        }),
      })
    } else {
      // key=value~operator
      router.navigate({
        to: '.',
        resetScroll: false,
        search: (prev) => ({
          ...prev,
          [String(option.value)]: `${debounceValue}~${comparisonOperator?.value}`,
        }),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceValue, comparisonOperator?.value, option])

  // Update operator query string
  React.useEffect(() => {
    if (operator?.value) {
      router.navigate({
        to: '.',
        resetScroll: false,
        search: (prev) => ({
          ...prev,
          operator: operator.value,
        }),
      })
    }
  }, [operator?.value])

  // Update operator state when operator params is changed
  React.useEffect(() => {
    const newOperator = dataTableConfig.logicalOperators.find((operator) => searchParams.operator === operator.value)

    if (newOperator) {
      setOperator(newOperator)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.operator])

  return (
    <div className='flex items-center space-x-2'>
      {i === 0 ? (
        <div>Where</div>
      ) : i === 1 ? (
        <Select
          value={operator?.value}
          onValueChange={(value) => setOperator(dataTableConfig.logicalOperators.find((o) => o.value === value))}
        >
          <SelectTrigger className='h-8 w-fit text-xs'>
            <SelectValue placeholder={operator?.label} />
          </SelectTrigger>
          <SelectContent className='dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'>
            <SelectGroup>
              {dataTableConfig.logicalOperators.map((operator) => (
                <SelectItem key={operator.value} value={operator.value} className='text-xs'>
                  {operator.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <div key={operator?.value}>{operator?.label}</div>
      )}
      <Select
        disabled={!!option.filterValues?.filter(Boolean).length}
        value={String(option.value)}
        onValueChange={(value) => {
          const chosenOption = allOptions.find((option) => option.value === value)
          if (!chosenOption) return

          setSelectedOptions((prev) =>
            prev.map((item) => {
              if (item.id === option.id) {
                return {
                  ...item,
                  value: chosenOption.value,
                  label: chosenOption.label,
                  options: chosenOption.options ?? [],
                }
              }
              return item
            }),
          )
        }}
      >
        <SelectTrigger className='h-8 w-full text-xs capitalize'>
          <SelectValue placeholder={option.label} />
        </SelectTrigger>
        <SelectContent className='dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'>
          <SelectGroup>
            {allOptions.map((option) => (
              <SelectItem key={String(option.value)} value={String(option.value)} className='text-xs capitalize'>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={comparisonOperator?.value}
        onValueChange={(value) => {
          setSelectedOptions((prev) =>
            prev.map((item) => {
              if (item.value === column?.id) {
                return {
                  ...item,
                  filterOperator: value,
                }
              }
              return item
            }),
          )
        }}
      >
        <SelectTrigger className='h-8 w-full truncate px-2 py-0.5 hover:bg-muted/50'>
          <SelectValue placeholder={comparisonOperators[0]?.label} />
        </SelectTrigger>
        <SelectContent className='dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'>
          <SelectGroup>
            {comparisonOperators.map((operator) => (
              <SelectItem key={operator.value} value={operator.value}>
                {operator.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* 如果是选项，渲染DataTableFacetedFilter，否则渲染Input */}
      {option.options.length ? (
        <DataTableFacetedFilter
          key={option.id}
          column={column}
          title={option.label}
          options={option.options}
          selectedOption={option}
          setSelectedOptions={setSelectedOptions}
        />
      ) : (
        <Input
          placeholder='Type here...'
          className='h-8'
          value={value}
          onChange={(event) =>
            setSelectedOptions((prev) =>
              prev.map((item) => {
                if (item.value === column?.id) {
                  return {
                    ...item,
                    filterValues: [event.target.value],
                  }
                }
                return item
              }),
            )
          }
          autoFocus
        />
      )}

      {/* 点点点：删除或duplicate当前行的filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' aria-label='Open filter menus' size='icon' className='size-8 shrink-0'>
            <DotsHorizontalIcon className='size-4' aria-hidden='true' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'>
          <DropdownMenuItem
            onClick={() => {
              setSelectedOptions((prev) => prev.filter((item) => item.id !== option.id))

              // Only remove the option with no filter value
              // if there are other options for the same column
              const optionsForSameColumn = selectedOptions.filter((o) => o.id !== option.id && o.filterValues?.length)
              if (optionsForSameColumn.length) return

              const paramsObj: Record<string, null | string> = {
                [String(option.value)]: null,
              }
              // Reset operator to "and" when the filter option being removed is the last one
              if (selectedOptions.length === 1) {
                paramsObj.operator = 'and'
              }
              router.navigate({
                to: '.',
                search: (prev) => ({ ...prev, paramsObj }),
                resetScroll: false,
              })
            }}
          >
            <TrashIcon className='mr-2 size-4' aria-hidden='true' />
            Remove
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              if (!option) return

              setSelectedOptions((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  label: option.label,
                  value: option.value,
                  options: option.options ?? [],
                  isMulti: true,
                },
              ])
            }}
          >
            <CopyIcon className='mr-2 size-4' aria-hidden='true' />
            Duplicate
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
