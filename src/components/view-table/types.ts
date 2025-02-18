import { z } from 'zod'
import { ColumnDef } from '@tanstack/react-table'

// 基础数据类型
export const baseSchema = z.object({
  id: z.string(),
})
export type BaseData = z.infer<typeof baseSchema>

// 视图条件类型
export const filterOperatorEnum = z.enum([
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'is_empty',
  'is_not_empty',
])
export const filterOperatorNames: Record<FilterOperator, string> = {
  equals: '等于',
  not_equals: '不等于',
  contains: '包含',
  not_contains: '不包含',
  is_empty: '为空',
  is_not_empty: '不为空',
}

export function getFilterOperatorName(operator: FilterOperator): string {
  return filterOperatorNames[operator] || operator
}

export const filterConditionSchema = z.object({
  field: z.string(),
  operator: filterOperatorEnum,
  value: z.string(),
})

export const sortConditionSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']).optional(),
})

export const groupConditionSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']).optional(),
})

export const viewConditionsSchema = z.object({
  filters: z.array(filterConditionSchema).optional(),
  sorts: z.array(sortConditionSchema).optional(),
  groups: z.array(groupConditionSchema).optional(),
})

export const viewSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string().optional(),
  conditions: viewConditionsSchema.optional(),
})

export type FilterOperator = z.infer<typeof filterOperatorEnum>
export type FilterCondition = z.infer<typeof filterConditionSchema>
export type SortCondition = z.infer<typeof sortConditionSchema>
export type GroupCondition = z.infer<typeof groupConditionSchema>
export type ViewConditions = z.infer<typeof viewConditionsSchema>
export type ViewType = z.infer<typeof viewSchema>

// 组件Props类型
export interface ViewTableProps<TData extends BaseData> {
  // 表格数据
  data: TData[]
  // 列定义
  columns: ColumnDef<TData>[]
  // 视图配置
  views: ViewType[]
  // 搜索字段
  searchColumn?: keyof TData
  // 工具栏配置
  toolbar?: {
    filter?: boolean
    sort?: boolean
    group?: boolean
    columnVisibility?: boolean
  }
}

export type GroupData<TData> = {
  key: string
  data: TData[]
}
