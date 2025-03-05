import { useAuthStore } from '@/stores/authStore'

export const handleLogout = () => {
  const { auth } = useAuthStore.getState()
  auth.setAccessToken(null)
  auth.setUser(null)
  window.location.href = '/sign-in'
}
