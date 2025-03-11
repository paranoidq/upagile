import { View } from '@/components/view-table/types'
import { DataTableFilterField } from '../types'

interface DataTableAdvancedToolbarProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  filterFields?: DataTableFilterField<TData>[]
  views: View[]
}

export function DataTableAdvancedToolbar<TData>({
  filterFields,
  views,
  className,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  return <div>toolbar</div>
}
