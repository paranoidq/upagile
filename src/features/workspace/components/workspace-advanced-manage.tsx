import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useDeleteWorkspace } from '../_lib/services'
import { Team } from '../types'

interface WorkspaceAdvancedManageProps {
  selectedWorkspace: Team | undefined
}

const WorkspaceAdvancedManage = ({ selectedWorkspace }: WorkspaceAdvancedManageProps) => {
  const { user } = useAuth()
  const isOwner = user?.username == selectedWorkspace?.owner.username

  return (
    <div>
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-2'>
            <CardTitle className='text-red-500'>Delete Workspace</CardTitle>
            <CardDescription>
              This action deletes all data associated with the workspace. There is no going back.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {/* 删除团队 */}
          <DeleteWorkspaceDialog selectedWorkspace={selectedWorkspace} isOwner={isOwner} />
        </CardContent>
      </Card>
    </div>
  )
}

const DeleteWorkspaceDialog = ({
  selectedWorkspace,
  isOwner,
}: {
  selectedWorkspace: Team | undefined
  isOwner: boolean
}) => {
  const { mutateAsync: deleteWorkspace, isPending: isDeleteWorkspacePending } = useDeleteWorkspace()

  const navigate = useNavigate()

  const handleDeleteWorkspace = () => {
    toast.promise(deleteWorkspace({ id: selectedWorkspace?.id ?? '' }), {
      loading: 'Deleting workspace...',
      success: () => {
        navigate('/')
        return 'Workspace deleted successfully'
      },
      error: (e) => ({
        message: e.msg,
        description: e.reason,
      }),
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='destructive' disabled={!isOwner}>
          Delete Workspace
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete Workspace</DialogTitle>
        <DialogDescription>
          This action deletes all data associated with the workspace. There is no going back.
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button variant='destructive' onClick={handleDeleteWorkspace} disabled={isDeleteWorkspacePending}>
            {isDeleteWorkspacePending ? <Loader2 className='w-4 h-4 mr-2 animate-spin' /> : 'Delete'}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default WorkspaceAdvancedManage
