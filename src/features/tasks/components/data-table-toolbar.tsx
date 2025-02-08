import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Table } from '@tanstack/react-table'
import { IconFilterCog } from '@tabler/icons-react'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { GripVertical, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ViewType } from '@/features/tasks/types.ts'
import { DataTableViewOptions } from '../components/data-table-view-options'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchColumn?: string
  currentView?: ViewType
}

interface Condition {
  field?: string
  operator?: string
  value?: string
  direction?: 'asc' | 'desc'

  [key: string]: string | undefined // 添加索引签名以修复类型错误
}

export function DataTableToolbar<TData>({ table, searchColumn, currentView }: DataTableToolbarProps<TData>) {
  const [openViewConditionsDialog, setOpenViewConditionsDialog] = useState(false)

  const initialFilterConditions =
    currentView?.conditions?.filters?.map((filter) => ({
      field: filter.field,
      operator: filter.operator,
      value: filter.value,
    })) || []

  const initialSortConditions =
    currentView?.conditions?.sorts?.map((sort) => ({
      field: sort.field,
      direction: sort.direction,
    })) || []

  const initialGroupConditions =
    currentView?.conditions?.groups?.map((group) => ({
      field: group.field,
      direction: group.direction,
    })) || []

  const [filterConditions, setFilterConditions] = useState<Condition[]>(initialFilterConditions)
  const [sortConditions, setSortConditions] = useState<Condition[]>(initialSortConditions)
  const [groupConditions, setGroupConditions] = useState<Condition[]>(initialGroupConditions)

  const filterForm = useForm({
    defaultValues: {
      ...(filterConditions?.reduce(
        (acc, filter, index) => {
          acc[`field-${index}`] = filter.field
          acc[`operator-${index}`] = filter.operator
          acc[`value-${index}`] = filter.value
          return acc
        },
        {} as Record<string, string>,
      ) || {}),
    },
  })

  const sortForm = useForm({
    defaultValues: {
      ...(sortConditions.reduce(
        (acc, sort, index) => {
          acc[`field-${index}`] = sort.field
          acc[`direction-${index}`] = sort.direction
          return acc
        },
        {} as Record<string, string>,
      ) || {}),
    },
  })

  const groupForm = useForm({
    defaultValues: {
      ...(initialGroupConditions?.reduce(
        (acc, group, index) => {
          acc[`field-${index}`] = group.field
          acc[`direction-${index}`] = group.direction
          return acc
        },
        {} as Record<string, string>,
      ) || {}),
    },
  })

  const onSubmit = () => {
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
          direction: sortValues[`direction-${idx}`],
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
          direction: groupValues[`direction-${idx}`],
        }
      })

    const formData = {
      filters,
      sorts,
      groups,
    }

    alert(JSON.stringify(formData, null, 2))
    setOpenViewConditionsDialog(false)
  }

  const onCancel = () => {
    setOpenViewConditionsDialog(false)
    filterForm.reset()
    sortForm.reset()
    groupForm.reset()
  }

  const onRemoveCondition = (index: number, type: 'filter' | 'sort' | 'group') => {
    if (type === 'filter') {
      const newConditions = filterConditions.filter((_, i) => i !== index)
      setFilterConditions(newConditions)
      filterForm.reset(
        newConditions.reduce((acc, _, i) => {
          acc[`field-${i}`] = filterForm.getValues()[`field-${index + i}`]
          acc[`operator-${i}`] = filterForm.getValues()[`operator-${index + i}`]
          acc[`value-${i}`] = filterForm.getValues()[`value-${index + i}`]
          return acc
        }, {}),
      )
    } else if (type === 'sort') {
      const newConditions = sortConditions.filter((_, i) => i !== index)
      setSortConditions(newConditions)
      sortForm.reset(
        newConditions.reduce((acc, _, i) => {
          acc[`field-${i}`] = sortForm.getValues()[`field-${index + i}`]
          acc[`direction-${i}`] = sortForm.getValues()[`direction-${index + i}`]
          return acc
        }, {}),
      )
    } else {
      const newConditions = groupConditions.filter((_, i) => i !== index)
      setGroupConditions(newConditions)
      groupForm.reset(
        newConditions.reduce((acc, _, i) => {
          acc[`field-${i}`] = groupForm.getValues()[`field-${index + i}`]
          acc[`direction-${i}`] = groupForm.getValues()[`direction-${index + i}`]
          return acc
        }, {}),
      )
    }
  }

  const onDragEnd = (
    result: {
      destination: { index: number } | null
      source: { index: number }
    },
    type: 'filter' | 'sort' | 'group',
  ) => {
    if (!result.destination) {
      return
    }

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
      updateFormValues(filterForm, 'field')
      updateFormValues(filterForm, 'operator')
      updateFormValues(filterForm, 'value')
    } else if (type === 'sort') {
      updateFormValues(sortForm, 'field')
      updateFormValues(sortForm, 'direction')
    } else {
      updateFormValues(groupForm, 'field')
      updateFormValues(groupForm, 'direction')
    }
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {/* search input */}
        {searchColumn && (
          <Input
            placeholder='Filter tasks...'
            value={(table.getColumn(searchColumn)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(searchColumn)?.setFilterValue(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}

        {/* popover for filter,group,sort */}
        <Popover open={openViewConditionsDialog} onOpenChange={setOpenViewConditionsDialog}>
          <PopoverTrigger asChild>
            <Button variant='outline' size='sm' className='ml-auto h-8 lg:flex'>
              <IconFilterCog className='mr-2 h-4 w-4' />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[600px] p-2'>
            <Tabs defaultValue='filter' className='w-full'>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='filter'>筛选</TabsTrigger>
                <TabsTrigger value='sort'>排序</TabsTrigger>
                <TabsTrigger value='group'>分组</TabsTrigger>
              </TabsList>

              {/* Filter Tab */}
              <TabsContent value='filter' className=''>
                <Form {...filterForm}>
                  <DragDropContext onDragEnd={(result) => onDragEnd(result, 'filter')}>
                    <Droppable droppableId='filterConditions'>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className='space-y-2 max-h-[280px] overflow-y-auto overflow-x-hidden p-1'
                        >
                          {filterConditions.map((_, index) => (
                            <Draggable key={index} draggableId={`filter-${index}`} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className='flex items-center gap-2 bg-background rounded-md w-full'
                                >
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className='h-4 w-4' />
                                  </div>
                                  <FormField
                                    control={filterForm.control}
                                    name={`field-${index}`}
                                    render={({ field }) => {
                                      return (
                                        <FormItem>
                                          <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={!table.getAllColumns()}
                                          >
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
                                          <Input {...field} placeholder='输入值' className='flex-1' />
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 hover:bg-red-50 hover:text-red-600'
                                    onClick={() => onRemoveCondition(index, 'filter')}
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
                    onClick={() => setFilterConditions([...filterConditions, {}])}
                    className='mt-4 hover:text-blue-600'
                  >
                    添加条件
                  </Button>
                </Form>
              </TabsContent>

              {/* Sort Tab */}
              <TabsContent value='sort' className='p-0'>
                <Form {...sortForm}>
                  <DragDropContext onDragEnd={(result) => onDragEnd(result, 'sort')}>
                    <Droppable droppableId='sortConditions'>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className='space-y-2 max-h-[280px] overflow-y-auto overflow-x-hidden p-1'
                        >
                          {sortConditions.map((condition, index) => (
                            <Draggable key={index} draggableId={`sort-${index}`} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className='flex items-center gap-2 bg-background rounded-md w-full'
                                >
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className='h-4 w-4' />
                                  </div>
                                  <FormField
                                    control={sortForm.control}
                                    name={`field-${index}`}
                                    render={({ field }) => {
                                      const usedFields = sortConditions
                                        .map((c) => c.field)
                                        .filter((f) => f !== condition.field)
                                      return (
                                        <FormItem>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder='选择字段' />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {table
                                                .getAllColumns()
                                                .filter(
                                                  (column) => column.id !== 'select' && !usedFields.includes(column.id),
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
                                    control={sortForm.control}
                                    name={`direction-${index}`}
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
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 hover:bg-red-50 hover:text-red-600'
                                    onClick={() => onRemoveCondition(index, 'sort')}
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
                    onClick={() => setSortConditions([...sortConditions, {}])}
                    className='mt-4 hover:text-blue-600'
                  >
                    添加条件
                  </Button>
                </Form>
              </TabsContent>

              {/* Group Tab */}
              <TabsContent value='group' className='p-0'>
                <Form {...groupForm}>
                  <DragDropContext onDragEnd={(result) => onDragEnd(result, 'group')}>
                    <Droppable droppableId='groupConditions'>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className='space-y-2 max-h-[280px] overflow-y-auto overflow-x-hidden p-1'
                        >
                          {groupConditions.map((condition, index) => (
                            <Draggable key={index} draggableId={`group-${index}`} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className='flex items-center gap-2 bg-background rounded-md w-full'
                                >
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className='h-4 w-4' />
                                  </div>
                                  <FormField
                                    control={groupForm.control}
                                    name={`field-${index}`}
                                    render={({ field }) => {
                                      const usedFields = groupConditions
                                        .map((c) => c.field)
                                        .filter((f) => f !== condition.field)
                                      return (
                                        <FormItem>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder='选择字段' />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              {table
                                                .getAllColumns()
                                                .filter(
                                                  (column) => column.id !== 'select' && !usedFields.includes(column.id),
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
                                    control={groupForm.control}
                                    name={`direction-${index}`}
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
                                  <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 hover:bg-red-50 hover:text-red-600'
                                    onClick={() => onRemoveCondition(index, 'group')}
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
                    onClick={() => setGroupConditions([...groupConditions, {}])}
                    className='mt-4 hover:text-blue-600'
                  >
                    添加条件
                  </Button>
                </Form>
              </TabsContent>
            </Tabs>

            {/* 统一操作按钮 */}
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

        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
