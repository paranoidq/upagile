import { createRouter } from '@tanstack/react-router'
import Backlog from '@/features/backlog'
import DashboardPage from '@/features/dashboard/components/DashboardPage'
import Issue from '@/features/issue'
import Project from '@/features/project'
import Requirement from '@/features/requirement'
import Sprint from '@/features/sprint'
import Workspace from '@/features/workspace'

const router = createRouter({
  routes: [
    {
      path: '/backlog',
      component: Backlog,
    },
    {
      path: '/dashboard',
      component: DashboardPage,
    },
    {
      path: '/issue',
      component: Issue,
    },
    {
      path: '/project',
      component: Project,
    },
    {
      path: '/requirement',
      component: Requirement,
    },
    {
      path: '/sprint',
      component: Sprint,
    },
    {
      path: '/workspace',
      component: Workspace,
    },
  ],
})

export default router
