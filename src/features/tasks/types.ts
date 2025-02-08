import { z } from 'zod'

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
})
export type Task = z.infer<typeof taskSchema>

export const filterOperatorEnum = z.enum([
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'is_empty',
  'is_not_empty',
])

export const filterConditionSchema = z.object({
  field: z.string(),
  operator: filterOperatorEnum,
  value: z.any().optional(),
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
  filters: z.array(filterConditionSchema),
  sorts: z.array(sortConditionSchema),
  groups: z.array(groupConditionSchema),
})


export type FilterOperator = z.infer<typeof filterOperatorEnum>
export type FilterCondition = z.infer<typeof filterConditionSchema>
export type SortCondition = z.infer<typeof sortConditionSchema>
export type GroupCondition = z.infer<typeof groupConditionSchema>
export type ViewConditions = z.infer<typeof viewConditionsSchema>

export const viewSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string().optional(),
  conditions: viewConditionsSchema.optional(),
})

export type ViewType = z.infer<typeof viewSchema>
