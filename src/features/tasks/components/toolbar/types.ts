import { UseFormReturn } from 'react-hook-form'
import { Table } from '@tanstack/react-table'

export interface Condition {
  field?: string
  operator?: string
  value?: string
  direction?: 'asc' | 'desc'
  [key: string]: string | undefined
}

export type FormValues = {
  [key: string]: string
}

export interface ToolbarProps<TData> {
  table: Table<TData>
  open: boolean
  conditions: Condition[]
  setConditions: (conditions: Condition[]) => void
  form: UseFormReturn<FormValues>
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  onCancel: () => void
}
