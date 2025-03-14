import { z } from 'zod'

// export interface DataTableFilterOption<TData> {
//   id: string
//   label: string
//   value: keyof TData
//   options: Option[]
//   filterValues?: string[]
//   filterOperator?: string
//   isMulti?: boolean
// }

// 定义字段类型枚举
export const FieldTypeEnum = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  BOOLEAN: 'boolean',
  SELECT: 'select',
  MULTI_SELECT: 'multiSelect',
} as const
export type FieldType = (typeof FieldTypeEnum)[keyof typeof FieldTypeEnum]

// 定义所有可能的操作符
export const OperatorEnum = {
  // 文本操作符
  ILIKE: 'ilike',
  NOT_ILIKE: 'notIlike',
  EQ: 'eq',
  NOT_EQ: 'notEq',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
  IS_NULL: 'isNull',
  IS_NOT_NULL: 'isNotNull',

  // 数字操作符
  GT: 'gt',
  GTE: 'gte',
  LT: 'lt',
  LTE: 'lte',

  // 日期操作符
  BETWEEN: 'between',

  // 多选操作符
  CONTAINS_ALL: 'containsAll',
  CONTAINS_ANY: 'containsAny',
  NOT_CONTAINS: 'notContains',
} as const

export type OperatorValue = (typeof OperatorEnum)[keyof typeof OperatorEnum]

// 定义通用的过滤器模式
export const FilterSchema = z.object({
  field: z.string(),
  operator: z.enum(Object.values(OperatorEnum) as [string, ...string[]]),
  value: z.union([z.string(), z.array(z.string()), z.number(), z.array(z.number()), z.boolean(), z.null()]).optional(),
})

export type Filter = z.infer<typeof FilterSchema>

export const FilterParamsSchema = z.object({
  operator: z.enum(['and', 'or']).optional(),
  filters: z.array(FilterSchema).optional().default([]),
})

export type FilterParams = z.infer<typeof FilterParamsSchema>

export const SortParamsSchema = z.array(
  z.object({
    field: z.string(),
    direction: z.enum(['asc', 'desc']).optional(),
  }),
)

export type SortParams = z.infer<typeof SortParamsSchema>

export const GroupParamsSchema = z.array(
  z.object({
    field: z.string(),
    direction: z.enum(['asc', 'desc']).optional(),
  }),
)

export type GroupParams = z.infer<typeof GroupParamsSchema>

export const SearchParamsSchema = z
  .object({
    viewId: z.coerce.number().optional(),
    columns: z.array(z.string()).optional(),
    filterParams: FilterParamsSchema.optional(),
    sortParams: SortParamsSchema.optional(),
    groupParams: GroupParamsSchema.optional(),
  })
  .optional()

export type SearchParams = z.infer<typeof SearchParamsSchema>

export const createViewSchema = z.object({
  name: z.string(),
  columns: z.string().array().optional(),
  filterParams: FilterParamsSchema.optional(),
  sortParams: SortParamsSchema.optional(),
  groupParams: GroupParamsSchema.optional(),
})

export type CreateViewSchema = z.infer<typeof createViewSchema>

export const editViewSchema = createViewSchema.extend({
  id: z.number(),
})

export type EditViewSchema = z.infer<typeof editViewSchema>

export const deleteViewSchema = z.object({
  id: z.number(),
})

export const viewSchema = z.object({
  id: z.number(),
  name: z.string(),
  columns: z.string().array().optional(),
  filterParams: FilterParamsSchema.optional(),
  sortParams: SortParamsSchema.optional(),
  groupParams: GroupParamsSchema.optional(),
})

export type View = z.infer<typeof viewSchema>

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }> | React.ReactElement
  withCount?: boolean
}
export interface DataTableFilterField<TData> {
  label: string
  value: keyof TData
  placeholder?: string
  options?: Option[]
}

export interface DataTableSortField<TData> {
  label: string
  value: keyof TData
}

export interface DataTableGroupField<TData> {
  label: string
  value: keyof TData
}
