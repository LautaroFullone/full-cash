import { fetchAPI } from '@/lib/fetchAPI'
import type { AuthUser } from '@/stores/authStore'

export function getMe(): Promise<AuthUser> {
  return fetchAPI('/auth/me')
}
