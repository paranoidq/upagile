import axios, { AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 定义响应数据的基础接口
interface BaseResponse<T = unknown> {
  code: string
  data: T
  msg: string
  reason: string
}

// 定义请求配置的扩展接口
interface RequestConfig extends InternalAxiosRequestConfig {
  skipErrorHandler?: boolean // 是否跳过错误处理
  skipAuth?: boolean // 是否跳过认证
  loadingDelay?: number // 当请求时间小于 loadingDelay 时，延迟返回response，避免laoding闪烁的问题
}

// 创建 axios 实例
const API_BASE_URL = import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_BASE_URL
export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
http.interceptors.request.use(
  (config: RequestConfig) => {
    if (!config.skipAuth) {
      // 可以在这里添加 token 等认证信息
      const token = useAuthStore.getState().auth.accessToken
      if (token) {
        const headers = new AxiosHeaders(config.headers)
        headers.set('Authorization', `Bearer ${token}`)
        config.headers = headers
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
http.interceptors.response.use(
  // Any status code that lie within the range of 2xx cause this function to trigger
  async <T>(response: AxiosResponse<BaseResponse<T>>) => {
    const { code, data, msg, reason } = response.data
    if (code === '0000000') {
      const config = response.config as RequestConfig

      if (config.loadingDelay && config.loadingDelay > 0) {
        // 只有在启用了 loading 配置时才添加延迟
        const [result] = await Promise.all([data, delay(config.loadingDelay)])
        return result
      }
      return data
    }

    return Promise.reject({
      code,
      msg,
      reason,
    })
  },
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  async (error) => {
    if (!error.config?.skipErrorHandler) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
          case 403:
            useAuthStore.getState().auth.reset()
            toast.error('登录已过期，请重新登录')
            window.location.href = `/sign-in?redirect=${window.location.pathname}`
            break
          case 404:
            window.location.href = '/404'
            break
          case 500:
            window.location.href = '/500'
            break
        }
      }
    }

    // 只在启用了 loading 配置时添加延迟
    if (error.config?.loadingDelay > 0) {
      await delay(error.config.loadingDelay)
    }

    return Promise.reject({
      code: error.response?.status,
      message: error.response?.data.message,
      reason: error.response?.data.reason,
    })
  },
)
