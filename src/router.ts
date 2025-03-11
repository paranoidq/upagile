import { createRouter } from '@tanstack/react-router'
import BacklogTable from '@/features/backlog'
import Issue from '@/features/issue'
import Project from '@/features/project'
import Requirement from '@/features/requirement'
import Sprint from '@/features/sprint'
import Workspace from '@/features/workspace'
import Dashboard from './features/dashboard'

const router = createRouter({
  routes: [
    {
      path: '/backlog',
      component: BacklogTable,
    },
    {
      path: '/dashboard',
      component: Dashboard,
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
