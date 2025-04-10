import { useState } from 'react'
import { IconUserPlus, IconUserStar } from '@tabler/icons-react'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { MultiSelect } from '@/components/ui/multi-select'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  useAddMember as useAddMembers,
  useGetTeamMembers,
  useLeaveTeam,
  useListUsers,
  useRemoveMember as useRemoveMembers,
  useTransferOwnership,
} from '../_lib/services'
import { TeamType, UserType } from '../types'

interface WorkspaceMembersManageProps {
  selectedWorkspace: TeamType | undefined
}

const WorkspaceMembersManage = ({ selectedWorkspace }: WorkspaceMembersManageProps) => {
  const { user } = useAuth()
  const { data: team } = useGetTeamMembers(selectedWorkspace?.id ?? '')
  const members: UserType[] = team?.members ?? []
  const isOwner = user?.username == team?.owner.username

  return (
    <div>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div className='flex flex-col gap-2'>
            <CardTitle>Workspace Members</CardTitle>
            <CardDescription>Manage the members of the workspace</CardDescription>
          </div>

          {isOwner && <AddMemberDialog selectedWorkspace={selectedWorkspace} members={members} />}
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {members.map((member) => (
              <div
                key={member.id}
                className={cn('flex items-center justify-between p-3 border rounded-md', {
                  'bg-red-100': member.username === user?.username,
                })}
              >
                <div className='flex items-center gap-3'>
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='font-medium flex items-center gap-2'>
                      {member.name}
                      <div>
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              {member.username === team?.owner.username && (
                                <IconUserStar className='size-4 text-red-400' fill='currentColor' />
                              )}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Owner of the workspace</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    <p className='text-sm text-muted-foreground'>{member.email}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  {isOwner && member.username !== user?.username && (
                    <RemoveMemberDialog selectedWorkspace={selectedWorkspace} member={member} />
                  )}

                  {isOwner && member.username == user?.username && (
                    <TransferOwnershipDialog selectedWorkspace={selectedWorkspace} members={members} />
                  )}

                  {!isOwner && member.username == user?.username && (
                    <LeaveWorkspaceDialog selectedWorkspace={selectedWorkspace} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const AddMemberDialog = ({
  selectedWorkspace,
  members,
}: {
  selectedWorkspace: TeamType | undefined
  members: UserType[]
}) => {
  const [open, setOpen] = useState(false)
  const { data: users } = useListUsers()
  const { mutateAsync: addMember, isPending: isAddMemberPending } = useAddMembers()

  const options: { label: string; value: string }[] =
    users
      ?.filter((user) => !members.map((m) => m.id).includes(user.id)) // 过滤掉已有的成员
      .map((user) => ({
        label: user.name,
        value: user.id,
      })) ?? []

  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const handleAddMember = () => {
    toast.promise(addMember({ id: selectedWorkspace?.id ?? '', memberIds: selectedUsers }), {
      loading: 'Adding members...',
      success: () => {
        setOpen(false)
        setSelectedUsers([])
        return 'Members added successfully'
      },
      error: (e) => ({
        message: e.msg,
        description: e.reason,
      }),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default' className='flex items-center gap-2'>
          <IconUserPlus className='size-4' />
          <span>Add Members</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Members</DialogTitle>
        </DialogHeader>
        <DialogDescription>Add members to the workspace</DialogDescription>

        <MultiSelect
          options={options}
          defaultValue={[]}
          onValueChange={setSelectedUsers}
          placeholder='Select members'
          className='w-full'
          variant='inverted'
          maxCount={10}
        />

        <DialogFooter className='gap-2 sm:space-x-0'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button variant='default' onClick={handleAddMember} disabled={isAddMemberPending}>
            {isAddMemberPending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const RemoveMemberDialog = ({
  selectedWorkspace,
  member,
}: {
  selectedWorkspace: TeamType | undefined
  member: UserType
}) => {
  const [open, setOpen] = useState(false)
  const { mutateAsync: removeMember, isPending: isRemoveMemberPending } = useRemoveMembers()

  const handleRemoveMember = () => {
    toast.promise(removeMember({ id: selectedWorkspace?.id ?? '', memberIds: [member.id] }), {
      loading: 'Removing members...',
      success: () => {
        setOpen(false)
        return 'Members removed successfully'
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          Remove
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            <p className='mt-2'>
              <span className='font-medium text-red-500'>{member.name}</span> will be removed from the workspace.
            </p>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='gap-2 sm:space-x-0'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button variant='destructive' onClick={handleRemoveMember} disabled={isRemoveMemberPending}>
            {isRemoveMemberPending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const TransferOwnershipDialog = ({
  selectedWorkspace,
  members,
}: {
  selectedWorkspace: TeamType | undefined
  members: UserType[]
}) => {
  const [open, setOpen] = useState(false)

  const options: { label: string; value: string }[] =
    members
      ?.filter((member) => member.id !== selectedWorkspace?.owner.id) // 过滤掉当前的 owner
      .map((user) => ({
        label: user.name,
        value: user.id,
      })) ?? []

  const [selectedUser, setSelectedUser] = useState<string>()

  const { mutateAsync: transferOwnership, isPending: isTransferOwnershipPending } = useTransferOwnership()

  const handleTransferOwnership = () => {
    toast.promise(transferOwnership({ id: selectedWorkspace?.id ?? '', newOwnerId: selectedUser }), {
      loading: 'Transferring ownership...',
      success: () => 'Ownership transferred successfully',
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant='default' className='bg-red-500' size='sm' disabled={members?.length < 2}>
                Transfer Ownership
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent className='max-w-xs'>
            <p>You should have as at least one non-owner member in the workspace for transfering ownership</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Ownership</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className='mt-2'></p>
        </DialogDescription>

        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger>
            <SelectValue placeholder='Select a user' />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DialogFooter className='gap-2 sm:space-x-0'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button variant='default' onClick={handleTransferOwnership} disabled={isTransferOwnershipPending}>
            {isTransferOwnershipPending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
            Transfer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const LeaveWorkspaceDialog = ({ selectedWorkspace }: { selectedWorkspace: TeamType | undefined }) => {
  const [open, setOpen] = useState(false)
  const { mutateAsync: leaveTeam, isPending: isLeaveTeamPending } = useLeaveTeam()

  const handleLeaveWorkspace = () => {
    toast.promise(leaveTeam({ id: selectedWorkspace?.id ?? '' }), {
      loading: 'Leaving workspace...',
      success: () => 'Left workspace successfully',
      error: (e) => ({
        message: e.msg,
        description: e.reason,
      }),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='destructive' size='sm'>
          Leave
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className=''>
            <span className='font-medium '>
              You will leave workspace <span className='font-bold text-xl'>{selectedWorkspace?.name}</span>
            </span>
          </p>
        </DialogDescription>

        <DialogFooter className='gap-2 sm:space-x-0'>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button variant='destructive' onClick={handleLeaveWorkspace} disabled={isLeaveTeamPending}>
            {isLeaveTeamPending && <Loader className='mr-2 size-4 animate-spin' aria-hidden='true' />}
            Leave
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default WorkspaceMembersManage
