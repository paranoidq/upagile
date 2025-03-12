import { View } from '@/components/view-table/types'

interface ViewEditFormProps {
  view: View
  setIsEditViewFormOpen: (isEditViewFormOpen: boolean) => void
}

export function ViewEditForm({ view, setIsEditViewFormOpen }: ViewEditFormProps) {
  return <div>ViewEditForm</div>
}
