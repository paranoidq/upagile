import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { IconFilterCog } from '@tabler/icons-react'
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd'
import { produce } from 'immer'
import { GripVertical, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input.tsx'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Condition } from '@/features/tasks/toolbar/types.ts'
import { filterOperatorEnum, getFilterOperatorName } from '@/features/tasks/types.ts'
import { ToolbarProps } from './types'

export function FilterToolbar<TData>({ table, open, onOpenChange, currentView }: ToolbarProps<TData>) {
  const initialConditions =
    currentView?.conditions?.filters?.map((filter) => ({
      field: filter.field,
      operator: filter.operator,
      value: filter.value,
    })) || []

  const [conditions, setConditions] = useState<Condition[]>(initialConditions)

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination || destination.index === source.index) {
      return
    }

    // update conditions
    const newConditions = produce(conditions, (draft) => {
      const [reorderedItem] = draft.splice(source.index, 1)
      draft.splice(destination.index, 0, reorderedItem)
    })
    setConditions(newConditions)

    // 重新构建表单值
    const newFormValues = newConditions.reduce(
      (acc, condition, index) => {
        acc[`field-${index}`] = condition.field || ''
        acc[`operator-${index}`] = condition.operator || ''
        acc[`value-${index}`] = condition.value || ''
        return acc
      },
      {} as Record<string, string>,
    )

    // 添加剩余的空字段
    const remainingCount = 10 - newConditions.length
    if (remainingCount > 0) {
      Array(remainingCount)
        .fill(0)
        .forEach((_, i) => {
          const idx = i + newConditions.length
          newFormValues[`field-${idx}`] = ''
          newFormValues[`operator-${idx}`] = ''
          newFormValues[`value-${idx}`] = ''
        })
    }

    // 更新表单值
    form.reset(newFormValues)
  }

  const form = useForm({
    defaultValues: {
      ...(initialConditions?.reduce(
        (acc, filter, index) => {
          acc[`field-${index}`] = filter.field || ''
          acc[`operator-${index}`] = filter.operator || ''
          acc[`value-${index}`] = filter.value || ''
          return acc
        },
        {} as Record<string, string>,
      ) || {}),
      ...Array(10 - initialConditions.length)
        .fill(0)
        .reduce(
          (acc, _, i) => ({
            ...acc,
            [`field-${i + initialConditions.length}`]: '',
            [`operator-${i + initialConditions.length}`]: '',
            [`value-${i + initialConditions.length}`]: '',
          }),
          {},
        ),
    },
  })

  const onSubmit = () => {
    // 处理筛选表单数据
    const formValues = form.getValues()
    const filters = Object.keys(formValues)
      .filter((key) => key.startsWith('field-') && formValues[key])
      .map((index) => {
        const idx = index.replace('field-', '')
        return {
          field: formValues[`field-${idx}`],
          operator: formValues[`operator-${idx}`],
          value: formValues[`value-${idx}`],
        }
      })

    const formData = {
      filters,
    }
    onOpenChange(false)

    alert(JSON.stringify(formData, null, 2))
  }

  const onCancel = () => {
    // condition reset个数，form reset字段取值，两者都需要
    setConditions(initialConditions)
    form.reset()
    onOpenChange(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) {
          // condition reset个数，form reset字段取值，两者都需要
          setConditions(initialConditions)
          form.reset()
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='h-8 lg:flex'>
          <IconFilterCog className='mr-2 h-4 w-4' />
          筛选
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[600px] p-2' side='bottom' align='start'>
        <Form {...form}>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='filterConditions'>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className='space-y-2 max-h-[280px] overflow-y-auto overflow-x-hidden p-1'
                >
                  {conditions.map((condition, index) => (
                    <Draggable key={`filter-${index}`} draggableId={`filter-${index}`} index={index}>
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
                          <div {...provided.dragHandleProps}>
                            <GripVertical className='h-4 w-4 cursor-grab active:cursor-grabbing' />
                          </div>

                          <FormField
                            control={form.control}
                            name={`field-${index}`}
                            render={({ field }) => {
                              const usedFields = conditions.map((c) => c.field).filter((f) => f !== condition.field)

                              return (
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
                                        .filter((column) => column.id !== 'select' && !usedFields.includes(column.id))
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
                            name={`operator-${index}`}
                            render={({ field }) => (
                              <FormItem className='flex-1'>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                            name={`value-${index}`}
                            render={({ field }) => (
                              <FormItem className='flex-1'>
                                <FormControl>
                                  <Input {...field} placeholder='输入值' />
                                </FormControl>
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
              setConditions([...conditions, { field: '', operator: '', value: '' }])
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
