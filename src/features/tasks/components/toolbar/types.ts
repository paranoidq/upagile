import { Table } from '@tanstack/react-table'
import { ViewType } from '../../types'

export interface ToolbarProps<TData> {
  table: Table<TData>
  open: boolean
  onOpenChange: (open: boolean) => void
  currentView?: ViewType
}
