import { fetchAPI } from '@/lib/fetchAPI'
import type { AuthUser } from '@/stores/authStore'

export function getMe() {
   return fetchAPI<AuthUser>('/auth/me')
}
