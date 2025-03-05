import { useAuthStore } from '@/stores/authStore'

export const handleLogout = () => {
  const { reset } = useAuthStore.getState().auth
  reset()
  window.location.href = '/sign-in'
}
