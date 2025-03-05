import axios, { AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'

// 定义响应数据的基础接口
interface BaseResponse<T = unknown> {
  code: string
  data: T
  message: string
}

// 定义请求配置的扩展接口
interface RequestConfig extends InternalAxiosRequestConfig {
  skipErrorHandler?: boolean // 是否跳过错误处理
  skipAuth?: boolean // 是否跳过认证
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
  <T>(response: AxiosResponse<BaseResponse<T>>) => {
    const { code, data, message } = response.data

    if (code === '0000000') {
      return data
    } else {
      throw new Error(message)
    }
  },
  (error) => {
    // 统一错误处理
    if (!error.config?.skipErrorHandler) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
          case 403:
            useAuthStore.getState().auth.reset()
            router.navigate({
              to: '/sign-in',
              search: { redirect: window.location.pathname },
            })
            break
          case 404:
            router.navigate({
              to: '/404',
            })
            break
          case 500:
            router.navigate({
              to: '/500',
            })
            break
        }
      }
    }
    return Promise.reject(error)
  },
)
