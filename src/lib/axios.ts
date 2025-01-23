import axios from 'axios'
import { env } from '@/config/env.config'

// 创建 axios 实例
export const http = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 可以在这里添加 token 等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // 统一错误处理
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
    return Promise.reject(error)
  }
)
