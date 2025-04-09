import Cookies from 'js-cookie'
import { create } from 'zustand'

const ACCESS_TOKEN = 'auth_token'
const LOGIN_USER = 'login_user'

interface AuthUser {
  username: string
  name: string
  avatar: string | undefined
  email: string | undefined
  role: string[] | undefined
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string | null) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const tokenCookieState = Cookies.get(ACCESS_TOKEN)
  const initToken = tokenCookieState ? JSON.parse(tokenCookieState) : ''

  const userCookieState = Cookies.get(LOGIN_USER)
  const initUser = userCookieState ? JSON.parse(userCookieState) : null

  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          Cookies.set(LOGIN_USER, JSON.stringify(user))
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          Cookies.remove(LOGIN_USER)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})

export const useAuth = () => useAuthStore((state) => state.auth)
