import { type FC, useState } from 'react'
import { IconUserPlus } from '@tabler/icons-react'
import { useTeamStore } from '@/stores/teamStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

const WorkspaceSettings: FC = () => {
  const { teams } = useTeamStore()
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams.length > 0 ? teams[0]?.id : '')
  const [activeTab, setActiveTab] = useState('general')

  // 获取当前选中的工作区信息
  const selectedWorkspace = teams.find((t) => t.id === selectedTeamId)

  // 模拟成员数据 - 实际应用中应该根据选中的团队ID获取对应的成员
  const members = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: '管理员', avatar: '' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: '成员', avatar: '' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: '成员', avatar: '' },
  ]

  // 处理工作区选择变化
  const handleWorkspaceChange = (value: string) => {
    setSelectedTeamId(value)
  }

  return (
    <>
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <span className='text-lg font-bold'>工作区设置</span>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='flex flex-col space-y-6'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold'>工作区设置</h1>

            {/* 工作区选择器 */}
            <div className='w-64'>
              <Select value={selectedTeamId} onValueChange={handleWorkspaceChange}>
                <SelectTrigger>
                  <SelectValue placeholder='选择工作区' />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedWorkspace ? (
            <Tabs defaultValue={activeTab} className='w-full' onValueChange={setActiveTab}>
              <TabsList className='mb-4'>
                <TabsTrigger value='general'>基本信息</TabsTrigger>
                <TabsTrigger value='members'>成员管理</TabsTrigger>
                <TabsTrigger value='permissions'>权限设置</TabsTrigger>
              </TabsList>

              <TabsContent value='general'>
                <Card>
                  <CardHeader>
                    <CardTitle>基本信息</CardTitle>
                    <CardDescription>管理工作区的基本信息</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-4'>
                      <div>
                        <h3 className='text-lg font-medium'>工作区名称</h3>
                        <p className='text-muted-foreground'>{selectedWorkspace?.name}</p>
                      </div>
                      <div>
                        <h3 className='text-lg font-medium'>工作区描述</h3>
                        <p className='text-muted-foreground'>{selectedWorkspace?.description || '暂无描述'}</p>
                      </div>
                      <div>
                        <h3 className='text-lg font-medium'>创建者</h3>
                        <p className='text-muted-foreground'>
                          {selectedWorkspace?.owner?.name || selectedWorkspace?.owner?.username}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='members'>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between'>
                    <div>
                      <CardTitle>成员管理</CardTitle>
                      <CardDescription>管理工作区的成员</CardDescription>
                    </div>
                    <Button className='flex items-center gap-1'>
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
                              <p className='font-medium'>{member.name}</p>
                              <p className='text-sm text-muted-foreground'>{member.email}</p>
                            </div>
                          </div>
                          <div className='flex items-center gap-3'>
                            <Badge variant={member.role === '管理员' ? 'default' : 'outline'}>{member.role}</Badge>
                            <Button variant='ghost' size='sm'>
                              管理
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='permissions'>
                <Card>
                  <CardHeader>
                    <CardTitle>权限设置</CardTitle>
                    <CardDescription>管理工作区的权限</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>权限设置功能正在开发中...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className='flex items-center justify-center p-6'>
                <p className='text-muted-foreground'>请选择一个工作区进行管理</p>
              </CardContent>
            </Card>
          )}
        </div>
      </Main>
    </>
  )
}

export default WorkspaceSettings
