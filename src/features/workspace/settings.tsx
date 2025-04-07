import { type FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTeamStore } from '@/stores/teamStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

const WorkspaceSettings: FC = () => {
  const { teamId } = useParams()
  const { teams, currentTeam, setCurrentTeam } = useTeamStore()

  // 当路由参数中的 teamId 变化时，更新当前选中的团队
  useEffect(() => {
    if (teamId && teams.length > 0) {
      const team = teams.find((t) => t.id === teamId)
      if (team && team.id !== currentTeam?.id) {
        setCurrentTeam(team)
      }
    }
  }, [teamId, teams, currentTeam, setCurrentTeam])

  // 获取当前工作区信息
  const workspace = teamId ? teams.find((t) => t.id === teamId) : null
  const workspaceName = workspace?.name || '工作区'

  return (
    <>
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <span className='text-lg font-bold'>{workspaceName} - 设置</span>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <h1 className='text-2xl font-bold mb-6'>{workspaceName} 设置</h1>

        <Tabs defaultValue='general' className='w-full'>
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
                    <p className='text-muted-foreground'>{workspace?.name}</p>
                  </div>
                  <div>
                    <h3 className='text-lg font-medium'>工作区描述</h3>
                    <p className='text-muted-foreground'>{workspace?.description || '暂无描述'}</p>
                  </div>
                  <div>
                    <h3 className='text-lg font-medium'>创建者</h3>
                    <p className='text-muted-foreground'>{workspace?.owner?.name || workspace?.owner?.username}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='members'>
            <Card>
              <CardHeader>
                <CardTitle>成员管理</CardTitle>
                <CardDescription>管理工作区的成员</CardDescription>
              </CardHeader>
              <CardContent>
                <p>成员管理功能正在开发中...</p>
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
      </Main>
    </>
  )
}

export default WorkspaceSettings
