import {
  IconBarrierBlock,
  IconBrowserCheck,
  IconBug,
  IconChecklist,
  IconCube,
  IconError404,
  IconFlag,
  IconHelp,
  IconHomeShield,
  IconLayoutDashboard,
  IconListCheck,
  IconLock,
  IconLockAccess,
  IconMessages,
  IconNotification,
  IconPackages,
  IconPalette,
  IconServerOff,
  IconSettings,
  IconTargetArrow,
  IconTool,
  IconUserCog,
  IconUserOff,
  IconUsers,
} from '@tabler/icons-react'
import { TeamType } from '@/features/workspace/types'
import { type SidebarData } from '../types'

// 创建一个函数来生成侧边栏数据
export const getSidebarData = (teams: TeamType[] = []): SidebarData => {
  return {
    navGroups: [
      {
        title: 'General',
        items: [
          {
            title: 'Dashboard',
            url: '/dashboard',
            icon: IconLayoutDashboard,
          },
          {
            title: 'Backlog',
            url: '/backlog',
            icon: IconListCheck,
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
            icon: IconTargetArrow,
          },
          // {
          //   title: 'Workspace',
          //   url: '/workspace',
          //   icon: IconHome,
          // },
          // {
          //   title: 'Project',
          //   url: '/project',
          //   icon: IconPackages,
          // },
          // {
          //   title: 'Requirement',
          //   url: '/requirement',
          //   icon: IconFolderPlus,
          // },
        ],
      },
      {
        title: 'Workspaces',
        items: [
          {
            title: 'My Workspace(private)',
            url: '/my-workspace',
            icon: IconHomeShield,
            items: [
              {
                title: 'Issues',
                url: '/my-workspace/issues',
                icon: IconChecklist,
              },
              {
                title: 'Sprints',
                url: '/my-workspace/sprints',
                icon: IconFlag,
              },
              {
                title: 'Releases',
                url: '/my-workspace/releases',
                icon: IconTargetArrow,
              },
            ],
          },
          // 动态生成团队列表
          ...teams.map((team) => ({
            title: team.name,
            url: `/workspace/${team.id}`,
            icon: IconCube,
            items: [
              {
                title: 'Issues',
                url: `/workspace/${team.id}/issues`,
                icon: IconChecklist,
              },
              {
                title: 'Sprints',
                url: `/workspace/${team.id}/sprints`,
                icon: IconFlag,
              },
              {
                title: 'Releases',
                url: `/workspace/${team.id}/releases`,
                icon: IconTargetArrow,
              },
            ],
          })),
        ],
      },
      {
        title: 'AAA',
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
