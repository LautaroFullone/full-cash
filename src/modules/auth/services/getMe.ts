import { fetchAPI } from '@/lib/fetchAPI'
import type { AuthUser } from '@/stores/authStore'

export const getMe = () =>
   fetchAPI<AuthUser>('/auth/me')
