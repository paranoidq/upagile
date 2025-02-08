import { IconArrowsSort } from '@tabler/icons-react'
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd'
import { GripVertical, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToolbarProps } from './types'

export function SortToolbar<TData>({
  table,
  open,
  conditions,
  setConditions,
  form,
  onOpenChange,
  onSubmit,
  onCancel,
}: ToolbarProps<TData>) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }
    const items = Array.from(conditions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setConditions(items)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 lg:flex'>
          <IconArrowsSort className='mr-2 h-4 w-4' />
          排序
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[600px] p-2' side='bottom' align='start'>
        <Form {...form}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId='sortConditions'>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className='space-y-2 max-h-[280px] overflow-y-auto overflow-x-hidden p-1'
                >
                  {conditions.map((_, index) => (
                    <Draggable key={`sort-${index}`} draggableId={`sort-${index}`} index={index}>
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
                          <div {...provided.dragHandleProps} className='px-2 py-1'>
                            <GripVertical className='h-4 w-4 cursor-grab active:cursor-grabbing' />
                          </div>

                          <FormField
                            control={form.control}
                            name={`field-${index}`}
                            render={({ field }) => (
                              <FormItem className='flex-1'>
                                <Select value={field.value || ''} onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='选择字段' />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {table
                                      .getAllColumns()
                                      .filter((column) => column.id !== 'select')
                                      .map((column) => (
                                        <SelectItem key={column.id} value={column.id}>
                                          {column.id}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`direction-${index}`}
                            render={({ field }) => (
                              <FormItem className='flex-1'>
                                <Select value={field.value || 'asc'} onValueChange={field.onChange}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder='选择顺序' />
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
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 hover:bg-red-50 hover:text-red-600'
                            onClick={() => {
                              const newConditions = conditions.filter((_, i) => i !== index)
                              setConditions(newConditions)
                            }}
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
            onClick={() => {
              setConditions([...conditions, { field: '', direction: 'asc' }])
            }}
            className='mt-4 hover:text-blue-600'
          >
            添加条件
          </Button>
        </Form>
        <div className='flex justify-end space-x-2 p-4 mt-2 border-t'>
          <Button type='button' variant='outline' onClick={onCancel}>
            取消
          </Button>
          <Button type='button' onClick={onSubmit}>
            确定
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
