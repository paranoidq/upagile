import { IconStar, IconUserPlus } from '@tabler/icons-react'
import { useAuth } from '@/stores/authStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetTeamMembers } from '../_lib/services'
import { TeamType } from '../types'

interface WorkspaceMembersManageProps {
  selectedWorkspace: TeamType | undefined
}

const WorkspaceMembersManage = ({ selectedWorkspace }: WorkspaceMembersManageProps) => {
  const { user } = useAuth()
  const { data: team } = useGetTeamMembers(selectedWorkspace?.id ?? '')
  const members = team?.members ?? []
  const isOwner = user?.username == team?.owner.username

  return (
    <div>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div className='flex flex-col gap-2'>
            <CardTitle>Workspace Members</CardTitle>
            <CardDescription>Manage the members of the workspace</CardDescription>
          </div>
          <Button variant='default' className='flex items-center gap-2'>
            <IconUserPlus className='size-4' />
            <span>添加成员</span>
          </Button>
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
                    <p className='font-medium flex items-center gap-2'>
                      {member.name}
                      <div>
                        {isOwner && member.username === team?.owner.username && <IconStar className='size-4' />}
                      </div>
                    </p>
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

export default WorkspaceMembersManage
