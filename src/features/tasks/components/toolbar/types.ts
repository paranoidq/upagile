import { Table } from '@tanstack/react-table'
import { ViewType } from '@/features/tasks/types.ts'

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
  currentView?: ViewType
  onOpenChange: (open: boolean) => void
}
