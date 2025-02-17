import { useMemo } from 'react'
import type { FilterCondition, SortCondition, Task, ViewType } from '../types'

// 处理筛选条件
const filterData = (data: Task[], filters: FilterCondition[]) => {
  if (!filters?.length) {
    return data
  }

  return data.filter((item) => {
    return filters.every((filter) => {
      const value = item[filter.field as keyof Task]
      switch (filter.operator) {
        case 'equals':
          return value === filter.value
        case 'not_equals':
          return value !== filter.value
        case 'contains':
          return String(value).includes(String(filter.value))
        case 'not_contains':
          return !String(value).includes(String(filter.value))
        case 'is_empty':
          return !value || value === ''
        case 'is_not_empty':
          return value && value !== ''
        default:
          return true
      }
    })
  })
}

// 处理排序条件
const sortData = (data: Task[], sorts: SortCondition[]) => {
  if (!sorts?.length) {
    return data
  }

  return [...data].sort((a, b) => {
    for (const sort of sorts) {
      const aValue = a[sort.field as keyof Task]
      const bValue = b[sort.field as keyof Task]

      if (aValue === bValue) {
        continue
      }

      const compareResult = aValue > bValue ? 1 : -1
      return sort.direction === 'asc' ? compareResult : -compareResult
    }
    return 0
  })
}

export const useProcessedTasks = (tasks: Task[], currentView: ViewType | undefined) => {
  return useMemo(() => {
    if (!tasks?.length || !currentView) {
      return []
    }

    const { conditions } = currentView
    if (!conditions) {
      return tasks
    }

    // 先进行筛选
    const filteredData = filterData(tasks, conditions.filters)

    // 再进行排序
    const sortedData = sortData(filteredData, conditions.sorts)

    return sortedData
  }, [tasks, currentView])
}
