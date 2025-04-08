import { useState } from 'react'
import { IconNavigationBolt, IconPlus, IconSettings } from '@tabler/icons-react'
import { ChevronsUpDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { CreateTeamDialog } from '@/features/workspace/components/create-team-dialog'

export function TeamSwitcher() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const navigate = useNavigate()

  /* ------------------ UI render ------------------ */
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
                {<IconNavigationBolt className='size-4' />}
              </div>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>XAgile</span>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            align='start'
            side={'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className='text-xs text-muted-foreground'>Workspaces</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='gap-2 p-2'
              onSelect={(e) => {
                e.preventDefault()
                setDialogOpen(true)
              }}
            >
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <IconPlus className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>添加Workspace</div>
            </DropdownMenuItem>

            <DropdownMenuItem
              className='gap-2 p-2'
              onSelect={(e) => {
                e.preventDefault()
                navigate('workspace/settings')
              }}
            >
              <div className='flex size-6 items-center justify-center rounded-md border bg-background'>
                <IconSettings className='size-4' />
              </div>
              <div className='font-medium text-muted-foreground'>设置Workspace</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <CreateTeamDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </SidebarMenu>
  )
}
