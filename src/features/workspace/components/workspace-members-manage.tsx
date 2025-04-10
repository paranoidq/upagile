import { useState } from 'react'
import { IconStar, IconUserPlus } from '@tabler/icons-react'
import { Loader } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/stores/authStore'
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
import { useAddMember as useAddMembers, useGetTeamMembers, useListUsers } from '../_lib/services'
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
              <div key={member.id} className='flex items-center justify-between p-3 border rounded-md'>
                <div className='flex items-center gap-3'>
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='font-medium flex items-center gap-2'>
                      {member.name}
                      <div>
                        {isOwner && member.username === team?.owner.username && <IconStar className='size-4' />}
                      </div>
                    </div>
                    <p className='text-sm text-muted-foreground'>{member.email}</p>
                  </div>
                </div>
                <div className='flex items-center gap-3'>
                  {isOwner && member.username !== user?.username && (
                    <div>
                      <Button variant='destructive' size='sm'>
                        Remove
                      </Button>
                    </div>
                  )}

                  {isOwner && member.username == user?.username && (
                    <div>
                      <Button variant='secondary' size='sm' className='hover:bg-red-500 hover:text-white'>
                        Transfer Ownership
                      </Button>
                    </div>
                  )}

                  {!isOwner && (
                    <div>
                      <Button variant='secondary' size='sm' className='hover:bg-red-500 hover:text-white'>
                        Leave
                      </Button>
                    </div>
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

export default WorkspaceMembersManage
