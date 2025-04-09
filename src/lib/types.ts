import type { AxiosRequestConfig } from 'axios'

export type RequestOptions = AxiosRequestConfig & {
  loadingDelay?: number
}

// 创建请求配置的辅助函数
export const createRequestConfig = (config: RequestOptions = {}): RequestOptions => {
  return {
    ...config,
    loadingDelay: config.loadingDelay || 300,
  }
}
