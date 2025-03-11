import { useMemo } from 'react'
import type { FilterCondition, GroupData, SortCondition, View } from '../types'

// 处理筛选条件
const filterData = <T>(data: T[], filters: FilterCondition[] | undefined) => {
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
const sortData = <T>(data: T[], sorts: SortCondition[] | undefined) => {
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

export const useProcessedData = <T>(rawData: T[], currentView: View | undefined): GroupData<T>[] => {
  return useMemo(() => {
    if (!rawData?.length || !currentView?.conditions) {
      return [{ key: 'All', data: rawData }]
    }

    const { filters = [], sorts = [], groups = [] } = currentView.conditions

    // 先进行筛选
    let processedData = filterData(rawData, filters)

    // 再进行排序
    processedData = sortData(processedData, sorts)

    // 最后进行分组
    if (!groups.length) {
      return [{ key: 'All', data: processedData }]
    }

    // 最后进行分组(暂时只支持对一个field进行分组)
    const groupsData = new Map<string, T[]>()
    const ungroupedData: T[] = []
    processedData.forEach((item) => {
      const groupKey = groups.map((group) => item[group.field as keyof T]).join('-')
      if (!groupKey) {
        ungroupedData.push(item)
      } else {
        if (!groupsData.has(groupKey)) {
          groupsData.set(groupKey, [])
        }
        groupsData.get(groupKey)?.push(item)
      }
    })
    if (ungroupedData.length > 0) {
      groupsData.set('未分组', ungroupedData)
    }

    console.log(groupsData)

    return Array.from(groupsData.entries()).map(([key, data]) => ({ key, data }))
  }, [rawData, currentView])
}
