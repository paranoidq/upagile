import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { FilterIcon, GripVertical, PlusIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ViewType } from '../../types'

interface FilterToolbarProps {
  currentView?: ViewType
  onUpdate?: (view: ViewType) => Promise<void>
}

type FilterFormValues = {
  filters: {
    field: string
    operator: string
    value: string
  }[]
}

export function FilterToolbar({ currentView, onUpdate }: FilterToolbarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<FilterFormValues>({
    defaultValues: {
      filters: currentView?.conditions?.filters || [],
    },
  })

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'filters',
  })

  const onSubmit = async (values: FilterFormValues) => {
    if (!currentView || !onUpdate) return

    await onUpdate({
      ...currentView,
      conditions: {
        ...currentView.conditions,
        filters: values.filters,
      },
    })

    setIsOpen(false)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return
    move(result.source.index, result.destination.index)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8'>
          <PlusIcon className='mr-2 h-4 w-4' />
          添加筛选
          <FilterIcon className='ml-2 h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-96 p-4' align='start'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId='filters'>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-4'>
                    {fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className='flex items-center gap-2 rounded-lg border p-4'
                          >
                            <div {...provided.dragHandleProps} className='cursor-move'>
                              <GripVertical className='h-5 w-5 text-muted-foreground' />
                            </div>
                            <div className='flex flex-1 gap-2'>
                              <FormField
                                control={form.control}
                                name={`filters.${index}.field`}
                                render={({ field }) => (
                                  <FormItem className='flex-1'>
                                    <FormControl>
                                      <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                          <SelectValue placeholder='选择字段' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value='title'>标题</SelectItem>
                                          <SelectItem value='status'>状态</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`filters.${index}.operator`}
                                render={({ field }) => (
                                  <FormItem className='flex-1'>
                                    <FormControl>
                                      <Select value={field.value} onValueChange={field.onChange}>
                                        <SelectTrigger>
                                          <SelectValue placeholder='选择操作符' />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value='equals'>等于</SelectItem>
                                          <SelectItem value='contains'>包含</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`filters.${index}.value`}
                                render={({ field }) => (
                                  <FormItem className='flex-1'>
                                    <FormControl>
                                      <Input {...field} placeholder='输入值' />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Button
                              type='button'
                              variant='ghost'
                              size='sm'
                              className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'
                              onClick={() => remove(index)}
                            >
                              <span className='sr-only'>删除</span>
                              <X className='h-4 w-4' />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <Button
              type='button'
              variant='outline'
              size='sm'
              className='mt-2'
              onClick={() => append({ field: '', operator: '', value: '' })}
            >
              <PlusIcon className='mr-2 h-4 w-4' />
              添加条件
            </Button>

            <div className='flex justify-end space-x-2'>
              <Button type='button' variant='outline' onClick={() => setIsOpen(false)}>
                取消
              </Button>
              <Button type='submit'>确定</Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
