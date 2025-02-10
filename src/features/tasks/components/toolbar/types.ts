import { Table } from '@tanstack/react-table'
import { ViewType } from '../../types'

export interface FieldOption {
  label: string
  value: string
}

export interface Condition {
  field?: string
  operator?: string
  value?: string
  direction?: 'asc' | 'desc'
  [key: string]: string | undefined
}

export interface ToolbarProps<TData> {
  table: Table<TData>
  open: boolean
  onOpenChange: (open: boolean) => void
  currentView?: ViewType
}

// 添加字段选项
export const fieldOptions: FieldOption[] = [
  { label: '标题', value: 'title' },
  { label: '状态', value: 'status' },
  { label: '优先级', value: 'priority' },
  { label: '标签', value: 'label' },
]

// 添加操作符选项
export const operatorOptions: FieldOption[] = [
  { label: '等于', value: 'equals' },
  { label: '不等于', value: 'not_equals' },
  { label: '包含', value: 'contains' },
  { label: '不包含', value: 'not_contains' },
  { label: '为空', value: 'is_empty' },
  { label: '不为空', value: 'is_not_empty' },
]
