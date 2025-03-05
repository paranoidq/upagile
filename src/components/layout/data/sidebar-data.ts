import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconChecklist,
  IconError404,
  IconFlag,
  IconFolderPlus,
  IconHelp,
  IconHome,
  IconLayoutDashboard,
  IconListCheck,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNavigationBolt,
  IconNotification,
  IconPackages,
  IconPalette,
  IconRocket,
  IconServerOff,
  IconSettings,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
} from '@tabler/icons-react'
import { AudioWaveform, GalleryVerticalEnd } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { type SidebarData } from '../types'

// 创建一个函数来生成侧边栏数据
export const getSidebarData = (): SidebarData => {
  // 从认证存储中获取用户信息
  const { user } = useAuthStore.getState().auth

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

  return {
    user: {
      name: userData?.name || 'Guest',
      email: userData?.email || '',
      avatar: '/avatars/shadcn.jpg',
    },
    teams: [
      {
        name: 'The Agile',
        logo: IconNavigationBolt,
        plan: '',
      },
      {
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise',
      },
      {
        name: 'Acme Corp.',
        logo: AudioWaveform,
        plan: 'Startup',
      },
    ],
    navGroups: [
      {
        title: 'General',
        items: [
          {
            title: 'Backlog',
            url: '/backlog',
            icon: IconListCheck,
          },
          {
            title: 'Dashboard',
            url: '/dashboard',
            icon: IconLayoutDashboard,
          },
          {
            title: 'Workspace',
            url: '/workspace',
            icon: IconHome,
          },
          {
            title: 'Project',
            url: '/project',
            icon: IconPackages,
          },
          {
            title: 'Requirement',
            url: '/requirement',
            icon: IconFolderPlus,
          },
          {
            title: 'Issue',
            url: '/issue',
            icon: IconChecklist,
          },
          {
            title: 'Sprint',
            url: '/sprint',
            icon: IconFlag,
          },
          {
            title: 'Release',
            url: '/release',
            icon: IconRocket,
          },
        ],
      },
      {
        title: 'Pages',
        items: [
          {
            title: 'Dashboard',
            url: '/',
            icon: IconLayoutDashboard,
          },
          {
            title: 'Tasks',
            url: '/tasks',
            icon: IconChecklist,
          },
          {
            title: 'Apps',
            url: '/apps',
            icon: IconPackages,
          },
          {
            title: 'Chats',
            url: '/chats',
            badge: '3',
            icon: IconMessages,
          },
          {
            title: 'Users',
            url: '/users',
            icon: IconUsers,
          },
          {
            title: 'Auth',
            icon: IconLockAccess,
            items: [
              {
                title: 'Sign In',
                url: '/sign-in',
              },
              {
                title: 'Sign In (2 Col)',
                url: '/sign-in-2',
              },
              {
                title: 'Sign Up',
                url: '/sign-up',
              },
              {
                title: 'Forgot Password',
                url: '/forgot-password',
              },
              {
                title: 'OTP',
                url: '/otp',
              },
            ],
          },
          {
            title: 'Errors',
            icon: IconBug,
            items: [
              {
                title: 'Unauthorized',
                url: '/401',
                icon: IconLock,
              },
              {
                title: 'Forbidden',
                url: '/403',
                icon: IconUserOff,
              },
              {
                title: 'Not Found',
                url: '/404',
                icon: IconError404,
              },
              {
                title: 'Internal Server Error',
                url: '/500',
                icon: IconServerOff,
              },
              {
                title: 'Maintenance Error',
                url: '/503',
                icon: IconBarrierBlock,
              },
            ],
          },
        ],
      },
      {
        title: 'Other',
        items: [
          {
            title: 'Settings',
            icon: IconSettings,
            items: [
              {
                title: 'Profile',
                url: '/settings',
                icon: IconUserCog,
              },
              {
                title: 'Account',
                url: '/settings/account',
                icon: IconTool,
              },
              {
                title: 'Appearance',
                url: '/settings/appearance',
                icon: IconPalette,
              },
              {
                title: 'Notifications',
                url: '/settings/notifications',
                icon: IconNotification,
              },
              {
                title: 'Display',
                url: '/settings/display',
                icon: IconBrowserCheck,
              },
            ],
          },
          {
            title: 'Help Center',
            url: '/help-center',
            icon: IconHelp,
          },
        ],
      },
    ],
  }
}
