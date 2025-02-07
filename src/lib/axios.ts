import axios, { AxiosHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env.config'

// 定义响应数据的基础接口
interface BaseResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// 定义请求配置的扩展接口
interface RequestConfig extends InternalAxiosRequestConfig {
  skipErrorHandler?: boolean // 是否跳过错误处理
  skipAuth?: boolean // 是否跳过认证
}

// 创建 axios 实例
export const http = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
})

// 请求拦截器
http.interceptors.request.use(
  (config: RequestConfig) => {
    if (!config.skipAuth) {
      // 可以在这里添加 token 等认证信息
      const token = localStorage.getItem('token')
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

    if (code == 0) {
      return data
    } else {
      // 处理其他状态码
      throw new Error(message)
    }
  },
  (error) => {
    // 统一错误处理
    if (!error.config?.skipErrorHandler) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // 处理未授权
            break
          case 403:
            // 处理禁止访问
            break
          case 404:
            // 处理未找到
            break
          case 500:
            // 处理服务器错误
            break
        }
      }
    }
    return Promise.reject(error)
  },
)
