import { type FC, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { useListMyTeams } from './_lib/services'
import WorkspaceAdvancedManage from './components/workspace-advanced-manage'
import { WorkspaceEditForm } from './components/workspace-edit-form'
import WorkspaceMembersManage from './components/workspace-members-manage'

const WorkspaceSettings: FC = () => {
  const { data: teams } = useListMyTeams()

  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams?.[0]?.id || '')
  const [activeTab, setActiveTab] = useState('general')

  // 获取当前选中的工作区信息
  const selectedWorkspace = teams?.find((t) => t.id === selectedTeamId)

  // 处理工作区选择变化
  const handleWorkspaceChange = (value: string) => {
    setSelectedTeamId(value)
  }

  return (
    <>
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <span className='text-lg font-bold'>Workspace Settings</span>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <div className='flex flex-col space-y-6'>
          <div className='flex items-center justify-between'>
            <h1 className='text-2xl font-bold'>{selectedWorkspace?.name}</h1>

            {/* 工作区选择器 */}
            <div className='w-64'>
              <Select value={selectedTeamId} onValueChange={handleWorkspaceChange}>
                <SelectTrigger>
                  <SelectValue placeholder='选择工作区' />
                </SelectTrigger>
                <SelectContent>
                  {teams?.map((team) => (
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
                <TabsTrigger value='general'>General</TabsTrigger>
                <TabsTrigger value='members'>Members</TabsTrigger>
                <TabsTrigger value='advanced'>Advanced</TabsTrigger>
              </TabsList>

              <TabsContent value='general'>
                <WorkspaceEditForm selectedWorkspace={selectedWorkspace} />
              </TabsContent>

              <TabsContent value='members'>
                <WorkspaceMembersManage selectedWorkspace={selectedWorkspace} />
              </TabsContent>

              <TabsContent value='advanced'>
                <WorkspaceAdvancedManage selectedWorkspace={selectedWorkspace} />
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
