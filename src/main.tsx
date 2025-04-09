import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { AxiosError } from 'axios'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@ant-design/v5-patch-for-react-19'
import { ConfigProvider } from 'antd'
import locale from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { RouterProvider } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { handleServerError } from '@/utils/handle-server-error'
import { toast } from '@/hooks/use-toast'
import { ThemeProvider } from './context/theme-context'
import './index.css'
import router from './router.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error })

        if (failureCount >= 0 && import.meta.env.DEV) return false
        if (failureCount > 3 && import.meta.env.PROD) return false

        return !(error instanceof AxiosError && [401, 403].includes(error.response?.status ?? 0))
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 60 * 1000, // 10s
      refetchOnMount: false, // 防止组件重新挂载时自动刷新
    },
    mutations: {
      onError: (error) => {
        handleServerError(error)

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast({
              variant: 'destructive',
              title: 'Content not modified!',
            })
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast({
            variant: 'destructive',
            title: 'Session expired!',
          })
          useAuthStore.getState().auth.reset()
          const redirect = window.location.pathname
          window.location.href = `/sign-in?redirect=${redirect}`
        }
        if (error.response?.status === 500) {
          toast({
            variant: 'destructive',
            title: 'Internal Server Error!',
          })
          window.location.href = '/500'
        }
        if (error.response?.status === 403) {
          // window.location.href = '/403'
        }
      }
    },
  }),
})

dayjs.locale('zh-cn')

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
          <ConfigProvider locale={locale} theme={{}}>
            <RouterProvider router={router} />
          </ConfigProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}
