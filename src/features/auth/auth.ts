import { useAuthStore } from '@/stores/authStore'

export const handleLogout = () => {
  useAuthStore.getState().auth.reset()
  window.location.href = '/sign-in'
}
