// 为vite env环境变量增加引用时的type提示
/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: 'development' | 'production' | 'staging'
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_MOCK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
