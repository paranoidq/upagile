import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useTeamStore } from '@/stores/teamStore'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { NavHeader } from '@/components/layout/team-switcher.tsx'
import { useListMyTeams } from '@/features/workspace/_lib/services'
import { getSidebarData } from './data/sidebar-data'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore().auth
  const { data: teams, isLoading } = useListMyTeams()
  const { setTeams, teams: storeTeams } = useTeamStore()

  // 当获取到团队数据时，更新 store
  useEffect(() => {
    if (teams) {
      setTeams(teams)
    }
  }, [teams, setTeams])

  // 如果 user 为空，尝试从 localStorage 获取
  let userData = user
  if (!userData) {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        userData = JSON.parse(storedUser)
      } catch (e) {
        console.error('无法解析存储的用户数据', e)
      }
    }
  }

  // 使用 storeTeams 或 teams 来生成侧边栏数据
  const myTeams = storeTeams.length > 0 ? storeTeams : teams || []

  const sidebarData = {
    user: {
      name: user?.name || 'Guest',
      email: user?.email || '',
      avatar: user?.avatar || '',
    },
    navGroups: [...getSidebarData(myTeams).navGroups],
  }

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props, index) => (
          <NavGroup key={props.title || index} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
