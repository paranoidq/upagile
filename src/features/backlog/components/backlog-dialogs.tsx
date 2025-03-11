import { toast } from '@/hooks/use-toast'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useTableData } from '@/components/view-table/view-table-context'
import { Backlog } from '../types'
import { BacklogImportDialog } from './backlog-import-dialog'
import { BacklogMutateDrawer } from './backlog-mutate-drawer'

export function BacklogDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTableData<Backlog>()

  return (
    <>
      <BacklogMutateDrawer key='create' open={open === 'create'} onOpenChange={() => setOpen('create')} />

      <BacklogImportDialog key='import' open={open === 'import'} onOpenChange={() => setOpen('import')} />

      {currentRow && (
        <>
          <BacklogMutateDrawer
            key={`update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              toast({
                title: 'The following item has been deleted:',
                description: (
                  <pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
                    <code className='text-white'>{JSON.stringify(currentRow, null, 2)}</code>
                  </pre>
                ),
              })
            }}
            className='max-w-md'
            title={`Delete this item: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a item with the ID <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
