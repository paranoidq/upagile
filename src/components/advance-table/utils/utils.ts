import { Filter, FilterParams, Operator, Sort, View } from '../components/views/types'
import { DataTableFilterOption, SearchParams } from '../types'

export const FILTERABLE_FIELDS: (keyof SearchParams)[] = ['title', 'status', 'priority', 'sort', 'operator']

export function getIsFiltered(search: SearchParams) {
  const filters = []
  const filterObj = search

  for (const [key, value] of Object.entries(filterObj) as [keyof SearchParams, string][]) {
    if (key === 'sort' && value === 'createdAt.desc') {
      continue
    }

    if (key === 'operator' && value === 'and') {
      continue
    }

    if (FILTERABLE_FIELDS.includes(key)) {
      filters.push(key)
    }
  }
  return filters.length > 0
}

export function calcFilterParams<T = unknown>(selectedOptions: DataTableFilterOption<T>[], search: SearchParams) {
  const filterItems: Filter[] = selectedOptions
    .filter((option) => option.filterValues && option.filterValues.length > 0)
    .map((option) => ({
      field: option.value as Filter['field'],
      value: `${option.filterValues?.join('.')}~${option.filterOperator}`,
      isMulti: !!option.isMulti,
    }))
  const filterParams: FilterParams = {
    filters: filterItems,
  }
  filterParams.operator = (search.operator as Operator) || 'and'
  if (search.sort) {
    filterParams.sort = search.sort as Sort
  }
  return filterParams
}

export function calcViewSearchParams(view: View) {
  const searchParamsObj: Partial<Record<keyof SearchParams, string | number | null | undefined>> = {}
  const filterParams = view.filterParams
  if (!filterParams) return

  for (const item of filterParams.filters ?? []) {
    if (FILTERABLE_FIELDS.includes(item.field)) {
      const value = item.isMulti ? `${item.value}~multi` : item.value
      searchParamsObj[item.field] = value
    }
  }
  if (filterParams.operator) {
    searchParamsObj.operator = filterParams.operator
  }
  if (filterParams.sort) {
    searchParamsObj.sort = filterParams.sort
  }
  searchParamsObj.page = 1
  searchParamsObj.per_page = 10
  searchParamsObj.viewId = view.id

  return searchParamsObj
}
