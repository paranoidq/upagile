import { z } from 'zod'

export const createViewSchema = z.object({
  name: z.string().min(1),
  columns: z.string().array().optional(),
  filterParams: z
    .object({
      operator: z.enum(['and', 'or']).optional(),
      sort: z.string().optional(),
      filters: z
        .object({
          field: z.enum(['title', 'status', 'priority']),
          value: z.string(),
          isMulti: z.boolean().default(false),
        })
        .array()
        .optional(),
    })
    .optional(),
})

export type CreateViewSchema = z.infer<typeof createViewSchema>

export const editViewSchema = createViewSchema.extend({
  id: z.number(),
})

export type EditViewSchema = z.infer<typeof editViewSchema>

export const deleteViewSchema = z.object({
  id: z.number(),
})

export type DeleteViewSchema = z.infer<typeof deleteViewSchema>

export type FilterParams = NonNullable<CreateViewSchema['filterParams']>
export type Operator = FilterParams['operator']
export type Sort = FilterParams['sort']
export type Filter = NonNullable<FilterParams['filters']>[number]

export const viewSchema = z.object({
  id: z.number(),
  name: z.string(),
  columns: z.string().array().optional(),
  filterParams: createViewSchema.shape.filterParams,
})

export type View = z.infer<typeof viewSchema>
