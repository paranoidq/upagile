import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Table } from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { ViewType } from '@/features/tasks/types.ts'
import { DataTableViewOptions } from '../components/data-table-view-options'
import { FilterToolbar } from './toolbar/filter-toolbar'
import { GroupToolbar } from './toolbar/group-toolbar'
import { SortToolbar } from './toolbar/sort-toolbar'
import { DropResult } from '@hello-pangea/dnd'

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

        <FilterToolbar
          table={table}
          open={openFilterDialog}
          conditions={filterConditions}
          setConditions={setFilterConditions}
          form={filterForm}
          onOpenChange={setOpenFilterDialog}
          onSubmit={() => {
            onSubmit()
            setOpenFilterDialog(false)
          }}
          onCancel={onCancel}
        />

        <SortToolbar
          table={table}
          open={openSortDialog}
          conditions={sortConditions}
          setConditions={setSortConditions}
          form={sortForm}
          onOpenChange={setOpenSortDialog}
          onSubmit={() => {
            onSubmit()
            setOpenSortDialog(false)
          }}
          onCancel={onCancel}
        />

        <GroupToolbar
          table={table}
          open={openGroupDialog}
          conditions={groupConditions}
          setConditions={setGroupConditions}
          form={groupForm}
          onOpenChange={setOpenGroupDialog}
          onSubmit={() => {
            onSubmit()
            setOpenGroupDialog(false)
          }}
          onCancel={onCancel}
        />

        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
