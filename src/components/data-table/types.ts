import { z } from 'zod'
import { ColumnSort, Row } from '@tanstack/react-table'
import { filterSchema } from './_lib/parsers'
import { DataTableConfig } from './config/data-table'

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type StringKeyOf<TData> = Extract<keyof TData, string>

export interface Option {
  label: string
  value: string
  icon?: React.ComponentType<{ className?: string }>
  count?: number
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, 'id'> {
  id: StringKeyOf<TData>
}

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[]

export type ColumnType = DataTableConfig['columnTypes'][number]

export type FilterOperator = DataTableConfig['globalOperators'][number]

export type JoinOperator = DataTableConfig['joinOperators'][number]['value']

export interface DataTableFilterField<TData> {
  id: StringKeyOf<TData>
  label: string
  placeholder?: string
  options?: Option[]
}

export interface DataTableAdvancedFilterField<TData> extends DataTableFilterField<TData> {
  type: ColumnType
}

export type Filter<TData> = Prettify<
  Omit<z.infer<typeof filterSchema>, 'id'> & {
    id: StringKeyOf<TData>
  }
>

export interface DataTableRowAction<TData> {
  row?: Row<TData>
  type: 'update' | 'delete' | 'view' | 'create'
}
