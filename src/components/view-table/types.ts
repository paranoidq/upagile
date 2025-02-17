import { z } from 'zod'
import { ColumnDef } from '@tanstack/react-table'

// 基础数据类型
export const baseSchema = z.object({
  id: z.string() || z.number(),
})
export type BaseData = z.infer<typeof baseSchema>

// 视图条件类型
export const filterOperatorEnum = z.enum([
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'starts_with',
  'ends_with',
  'is_empty',
  'is_not_empty',
])

export const filterConditionSchema = z.object({
  field: z.string(),
  operator: filterOperatorEnum,
  value: z.string(),
})

export const sortConditionSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']),
})

export const groupConditionSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc']),
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
  columns: ColumnDef<TData, any>[]
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
  // 事件回调
  onViewCreate?: (view: Omit<ViewType, 'id'>) => Promise<void>
  onViewUpdate?: (view: ViewType) => Promise<void>
  onViewDelete?: (id: number) => Promise<void>
}
