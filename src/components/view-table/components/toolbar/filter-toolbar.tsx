import { useFieldArray, useForm } from 'react-hook-form'
import { IconFilterCog } from '@tabler/icons-react'
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd'
import { GripVertical, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { filterOperatorEnum, getFilterOperatorName } from '../../types'
import { ToolbarProps } from './types'

type FilterFormValues = {
  filters: {
    field: string
    operator: string
    value: string
  }[]
}

export function FilterToolbar<TData>({ table, open, onOpenChange, currentView }: ToolbarProps<TData>) {
  const form = useForm<FilterFormValues>({
    defaultValues: {
      filters: currentView?.conditions?.filters || [],
    },
  })

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'filters',
  })

  const onSubmit = (values: FilterFormValues) => {
    const formData = {
      filters: values.filters.filter((filter) => filter.field && filter.operator && filter.value),
    }
    onOpenChange(false)
    alert(JSON.stringify(formData, null, 2))
  }

  const onCancel = () => {
    form.reset()
    onOpenChange(false)
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    move(result.source.index, result.destination.index)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) {
          form.reset()
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 lg:flex'>
          <IconFilterCog className='mr-2 h-4 w-4' />
          筛选
          <Badge
            variant='secondary'
            className={cn('ml-2 h-5 px-1.5', fields.length > 0 ? 'bg-red-200' : 'bg-gray-200')}
          >
            {fields.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[600px] p-2' side='bottom' align='start'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId='filterConditions'>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className='space-y-2 max-h-[280px] overflow-y-auto overflow-x-hidden p-1'
                  >
                    {fields.map((field, index) => (
                      <Draggable key={field.id} draggableId={field.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cn(
                              'grid grid-cols-[auto_1fr_1fr_2fr_auto] items-center gap-2 bg-background rounded-md w-full',
                              snapshot.isDragging && ['shadow-lg', 'ring-2 ring-primary'],
                            )}
                            style={{
                              ...provided.draggableProps.style,
                              left: 'auto',
                              top: 'auto',
                            }}
                          >
                            <div {...provided.dragHandleProps} className='px-2'>
                              <GripVertical className='h-4 w-4 cursor-grab active:cursor-grabbing' />
                            </div>

                            <FormField
                              control={form.control}
                              name={`filters.${index}.field`}
                              render={({ field: formField }) => {
                                const usedFields = form
                                  .getValues()
                                  .filters.map((f) => f.field)
                                  .filter((f) => f !== formField.value)

                                return (
                                  <FormItem className='flex-1'>
                                    <Select value={formField.value} onValueChange={formField.onChange}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder='选择字段' />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {table
                                          .getAllColumns()
                                          .filter(
                                            (column) =>
                                              column.id !== 'select' &&
                                              column.id !== 'actions' &&
                                              !usedFields.includes(column.id),
                                          )
                                          .map((column) => (
                                            <SelectItem key={column.id} value={column.id}>
                                              {column.id}
                                            </SelectItem>
                                          ))}
                                      </SelectContent>
                                    </Select>
                                  </FormItem>
                                )
                              }}
                            />

                            <FormField
                              control={form.control}
                              name={`filters.${index}.operator`}
                              render={({ field: formField }) => (
                                <FormItem className='flex-1'>
                                  <Select value={formField.value} onValueChange={formField.onChange}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder='选择条件' />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {filterOperatorEnum._def.values.map((value) => (
                                        <SelectItem key={value} value={value}>
                                          {getFilterOperatorName(value)}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`filters.${index}.value`}
                              render={({ field: formField }) => (
                                <FormItem className='flex-1'>
                                  <FormControl>
                                    <Input {...formField} placeholder='输入值' />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <Button
                              type='button'
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 hover:bg-red-50 hover:text-red-600'
                              onClick={() => remove(index)}
                            >
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
              variant='link'
              onClick={() => append({ field: '', operator: '', value: '' })}
              className='mt-4 hover:text-blue-600'
            >
              添加条件
            </Button>

            <div className='flex justify-end space-x-2 p-4 mt-2 border-t'>
              <Button type='button' variant='outline' onClick={onCancel}>
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
