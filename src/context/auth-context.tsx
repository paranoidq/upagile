import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Account, AuthState } from '@/features/auth/types'

// 默认认证状态
const defaultAuthState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  account: null,
}

// 创建上下文
type AuthContextType = {
  authState: AuthState
  login: (accessToken: string, refreshToken: string, account: Account) => void
  logout: () => void
  updateToken: (accessToken: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 本地存储键
const AUTH_STORAGE_KEY = 'auth_state'

// Provider 组件
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    // 从本地存储加载认证状态
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth)
        return {
          ...parsedAuth,
          isAuthenticated: !!parsedAuth.accessToken,
        }
      } catch (error) {
        console.error('Failed to parse auth state from localStorage:', error)
      }
    }
    return defaultAuthState
  })

  // 当认证状态变化时，更新本地存储
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [authState])

  // 登录方法
  const login = (accessToken: string, refreshToken: string, account: Account) => {
    setAuthState({
      isAuthenticated: true,
      accessToken,
      refreshToken,
      account,
    })
  }

  // 登出方法
  const logout = () => {
    setAuthState(defaultAuthState)
  }

  // 更新 token 方法
  const updateToken = (accessToken: string) => {
    setAuthState((prev) => ({
      ...prev,
      accessToken,
    }))
  }

  return <AuthContext.Provider value={{ authState, login, logout, updateToken }}>{children}</AuthContext.Provider>
}

// 自定义 Hook 用于访问认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
