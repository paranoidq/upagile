import { type FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTeamStore } from '@/stores/teamStore'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'

const Workspace: FC = () => {
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
  const workspaceName = teamId ? teams.find((t) => t.id === teamId)?.name || '工作区' : '我的工作区'

  return (
    <>
      <Header fixed>
        <div className='flex items-center space-x-4'>
          <span className='text-lg font-bold'>{workspaceName}</span>
        </div>

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>
      <Main>
        <h1 className='text-2xl font-bold mb-6'>{workspaceName}</h1>
        <div className='rounded-lg border bg-card text-card-foreground shadow-sm p-6'>
          <p>欢迎来到 {workspaceName}！</p>
          <p className='mt-4'>在这里您可以管理团队的 Issues、Sprints 和 Releases。</p>
        </div>
      </Main>
    </>
  )
}

export default Workspace
