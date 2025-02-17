import { useMemo } from 'react'
import { BaseData, ViewType } from '../types'

export function useProcessedData<TData extends BaseData>(rawData: TData[], currentView?: ViewType) {
  return useMemo(() => {
    if (!currentView?.conditions) {
      return rawData
    }

    const { filters, sorts } = currentView.conditions

    // 处理筛选
    let processedData = rawData
    if (filters?.length) {
      processedData = processedData.filter((item) =>
        filters.every((filter) => {
          const value = String(item[filter.field as keyof TData])
          switch (filter.operator) {
            case 'equals':
              return value === filter.value
            case 'not_equals':
              return value !== filter.value
            case 'contains':
              return value.includes(filter.value)
            case 'not_contains':
              return !value.includes(filter.value)
            case 'starts_with':
              return value.startsWith(filter.value)
            case 'ends_with':
              return value.endsWith(filter.value)
            case 'is_empty':
              return !value
            case 'is_not_empty':
              return !!value
            default:
              return true
          }
        }),
      )
    }

    // 处理排序
    if (sorts?.length) {
      processedData = [...processedData].sort((a, b) => {
        for (const sort of sorts) {
          const aValue = String(a[sort.field as keyof TData])
          const bValue = String(b[sort.field as keyof TData])
          if (aValue === bValue) continue
          return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
        }
        return 0
      })
    }

    return processedData
  }, [rawData, currentView])
}
