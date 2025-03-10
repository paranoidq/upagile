import { useFieldArray, useForm } from 'react-hook-form'
import { IconFolders } from '@tabler/icons-react'
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd'
import { GripVertical, HelpCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge.tsx'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { ToolbarProps } from './types'

type GroupFormValues = {
  groups: {
    field: string
    direction: string
  }[]
}

export function GroupToolbar<TData>({ table, open, onOpenChange, currentView }: ToolbarProps<TData>) {
  const form = useForm<GroupFormValues>({
    defaultValues: {
      groups: currentView?.conditions?.groups || [],
    },
  })

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: 'groups',
  })

  const onSubmit = (values: GroupFormValues) => {
    const formData = {
      groups: values.groups.filter((group) => group.field),
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
          <IconFolders className='mr-2 h-4 w-4' />
          分组
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
              <Droppable droppableId='groupsConditions'>
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
                              'grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2 bg-background rounded-md w-full',
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
                              name={`groups.${index}.field`}
                              render={({ field: formField }) => {
                                const usedFields = form
                                  .getValues()
                                  .groups.map((f) => f.field)
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
                              name={`groups.${index}.direction`}
                              render={({ field: formField }) => (
                                <FormItem className='flex-1'>
                                  <Select value={formField.value || 'asc'} onValueChange={formField.onChange}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder='选择条件' />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value='asc'>升序</SelectItem>
                                      <SelectItem value='desc'>降序</SelectItem>
                                    </SelectContent>
                                  </Select>
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

            <div className='flex items-center mt-4'>
              <Button
                type='button'
                variant='link'
                disabled={fields.length > 0}
                onClick={() => append({ field: '', direction: 'asc' })}
                className='hover:text-blue-600'
              >
                添加条件
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className='h-4 w-4 text-muted-foreground cursor-help' />
                  </TooltipTrigger>
                  <TooltipContent>当前仅支持一个分组</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

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
