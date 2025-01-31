import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Table } from '@tanstack/react-table'
import { IconFilterCog } from '@tabler/icons-react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTableViewOptions } from '../components/data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchColumn?: string
}

interface Condition {
  field?: string
  operator?: string
  value?: string
  order?: 'asc' | 'desc'
}

export function DataTableToolbar<TData>({ table, searchColumn }: DataTableToolbarProps<TData>) {
  const [open, setOpen] = useState(false)

  const filterForm = useForm()
  const sortForm = useForm()
  const groupForm = useForm()

  const [filterConditions, setFilterConditions] = useState<Condition[]>([])
  const [sortConditions, setSortConditions] = useState<Condition[]>([])
  const [groupConditions, setGroupConditions] = useState<Condition[]>([])

  const handleSubmit = () => {
    // 处理筛选表单数据
    const filterValues = filterForm.getValues()
    const filters = Object.keys(filterValues)
      .filter((key) => key.startsWith('field-') && filterValues[key])
      .map((index) => {
        const idx = index.replace('field-', '')
        return {
          field: filterValues[`field-${idx}`],
          operator: filterValues[`operator-${idx}`],
          value: filterValues[`value-${idx}`],
        }
      })

    // 处理排序表单数据
    const sortValues = sortForm.getValues()
    const sorts = Object.keys(sortValues)
      .filter((key) => key.startsWith('field-') && sortValues[key])
      .map((index) => {
        const idx = index.replace('field-', '')
        return {
          field: sortValues[`field-${idx}`],
          order: sortValues[`order-${idx}`],
        }
      })

    // 处理分组表单数据
    const groupValues = groupForm.getValues()
    const groups = Object.keys(groupValues)
      .filter((key) => key.startsWith('field-') && groupValues[key])
      .map((index) => {
        const idx = index.replace('field-', '')
        return {
          field: groupValues[`field-${idx}`],
          order: groupValues[`order-${idx}`],
        }
      })

    const formData = {
      filters,
      sorts,
      groups,
    }

    alert(JSON.stringify(formData, null, 2))
    setOpen(false)
  }

  const onDragEnd = (
    result: {
      destination: { index: number } | null
      source: { index: number }
    },
    type: 'filter' | 'sort' | 'group',
  ) => {
    if (!result.destination) return

    const items = Array.from(type === 'filter' ? filterConditions : type === 'sort' ? sortConditions : groupConditions)

    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    const updateFormValues = (form: ReturnType<typeof useForm>, prefix: string) => {
      const values = form.getValues()
      const newValues = items.reduce<Record<string, unknown>>((acc, _, index) => {
        Object.keys(values).forEach((key) => {
          if (key.startsWith(`${prefix}-`)) {
            const newKey = key.replace(new RegExp(`${prefix}-\\d+`), `${prefix}-${index}`)
            acc[newKey] = values[key]
          }
        })
        return acc
      }, {})
      form.reset(newValues)
    }

    if (type === 'filter') {
      setFilterConditions(items)
      updateFormValues(filterForm, 'field')
      updateFormValues(filterForm, 'operator')
      updateFormValues(filterForm, 'value')
    } else if (type === 'sort') {
      setSortConditions(items)
      updateFormValues(sortForm, 'field')
      updateFormValues(sortForm, 'order')
    } else {
      setGroupConditions(items)
      updateFormValues(groupForm, 'field')
      updateFormValues(groupForm, 'order')
    }
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {searchColumn && (
          <Input placeholder='Filter tasks...' value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''} onChange={(event) => table.getColumn(searchColumn)?.setFilterValue(event.target.value)} className='h-8 w-[150px] lg:w-[250px]' />
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant='outline' size='sm' className='ml-auto h-8 lg:flex'>
              <IconFilterCog className='mr-2 h-4 w-4' />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[600px] p-0'>
            <Tabs defaultValue='filter' className='w-full'>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='filter'>筛选</TabsTrigger>
                <TabsTrigger value='sort'>排序</TabsTrigger>
                <TabsTrigger value='group'>分组</TabsTrigger>
              </TabsList>

              {/* Filter Tab */}
              <TabsContent value='filter' className='p-4'>
                <Form {...filterForm}>
                  <DragDropContext onDragEnd={(result) => onDragEnd(result, 'filter')}>
                    <Droppable droppableId='filterConditions'>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-2 max-h-[280px] overflow-y-auto overflow-x-hidden p-1'>
                          {filterConditions.map((condition, index) => (
                            <Draggable key={index} draggableId={`filter-${index}`} index={index}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} className='flex items-center gap-2 p-2 bg-background rounded-md border w-full'>
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className='h-4 w-4' />
                                  </div>
                                  <FormField
                                    control={filterForm.control}
                                    name={`field-${index}`}
                                    render={({ field }) => {
                                      const usedFields = filterConditions.map((c) => c.field).filter((f) => f !== condition.field)
                                      return (
                                        <FormItem>
                                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!table.getAllColumns().some((c) => !usedFields.includes(c.id))}>
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder='选择字段' />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {table
                                                .getAllColumns()
                                                .filter((column) => column.getIsVisible() && !usedFields.includes(column.id))
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
                                    control={filterForm.control}
                                    name={`operator-${index}`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                          <FormControl>
                                            <SelectTrigger>
                                              <SelectValue placeholder='选择条件' />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value='equals'>等于</SelectItem>
                                            <SelectItem value='notEquals'>不等于</SelectItem>
                                            <SelectItem value='contains'>包含</SelectItem>
                                            <SelectItem value='notContains'>不包含</SelectItem>
                                            <SelectItem value='empty'>空</SelectItem>
                                            <SelectItem value='notEmpty'>不为空</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </FormItem>
                                    )}
                                  />
                                  <FormField
                                    control={filterForm.control}
                                    name={`value-${index}`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormControl>
                                          <Input {...field} placeholder='输入值' />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  <Button type='button' variant='outline' onClick={() => setFilterConditions([...filterConditions, {}])} className='mt-4'>
                    添加条件
                  </Button>
                </Form>
              </TabsContent>

              {/* Sort Tab */}
              <TabsContent value='sort' className='p-4'>
                <Form {...sortForm}>
                  <DragDropContext onDragEnd={(result) => onDragEnd(result, 'sort')}>
                    <Droppable droppableId='sortConditions'>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-2 max-h-[280px] overflow-y-auto overflow-x-hidden p-1'>
                          {sortConditions.map((condition, index) => (
                            <Draggable key={index} draggableId={`sort-${index}`} index={index}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} className='flex items-center gap-2 p-2 bg-background rounded-md border w-full'>
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className='h-4 w-4' />
                                  </div>
                                  <FormField
                                    control={sortForm.control}
                                    name={`field-${index}`}
                                    render={({ field }) => {
                                      const usedFields = sortConditions.map((c) => c.field).filter((f) => f !== condition.field)
                                      return (
                                        <FormItem>
                                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!table.getAllColumns().some((c) => !usedFields.includes(c.id))}>
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder='选择字段' />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {table
                                                .getAllColumns()
                                                .filter((column) => column.getIsVisible() && !usedFields.includes(column.id))
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
                                    control={sortForm.control}
                                    name={`order-${index}`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  <Button type='button' variant='outline' onClick={() => setSortConditions([...sortConditions, {}])} className='mt-4'>
                    添加排序
                  </Button>
                </Form>
              </TabsContent>

              {/* Group Tab */}
              <TabsContent value='group' className='p-4'>
                <Form {...groupForm}>
                  <DragDropContext onDragEnd={(result) => onDragEnd(result, 'group')}>
                    <Droppable droppableId='groupConditions'>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className='space-y-2 max-h-[280px] overflow-y-auto overflow-x-hidden p-1'>
                          {groupConditions.map((condition, index) => (
                            <Draggable key={index} draggableId={`group-${index}`} index={index}>
                              {(provided) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} className='flex items-center gap-2 p-2 bg-background rounded-md border w-full'>
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className='h-4 w-4' />
                                  </div>
                                  <FormField
                                    control={groupForm.control}
                                    name={`field-${index}`}
                                    render={({ field }) => {
                                      const usedFields = groupConditions.map((c) => c.field).filter((f) => f !== condition.field)
                                      return (
                                        <FormItem>
                                          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!table.getAllColumns().some((c) => !usedFields.includes(c.id))}>
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder='选择字段' />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {table
                                                .getAllColumns()
                                                .filter((column) => column.getIsVisible() && !usedFields.includes(column.id))
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
                                    control={groupForm.control}
                                    name={`order-${index}`}
                                    render={({ field }) => (
                                      <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>

                  <Button type='button' variant='outline' onClick={() => setGroupConditions([...groupConditions, {}])} className='mt-4'>
                    添加分组
                  </Button>
                </Form>
              </TabsContent>
            </Tabs>

            {/* 统一操作按钮 */}
            <div className='flex justify-end space-x-2 p-4 border-t'>
              <Button type='button' variant='outline' onClick={() => setOpen(false)}>
                取消
              </Button>
              <Button type='button' onClick={handleSubmit}>
                确定
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
