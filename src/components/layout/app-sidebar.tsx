import { useAuthStore } from '@/stores/authStore'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from '@/components/layout/nav-user'
import { TeamSwitcher } from '@/components/layout/team-switcher'
import { getSidebarData } from './data/sidebar-data'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore().auth

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

  const sidebarData = {
    user: {
      name: user?.name || 'Guest',
      email: user?.email || '',
      avatar: '/avatars/shadcn.jpg',
    },
    navGroups: [...getSidebarData().navGroups],
  }

  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
