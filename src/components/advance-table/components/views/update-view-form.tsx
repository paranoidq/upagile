import { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { View } from '@/components/view-table/types'
import { useTableInstanceContext } from '../../table-instance-provider'

interface UpdateViewFormProps {
  isUpdated: boolean
  currentView: View | undefined
  filterParams: FilterParams
}

export default function UpdateViewForm({ isUpdated, currentView, filterParams }: UpdateViewFormProps) {
  const [state, formAction] = useFormState(editView, { message: '' })

  const { tableInstance } = useTableInstanceContext()

  const visibleColumns = tableInstance
    .getVisibleFlatColumns()
    .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
    .map((column) => column.id)

  useEffect(() => {
    if (state.status === 'success') {
      toast.success(state.message)
    } else if (state.status === 'error') {
      toast.error(state.message)
    }
  }, [state])

  if (!isUpdated || !currentView) return

  return (
    <form action={formAction}>
      <input type='hidden' name='id' value={currentView.id} />
      <input type='hidden' name='name' value={currentView.name} />
      <input type='hidden' name='columns' value={JSON.stringify(visibleColumns)} />
      <input type='hidden' name='filterParams' value={JSON.stringify(filterParams)} />
      <SubmitButton />
    </form>
  )
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button disabled={pending} type='submit' size='sm' className='gap-1.5'>
      {pending && <LoaderIcon aria-hidden='true' className='size-3.5 animate-spin' />}
      Update view
    </Button>
  )
}
