import * as React from 'react'
import { TrashIcon } from '@radix-ui/react-icons'
import { useRouter } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDebounce } from '../hooks/use-debounce'
import { useTableInstanceContext } from '../table-instance-provider'
import { dataTableConfig, type DataTableFilterOption } from '../types'
import { DataTableAdvancedFacetedFilter } from './data-table-advanced-facted-filter'

interface DataTableFilterItemProps<TData> {
  selectedOption: DataTableFilterOption<TData>
  setSelectedOptions: React.Dispatch<React.SetStateAction<DataTableFilterOption<TData>[]>>
  defaultOpen: boolean
}

export function DataTableFilterItem<TData>({
  selectedOption,
  setSelectedOptions,
  defaultOpen,
}: DataTableFilterItemProps<TData>) {
  const router = useRouter()

  const { tableInstance: table } = useTableInstanceContext()

  // 选中的列、values、operator
  const column = table.getColumn(selectedOption.value ? String(selectedOption.value) : '')
  const selectedValues = new Set(selectedOption.filterValues)
  const comparisonOperators =
    selectedOption.options.length > 0 ? dataTableConfig.selectableOperators : dataTableConfig.comparisonOperators

  const value = selectedOption.filterValues?.[0] ?? ''
  const debounceValue = useDebounce(value, 500)
  const [open, setOpen] = React.useState(defaultOpen)

  const selectedOperator =
    comparisonOperators.find((operator) => operator.value === selectedOption.filterOperator) ?? comparisonOperators[0]

  React.useEffect(() => {
    if (selectedOption.options.length > 0) {
      // key=value1.value2.value3~operator
      const filterValues = selectedOption.filterValues ?? []

      router.navigate({
        to: '.',
        resetScroll: false,
        search: (prev) => ({
          ...prev,
          [String(selectedOption.value)]:
            filterValues.length > 0 ? `${filterValues.join('.')}~${selectedOperator?.value}` : null,
        }),
      })
    } else {
      // key=value~operator
      router.navigate({
        to: '.',
        resetScroll: false,
        search: (prev) => ({
          ...prev,
          [String(selectedOption.value)]: value.length > 0 ? `${value}~${selectedOperator?.value}` : null,
        }),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, debounceValue, selectedOperator?.value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn(
            'h-7 gap-0 truncate rounded-full',
            (selectedValues.size > 0 || value.length > 0) && 'bg-muted/50',
          )}
        >
          <span className='font-medium capitalize'>{selectedOption.label}</span>
          {selectedOption.options.length > 0
            ? selectedValues.size > 0 && (
                <span className='text-muted-foreground'>
                  <span className='text-foreground'>: </span>
                  {selectedValues.size > 2
                    ? `${selectedValues.size} selected`
                    : selectedOption.options
                        .filter((item) => selectedValues.has(item.value))
                        .map((item) => item.label)
                        .join(', ')}
                </span>
              )
            : value.length > 0 && (
                <span className='text-muted-foreground'>
                  <span className='text-foreground'>: </span>
                  {value}
                </span>
              )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className='w-60 space-y-1.5 p-2 dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'
        align='start'
      >
        <div className='flex items-center space-x-1 pl-1 pr-0.5'>
          <div className='flex flex-1 items-center space-x-1'>
            <div className='text-xs capitalize text-muted-foreground'>{selectedOption.label}</div>
            <Select
              value={selectedOperator?.value}
              onValueChange={(value) =>
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
              }
            >
              <SelectTrigger className='h-auto w-fit truncate border-none px-2 py-0.5 text-xs hover:bg-muted/50'>
                <SelectValue placeholder={selectedOperator?.label} />
              </SelectTrigger>
              <SelectContent className='dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'>
                <SelectGroup>
                  {comparisonOperators.map((item) => (
                    <SelectItem key={item.value} value={item.value} className='py-1'>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button
            aria-label='Remove filter'
            variant='ghost'
            size='icon'
            className='size-7 text-muted-foreground'
            onClick={() => {
              setSelectedOptions((prev) => prev.filter((item) => item.value !== selectedOption.value))

              router.navigate({
                to: '.',
                search: (prev) => ({
                  ...prev,
                  [String(selectedOption.value)]: null,
                }),
              })
            }}
          >
            <TrashIcon className='size-4' aria-hidden='true' />
          </Button>
        </div>
        {selectedOption.options.length > 0 ? (
          column && (
            <DataTableAdvancedFacetedFilter
              key={String(selectedOption.value)}
              column={column}
              title={selectedOption.label}
              options={selectedOption.options}
              selectedValues={selectedValues}
              setSelectedOptions={setSelectedOptions}
            />
          )
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
      </PopoverContent>
    </Popover>
  )
}
