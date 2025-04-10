import { useAuthStore } from '@/stores/authStore'
import { http } from '@/lib/axios'
import { createRequestConfig } from '@/lib/types'
import { LoginRequest, LoginResponse, loginResponseSchema } from '../types'

export const handleLogout = () => {
  useAuthStore.getState().auth.reset()
  window.location.href = '/sign-in'
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await http.post('/auth/login', data, createRequestConfig({ skipAuth: true, loadingDelay: 500 }))
  if (!response) {
    throw new Error('empty response')
  }

  return loginResponseSchema.parse(response)
}
