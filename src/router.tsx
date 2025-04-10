import Cookies from 'js-cookie'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import { SearchProvider } from '@/context/search-context'
// 根布局组件
import { SidebarProvider } from '@/components/ui/sidebar'
// 导入组件
import ComingSoon from '@/components/coming-soon'
import { AppSidebar } from '@/components/layout/app-sidebar'
import SkipToMain from '@/components/skip-to-main'
import Apps from '@/features/apps'
import ForgotPassword from '@/features/auth/forgot-password'
import Otp from '@/features/auth/otp'
import SignIn from '@/features/auth/sign-in'
import SignUp from '@/features/auth/sign-up'
import BacklogPage from '@/features/backlog'
import Chats from '@/features/chats'
import Dashboard from '@/features/dashboard'
import ForbiddenError from '@/features/errors/forbidden'
import GeneralError from '@/features/errors/general-error'
import MaintenanceError from '@/features/errors/maintenance-error'
import NotFoundError from '@/features/errors/not-found-error'
import UnauthorisedError from '@/features/errors/unauthorized-error'
import Issue from '@/features/issue'
import Project from '@/features/project'
import Release from '@/features/release'
import Requirement from '@/features/requirement'
import Settings from '@/features/settings'
import SettingsAccount from '@/features/settings/account'
import SettingsAppearance from '@/features/settings/appearance'
import SettingsDisplay from '@/features/settings/display'
import SettingsNotifications from '@/features/settings/notifications'
import SettingsProfile from '@/features/settings/profile'
import Sprint from '@/features/sprint'
import Tasks from '@/features/tasks'
import Users from '@/features/users'
import WorkspaceSettings from '@/features/workspace/settings'

// 认证布局组件
function AuthenticatedLayout() {
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'

  return (
    <SearchProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <div
          id='content'
          className={cn(
            'max-w-full w-full ml-auto',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] ease-linear duration-200',
            'h-svh flex flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh',
          )}
        >
          <Outlet />
        </div>
      </SidebarProvider>
    </SearchProvider>
  )
}

// 认证守卫组件
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { auth } = useAuthStore.getState()

  if (!auth.accessToken) {
    // 获取当前路径作为重定向目标
    const currentPath = window.location.pathname
    return <Navigate to={`/sign-in?redirect=${currentPath}`} replace />
  }

  return <>{children}</>
}

// 根布局组件
function RootLayout() {
  return (
    <>
      <NuqsAdapter>
        <Outlet />
      </NuqsAdapter>
      <Toaster position='top-right' richColors closeButton />
      {import.meta.env.MODE === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </>
  )
}

// 创建路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <GeneralError />,
    children: [
      {
        path: '/',
        element: (
          <AuthGuard>
            <AuthenticatedLayout />
          </AuthGuard>
        ),
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'backlog', element: <BacklogPage /> },
          { path: 'issue', element: <Issue /> },
          { path: 'project', element: <Project /> },
          { path: 'requirement', element: <Requirement /> },
          { path: 'sprint', element: <Sprint /> },
          { path: 'apps', element: <Apps /> },
          { path: 'tasks', element: <Tasks /> },
          { path: 'users', element: <Users /> },
          { path: 'release', element: <Release /> },
          { path: 'chats', element: <Chats /> },
          { path: 'help-center', element: <ComingSoon /> },
          {
            path: 'settings',
            element: <Settings />,
            children: [
              { index: true, element: <SettingsProfile /> },
              { path: 'account', element: <SettingsAccount /> },
              { path: 'appearance', element: <SettingsAppearance /> },
              { path: 'display', element: <SettingsDisplay /> },
              { path: 'notifications', element: <SettingsNotifications /> },
            ],
          },
          { path: 'my-workspace/issues', element: <Issue /> },
          { path: 'my-workspace/sprints', element: <Sprint /> },
          { path: 'my-workspace/releases', element: <Release /> },
          {
            path: 'workspace/:teamId/issues',
            element: <Issue />,
          },
          {
            path: 'workspace/:teamId/sprints',
            element: <Sprint />,
          },
          {
            path: 'workspace/:teamId/releases',
            element: <Release />,
          },
          {
            path: 'workspace/settings',
            element: <WorkspaceSettings />,
          },
        ],
      },
      // 认证相关路由
      { path: 'sign-in', element: <SignIn /> },
      { path: 'sign-up', element: <SignUp /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'otp', element: <Otp /> },

      // 错误页面
      { path: '401', element: <UnauthorisedError /> },
      { path: '403', element: <ForbiddenError /> },
      { path: '404', element: <NotFoundError /> },
      { path: '500', element: <GeneralError /> },
      { path: '503', element: <MaintenanceError /> },

      // 捕获所有未匹配的路由
      { path: '*', element: <NotFoundError /> },
    ],
  },
])

export default router
