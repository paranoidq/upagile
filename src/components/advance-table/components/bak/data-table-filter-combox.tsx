'use client'

import * as React from 'react'
import { ChevronDownIcon, PlusIcon, TextIcon } from '@radix-ui/react-icons'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import type { DataTableFilterOption } from '../types'

interface DataTableFilterComboboxProps<TData> {
  selectableOptions: DataTableFilterOption<TData>[]
  selectedOptions: DataTableFilterOption<TData>[]
  setSelectedOptions: React.Dispatch<React.SetStateAction<DataTableFilterOption<TData>[]>>
  onSelect: () => void
  children?: React.ReactNode
}

export function DataTableFilterCombobox<TData>({
  selectableOptions,
  selectedOptions,
  setSelectedOptions,
  onSelect,
  children,
}: DataTableFilterComboboxProps<TData>) {
  const [value, setValue] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [selectedOption, setSelectedOption] = React.useState<DataTableFilterOption<TData>>(
    selectableOptions[0] ?? ({} as DataTableFilterOption<TData>),
  )

  const buttonRef = React.useRef<HTMLButtonElement>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        className='w-[12.5rem] p-0 dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'
        align='start'
      >
        <Command className='dark:bg-transparent'>
          <CommandInput placeholder='Filter by...' />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {selectableOptions.map((option) => (
                <CommandItem
                  key={String(option.value)}
                  className='capitalize'
                  value={String(option.value)}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                    setSelectedOption(option)
                    setSelectedOptions((prev) => {
                      return [...prev, { ...option }]
                    })
                    onSelect()
                  }}
                >
                  {option.options.length > 0 ? (
                    <ChevronDownIcon className='mr-2 size-4' aria-hidden='true' />
                  ) : (
                    <TextIcon className='mr-2 size-4' aria-hidden='true' />
                  )}
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <Separator />

            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  setSelectedOptions([
                    ...selectedOptions,
                    {
                      id: crypto.randomUUID(),
                      label: selectedOption?.label ?? '',
                      value: selectedOption?.value ?? '',
                      options: selectedOption?.options ?? [],
                      isMulti: true,
                    },
                  ])
                  onSelect()
                }}
              >
                <PlusIcon className='mr-2 size-4' aria-hidden='true' />
                Advanced filter
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
