import { useMemo } from 'react'
import type { FilterCondition, SortCondition, Task, ViewType } from '../types'

// 处理筛选条件
const filterData = <T,>(data: T[], filters: FilterCondition[]) => {
  if (!filters?.length) {
    return data
  }

  return data.filter((item) => {
    return filters.every((filter) => {
      const value = item[filter.field as keyof T]
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
const sortData = <T,>(data: T[], sorts: SortCondition[]) => {
  if (!sorts?.length) {
    return data
  }

  return [...data].sort((a, b) => {
    for (const sort of sorts) {
      const aValue = a[sort.field as keyof T]
      const bValue = b[sort.field as keyof T]

      if (aValue === bValue) {
        continue
      }

      const compareResult = aValue > bValue ? 1 : -1
      return sort.direction === 'asc' ? compareResult : -compareResult
    }
    return 0
  })
}

export const useProcessedData = <T, >(rawData: T[], currentView: ViewType | undefined) => {
  return useMemo(() => {
    if (!rawData?.length || !currentView) {
      return []
    }

    const { conditions } = currentView
    if (!conditions) {
      return rawData
    }

    // 先进行筛选
    const filteredData = filterData(rawData, conditions.filters)

    // 再进行排序
    const sortedData = sortData(filteredData, conditions.sorts)

    return sortedData
  }, [rawData, currentView])
}
