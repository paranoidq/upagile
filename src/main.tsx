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
          <ConfigProvider
            locale={locale}
            theme={{
              token: {
                // 设置主色为黑色
                colorPrimary: '#000000',
                // 设置成功状态色
                colorSuccess: '#389e0d',
                // 设置链接色
                colorLink: '#000000',
                // 设置按钮、输入框等组件的边框颜色
                colorBorder: '#d9d9d9',
                // 设置文本颜色
                colorText: '#000000',
                // 设置次要文本颜色
                colorTextSecondary: '#333333',
              },
              components: {
                // 自定义按钮组件
                Button: {
                  colorPrimary: '#000000',
                  colorPrimaryHover: '#333333',
                  colorPrimaryActive: '#000000',
                },
                // 自定义选择器组件
                Select: {
                  colorPrimary: '#555555',
                  colorPrimaryHover: '#777777',
                  colorPrimaryActive: '#333333',
                  colorBgContainer: '#ffffff',
                  colorBorder: '#d9d9d9',
                  colorTextQuaternary: '#888888',
                  controlItemBgActive: '#f0f0f0',
                  controlItemBgHover: '#f5f5f5',
                  activeBorderColor: '#555555',
                  activeShadow: 'none',
                  controlOutline: 'rgba(0, 0, 0, 0.1)',
                  controlOutlineWidth: 1,
                  lineWidth: 1,
                  lineWidthFocus: 1,
                },
                // 自定义输入框组件
                Input: {
                  colorPrimary: '#000000',
                  colorBorder: '#d9d9d9',
                  activeBorderColor: '#555555',
                  activeShadow: 'none',
                  hoverBorderColor: '#888888',
                  controlOutline: 'rgba(0, 0, 0, 0.1)',
                  controlOutlineWidth: 1,
                  lineWidth: 1,
                  lineWidthFocus: 1,
                },
                // 自定义日期选择器
                DatePicker: {
                  colorPrimary: '#000000',
                  colorPrimaryHover: '#333333',
                  colorBgContainer: '#ffffff',
                  activeBorderColor: '#555555',
                  activeShadow: 'none',
                  controlOutline: 'rgba(0, 0, 0, 0.1)',
                  controlOutlineWidth: 1,
                  lineWidth: 1,
                  lineWidthFocus: 1,
                },
                // 自定义标签
                Tag: {
                  colorBorder: '#000000',
                },
                // 其他组件...
              },
            }}
          >
            <RouterProvider router={router} />
          </ConfigProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}
