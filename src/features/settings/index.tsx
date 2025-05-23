import { IconBrowserCheck, IconNotification, IconPalette, IconTool, IconUser } from '@tabler/icons-react'
import { Outlet } from 'react-router-dom'
import { Separator } from '@/components/ui/separator'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import SidebarNav from './components/sidebar-nav'

export default function Settings() {
  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main fixed>
        <div className='space-y-0.5'>
          <h1 className='text-2xl font-bold tracking-tight md:text-3xl'>Settings</h1>
          <p className='text-muted-foreground'>Manage your account settings and set e-mail preferences.</p>
        </div>
        <Separator className='my-4 lg:my-6' />
        <div className='flex flex-1 flex-col space-y-2 md:space-y-2 overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0'>
          <aside className='top-0 lg:sticky lg:w-1/5'>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className='flex w-full p-1 pr-4 overflow-y-hidden'>
            <Outlet />
          </div>
        </div>
      </Main>
    </>
  )
}

const sidebarNavItems = [
  {
    title: 'Profile',
    href: '/settings',
    icon: <IconUser className='size-4' />,
  },
  {
    title: 'Account',
    href: '/settings/account',
    icon: <IconBrowserCheck className='size-4' />,
  },
  {
    title: 'Appearance',
    href: '/settings/appearance',
    icon: <IconPalette className='size-4' />,
  },
  {
    title: 'Display',
    href: '/settings/display',
    icon: <IconTool className='size-4' />,
  },
  {
    title: 'Notifications',
    href: '/settings/notifications',
    icon: <IconNotification className='size-4' />,
  },
]
