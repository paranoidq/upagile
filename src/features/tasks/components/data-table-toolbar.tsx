import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Table } from '@tanstack/react-table'
import { IconArrowsSort, IconFilterCog, IconFolders } from '@tabler/icons-react'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { GripVertical, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  const [openFilterDialog, setOpenFilterDialog] = useState(false)
  const [openSortDialog, setOpenSortDialog] = useState(false)
  const [openGroupDialog, setOpenGroupDialog] = useState(false)

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

  const getFilterFormValues = (conditions: Condition[]) =>
    conditions?.reduce(
      (acc, filter, index) => {
        acc[`field-${index}`] = filter.field || ''
        acc[`operator-${index}`] = filter.operator || ''
        acc[`value-${index}`] = filter.value || ''
        return acc
      },
      {} as Record<string, string>,
    ) || {}

  const getSortFormValues = (conditions: Condition[]) =>
    conditions?.reduce(
      (acc, sort, index) => {
        acc[`field-${index}`] = sort.field || ''
        acc[`direction-${index}`] = sort.direction || 'asc'
        return acc
      },
      {} as Record<string, string>,
    ) || {}

  const getGroupFormValues = (conditions: Condition[]) =>
    conditions?.reduce(
      (acc, group, index) => {
        acc[`field-${index}`] = group.field || ''
        acc[`direction-${index}`] = group.direction || 'asc'
        return acc
      },
      {} as Record<string, string>,
    ) || {}

  const filterForm = useForm({
    defaultValues: {
      ...getFilterFormValues(initialFilterConditions),
      ...Array(10 - initialFilterConditions.length)
        .fill(0)
        .reduce(
          (acc, _, i) => ({
            ...acc,
            [`field-${i + initialFilterConditions.length}`]: '',
            [`operator-${i + initialFilterConditions.length}`]: '',
            [`value-${i + initialFilterConditions.length}`]: '',
          }),
          {},
        ),
    },
  })

  const sortForm = useForm({
    defaultValues: {
      ...getSortFormValues(initialSortConditions),
      ...Array(10 - initialSortConditions.length)
        .fill(0)
        .reduce(
          (acc, _, i) => ({
            ...acc,
            [`field-${i + initialSortConditions.length}`]: '',
            [`direction-${i + initialSortConditions.length}`]: 'asc',
          }),
          {},
        ),
    },
  })

  const groupForm = useForm({
    defaultValues: {
      ...getGroupFormValues(initialGroupConditions),
      ...Array(10 - initialGroupConditions.length)
        .fill(0)
        .reduce(
          (acc, _, i) => ({
            ...acc,
            [`field-${i + initialGroupConditions.length}`]: '',
            [`direction-${i + initialGroupConditions.length}`]: 'asc',
          }),
          {},
        ),
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
  }

  const resetToInitialValues = () => {
    setFilterConditions(initialFilterConditions)
    setSortConditions(initialSortConditions)
    setGroupConditions(initialGroupConditions)

    filterForm.reset({
      ...getFilterFormValues(initialFilterConditions),
      ...Array(10 - initialFilterConditions.length)
        .fill(0)
        .reduce(
          (acc, _, i) => ({
            ...acc,
            [`field-${i + initialFilterConditions.length}`]: '',
            [`operator-${i + initialFilterConditions.length}`]: '',
            [`value-${i + initialFilterConditions.length}`]: '',
          }),
          {},
        ),
    })
    sortForm.reset({
      ...getSortFormValues(initialSortConditions),
      ...Array(10 - initialSortConditions.length)
        .fill(0)
        .reduce(
          (acc, _, i) => ({
            ...acc,
            [`field-${i + initialSortConditions.length}`]: '',
            [`direction-${i + initialSortConditions.length}`]: 'asc',
          }),
          {},
        ),
    })
    groupForm.reset({
      ...getGroupFormValues(initialGroupConditions),
      ...Array(10 - initialGroupConditions.length)
        .fill(0)
        .reduce(
          (acc, _, i) => ({
            ...acc,
            [`field-${i + initialGroupConditions.length}`]: '',
            [`direction-${i + initialGroupConditions.length}`]: 'asc',
          }),
          {},
        ),
    })
  }

  const onCancel = () => {
    setOpenFilterDialog(false)
    setOpenSortDialog(false)
    setOpenGroupDialog(false)
    resetToInitialValues()
  }

  const handleDragEnd = (result: DropResult, type: 'filter' | 'sort' | 'group') => {
    const { destination, source } = result

    if (!destination || destination.index === source.index) {
      return
    }

    const getStateAndUpdater = () => {
      switch (type) {
        case 'filter':
          return {
            conditions: filterConditions,
            setConditions: setFilterConditions,
            form: filterForm,
          }
        case 'sort':
          return {
            conditions: sortConditions,
            setConditions: setSortConditions,
            form: sortForm,
          }
        case 'group':
          return {
            conditions: groupConditions,
            setConditions: setGroupConditions,
            form: groupForm,
          }
      }
    }

    const { conditions, setConditions, form } = getStateAndUpdater()

    // 重新排序条件数组
    const reorderedConditions = Array.from(conditions)
    const [removed] = reorderedConditions.splice(source.index, 1)
    reorderedConditions.splice(destination.index, 0, removed)

    // 更新状态
    setConditions(reorderedConditions)

    // 重新构建表单值
    const newFormValues = reorderedConditions.reduce(
      (acc, condition, index) => {
        if (type === 'filter') {
          acc[`field-${index}`] = condition.field || ''
          acc[`operator-${index}`] = condition.operator || ''
          acc[`value-${index}`] = condition.value || ''
        } else {
          acc[`field-${index}`] = condition.field || ''
          acc[`direction-${index}`] = condition.direction || 'asc'
        }
        return acc
      },
      {} as Record<string, string>,
    )

    // 添加剩余的空字段
    const remainingCount = 10 - reorderedConditions.length
    if (remainingCount > 0) {
      Array(remainingCount)
        .fill(0)
        .forEach((_, i) => {
          const idx = i + reorderedConditions.length
          if (type === 'filter') {
            newFormValues[`field-${idx}`] = ''
            newFormValues[`operator-${idx}`] = ''
            newFormValues[`value-${idx}`] = ''
          } else {
            newFormValues[`field-${idx}`] = ''
            newFormValues[`direction-${idx}`] = 'asc'
          }
        })
    }

    // 更新表单值
    form.reset(newFormValues)
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

        {/* Filter Button & Popover */}
        <Popover
          open={openFilterDialog}
          onOpenChange={(open) => {
            setOpenFilterDialog(open)
            if (!open) {
              resetToInitialValues()
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
            <Form {...filterForm}>
              <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'filter')}>
                <Droppable droppableId='filterConditions'>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className='space-y-2 max-h-[280px] overflow-y-auto overflow-x-hidden p-1'
                    >
                      {filterConditions.map((condition, index) => (
                        <Draggable key={`filter-${index}`} draggableId={`filter-${index}`} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                'grid grid-cols-[auto_1fr_1fr_2fr_auto] items-center gap-2 bg-background rounded-md w-full',
                                snapshot.isDragging && ['opacity-50', 'shadow-lg', 'ring-2 ring-primary'],
                              )}
                              style={{
                                ...provided.draggableProps.style,
                                left: 'auto',
                                top: 'auto',
                                transform: provided.draggableProps.style?.transform,
                              }}
                            >
                              <div {...provided.dragHandleProps} className='px-2 py-1'>
                                <GripVertical className='h-4 w-4 cursor-grab active:cursor-grabbing' />
                              </div>
                              <FormField
                                control={filterForm.control}
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
                                control={filterForm.control}
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
                                  const newConditions = filterConditions.filter((_, i) => i !== index)
                                  setFilterConditions(newConditions)

                                  const newFormValues = newConditions.reduce(
                                    (acc, condition, i) => {
                                      acc[`field-${i}`] = condition.field || ''
                                      acc[`operator-${i}`] = condition.operator || ''
                                      acc[`value-${i}`] = condition.value || ''
                                      return acc
                                    },
                                    {} as Record<string, string>,
                                  )

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

                                  filterForm.reset(newFormValues)
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
                  setFilterConditions([...filterConditions, { field: '', operator: '', value: '' }])
                  filterForm.reset({
                    ...getFilterFormValues(filterConditions),
                    ...Array(10 - filterConditions.length)
                      .fill(0)
                      .reduce(
                        (acc, _, i) => ({
                          ...acc,
                          [`field-${i + filterConditions.length}`]: '',
                          [`operator-${i + filterConditions.length}`]: '',
                          [`value-${i + filterConditions.length}`]: '',
                        }),
                        {},
                      ),
                  })
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
              <Button
                type='button'
                onClick={() => {
                  onSubmit()
                  setOpenFilterDialog(false)
                }}
              >
                确定
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort Button & Popover */}
        <Popover
          open={openSortDialog}
          onOpenChange={(open) => {
            setOpenSortDialog(open)
            if (!open) {
              resetToInitialValues()
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button variant='outline' size='sm' className='h-8 lg:flex'>
              <IconArrowsSort className='mr-2 h-4 w-4' />
              排序
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[600px] p-2' side='bottom' align='start'>
            <Form {...sortForm}>
              <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'sort')}>
                <Droppable droppableId='sortConditions'>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className='space-y-2 max-h-[280px] overflow-y-auto overflow-x-hidden p-1'
                    >
                      {sortConditions.map((condition, index) => (
                        <Draggable key={`sort-${index}`} draggableId={`sort-${index}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className='grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2 bg-background rounded-md w-full'
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
                                    <FormItem className='flex-1'>
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
                                  const newConditions = sortConditions.filter((_, i) => i !== index)
                                  setSortConditions(newConditions)

                                  const newFormValues = newConditions.reduce(
                                    (acc, condition, i) => {
                                      acc[`field-${i}`] = condition.field || ''
                                      acc[`direction-${i}`] = condition.direction || 'asc'
                                      return acc
                                    },
                                    {} as Record<string, string>,
                                  )

                                  const remainingCount = 10 - newConditions.length
                                  if (remainingCount > 0) {
                                    Array(remainingCount)
                                      .fill(0)
                                      .forEach((_, i) => {
                                        const idx = i + newConditions.length
                                        newFormValues[`field-${idx}`] = ''
                                        newFormValues[`direction-${idx}`] = 'asc'
                                      })
                                  }

                                  sortForm.reset(newFormValues)
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
                  setSortConditions([...sortConditions, { field: '', direction: 'asc' }])
                  sortForm.reset({
                    ...getSortFormValues(sortConditions),
                    ...Array(10 - sortConditions.length)
                      .fill(0)
                      .reduce(
                        (acc, _, i) => ({
                          ...acc,
                          [`field-${i + sortConditions.length}`]: '',
                          [`direction-${i + sortConditions.length}`]: 'asc',
                        }),
                        {},
                      ),
                  })
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
              <Button
                type='button'
                onClick={() => {
                  onSubmit()
                  setOpenSortDialog(false)
                }}
              >
                确定
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Group Button & Popover */}
        <Popover
          open={openGroupDialog}
          onOpenChange={(open) => {
            setOpenGroupDialog(open)
            if (!open) {
              resetToInitialValues()
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button variant='outline' size='sm' className='h-8 lg:flex'>
              <IconFolders className='mr-2 h-4 w-4' />
              分组
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[600px] p-2' side='bottom' align='start'>
            <Form {...groupForm}>
              <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'group')}>
                <Droppable droppableId='groupConditions'>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className='space-y-2 max-h-[280px] overflow-y-auto overflow-x-hidden p-1'
                    >
                      {groupConditions.map((condition, index) => (
                        <Draggable key={`group-${index}`} draggableId={`group-${index}`} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className='grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2 bg-background rounded-md w-full'
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
                                    <FormItem className='flex-1'>
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
                                  <FormItem className='flex-1'>
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
                                onClick={() => {
                                  const newConditions = groupConditions.filter((_, i) => i !== index)
                                  setGroupConditions(newConditions)

                                  const newFormValues = newConditions.reduce(
                                    (acc, condition, i) => {
                                      acc[`field-${i}`] = condition.field || ''
                                      acc[`direction-${i}`] = condition.direction || 'asc'
                                      return acc
                                    },
                                    {} as Record<string, string>,
                                  )

                                  const remainingCount = 10 - newConditions.length
                                  if (remainingCount > 0) {
                                    Array(remainingCount)
                                      .fill(0)
                                      .forEach((_, i) => {
                                        const idx = i + newConditions.length
                                        newFormValues[`field-${idx}`] = ''
                                        newFormValues[`direction-${idx}`] = 'asc'
                                      })
                                  }

                                  groupForm.reset(newFormValues)
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
                  setGroupConditions([...groupConditions, { field: '', direction: 'asc' }])
                  groupForm.reset({
                    ...getGroupFormValues(groupConditions),
                    ...Array(10 - groupConditions.length)
                      .fill(0)
                      .reduce(
                        (acc, _, i) => ({
                          ...acc,
                          [`field-${i + groupConditions.length}`]: '',
                          [`direction-${i + groupConditions.length}`]: 'asc',
                        }),
                        {},
                      ),
                  })
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
              <Button
                type='button'
                onClick={() => {
                  onSubmit()
                  setOpenGroupDialog(false)
                }}
              >
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
