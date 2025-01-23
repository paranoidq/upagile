export const env = {
  APP_ENV: import.meta.env.VITE_APP_ENV,
  APP_TITLE: import.meta.env.VITE_APP_TITLE,
  APP_VERSION: import.meta.env.VITE_APP_VERSION,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  API_MOCK_URL: import.meta.env.VITE_API_MOCK_URL,

  // 环境判断
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
}
