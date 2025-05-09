import {
  IconBook,
  IconBrowserCheck,
  IconBug,
  IconBulb,
  IconChecklist,
  IconCube,
  IconDeviceDesktop,
  IconDots,
  IconFlag,
  IconHelp,
  IconLayoutDashboard,
  IconLayoutKanban,
  IconListCheck,
  IconNotification,
  IconPalette,
  IconSettings,
  IconTargetArrow,
  IconTool,
  IconUserCog,
} from '@tabler/icons-react'
import { Team as Workspace } from '@/features/workspace/types'
import { type SidebarData } from '../types'

// 创建一个函数来生成侧边栏数据
export const getSidebarData = (workspaces: Workspace[] = []): SidebarData => {
  return {
    navGroups: [
      {
        title: 'General',
        items: [
          {
            title: 'Requirements',
            url: '/requirements',
            icon: IconBulb,
          },
          {
            title: 'Projects',
            url: '/projects',
            icon: IconLayoutKanban,
          },
        ],
      },
      {
        title: 'My Works',
        items: [
          {
            title: 'Issues',
            url: '/issues',
            icon: IconChecklist,
          },
          {
            title: 'Sprints',
            url: '/sprints',
            icon: IconFlag,
          },
          {
            title: 'Releases',
            url: '/releases',
            icon: IconTargetArrow,
          },
        ],
      },
      {
        title: 'Workspaces',
        items: [
          // 动态生成团队列表
          ...workspaces.map((workspace) => ({
            title: workspace.name,
            url: `/workspace/${workspace.id}`,
            icon: IconCube,
            items: [
              {
                title: 'Issues',
                url: `/workspace/${workspace.id}/issues`,
                icon: IconChecklist,
              },
              {
                title: 'Sprints',
                url: `/workspace/${workspace.id}/sprints`,
                icon: IconFlag,
              },
              {
                title: 'Releases',
                url: `/workspace/${workspace.id}/releases`,
                icon: IconTargetArrow,
              },
              {
                title: 'Retros',
                url: `/workspace/${workspace.id}/retros`,
                icon: IconBug,
              },
              {
                title: 'Applications',
                url: `/workspace/${workspace.id}/systems`,
                icon: IconDeviceDesktop,
              },
              {
                title: 'Docs',
                url: `/workspace/${workspace.id}/docs`,
                icon: IconBook,
              },
              {
                title: 'Others',
                url: `/workspace/${workspace.id}/others`,
                icon: IconDots,
              },
            ],
          })),
        ],
      },
      {
        title: 'Other',
        items: [
          {
            title: 'Settings',
            icon: IconSettings,
            url: '/settings',
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
        ],
      },
    ],
  }
}
