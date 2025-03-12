import { useState } from 'react'
import { CaretDownIcon, Pencil1Icon, PlusIcon } from '@radix-ui/react-icons'
import { useRouter, useSearch } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { View } from '@/components/view-table/types'
import { ViewCreateForm } from './view-create-form'
import { ViewEditForm } from './view-edit-form'

interface DataTableViewsDropdownProps {
  views: View[]
  filterParams: FilterParams
}

export function DataTableViewsDropdown({ views, filterParams }: DataTableViewsDropdownProps) {
  const router = useRouter()
  const search = useSearch({ strict: false })

  const [open, setOpen] = useState(false)
  const [isCreateViewFormOpen, setIsCreateViewFormOpen] = useState(false)
  const [isEditViewFormOpen, setIsEditViewFormOpen] = useState(false)
  const [selectedView, setSelectedView] = useState<View | null>(null)

  const currentView = views.find((view) => view.id === search.viewId)

  function selectView(view: View) {
    router.navigate({ to: '.', search: { viewId: view.id }, resetScroll: false })
  }

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        setIsCreateViewFormOpen(false)
        setIsEditViewFormOpen(false)
      }}
    >
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='flex w-36 shrink-0 justify-between'>
          <span className='truncate'>{currentView?.name || '默认视图'}</span>
          <CaretDownIcon aria-hidden='true' className='size-4 shrink-0' />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className='w-[12.5rem] p-0 dark:bg-background/95 dark:backdrop-blur-md dark:supports-[backdrop-filter]:bg-background/40'
        align='start'
      >
        {isCreateViewFormOpen && (
          <ViewCreateForm
            backButton
            onBack={() => setIsCreateViewFormOpen(false)}
            filterParams={filterParams}
            onSuccess={() => setOpen(false)}
          />
        )}

        {isEditViewFormOpen && selectedView && (
          <ViewEditForm view={selectedView} setIsEditViewFormOpen={setIsEditViewFormOpen} />
        )}

        {!isCreateViewFormOpen && !isEditViewFormOpen && (
          <Command className='dark:bg-transparent'>
            <CommandInput placeholder='View name' />
            <CommandList>
              <CommandEmpty>No item found.</CommandEmpty>
              <CommandGroup className='max-h-48 overflow-auto'>
                <CommandItem
                  value='default'
                  onSelect={() => {
                    router.navigate({ to: '.', resetScroll: false })
                    setOpen(false)
                  }}
                >
                  默认视图
                </CommandItem>
                {views.map((view) => (
                  <CommandItem
                    key={view.id}
                    value={view.name}
                    className='group justify-between'
                    onSelect={() => {
                      selectView(view)
                      setOpen(false)
                    }}
                  >
                    <span className='truncate'>{view.name}</span>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='invisible size-5 shrink-0 hover:bg-neutral-200 group-hover:visible dark:hover:bg-neutral-700'
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsEditViewFormOpen(true)
                        setSelectedView(view)
                      }}
                    >
                      <Pencil1Icon className='size-3' />
                    </Button>
                  </CommandItem>
                ))}
              </CommandGroup>
              <Separator />
              <CommandGroup>
                <CommandItem onSelect={() => setIsCreateViewFormOpen(true)}>
                  <PlusIcon className='mr-2 size-4' aria-hidden='true' />
                  Add view
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  )
}
