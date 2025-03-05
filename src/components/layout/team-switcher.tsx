import { IconCrown, IconNavigationBolt } from '@tabler/icons-react'
import { ChevronsUpDown, Plus } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useTeamStore } from '@/stores/teamStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

export function TeamSwitcher() {
  const { isMobile } = useSidebar()
  const { teams, currentTeam } = useTeamStore()
  const { user } = useAuthStore().auth

  const handleTeamChange = (teamId: string) => {
    const activeTeam = teams.find((team) => team.id === teamId)

    // 更新 localStorage 中的 activeTeam
    useTeamStore.getState().setCurrentTeam(activeTeam!)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                {currentTeam && <IconNavigationBolt className='size-4' />}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{currentTeam?.name}</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>Teams</DropdownMenuLabel>
            {teams &&
              teams.map((team) => (
                <DropdownMenuItem key={team.name} onClick={() => handleTeamChange(team.id)} className='gap-2 p-2'>
                  <div className='flex size-6 items-center justify-center rounded-sm border'>
                    <IconNavigationBolt className='size-4 shrink-0' />
                  </div>
                  {team.name}
                  {team.owner.username === user?.username && (
                    <IconCrown className='ml-auto size-4 shrink-0' fill='#FFD700' stroke='#FFD700' strokeWidth={1.5} />
                  )}
                </DropdownMenuItem>
              ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className='gap-2 p-2'>
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <Plus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
