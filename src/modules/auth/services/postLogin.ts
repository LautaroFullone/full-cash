import { fetchAPI } from '@/lib/fetchAPI'
import type { AuthUser } from '@/stores/authStore'

export interface LoginBody {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: AuthUser
}

export function postLogin(body: LoginBody): Promise<LoginResponse> {
  return fetchAPI('/auth/login', { method: 'POST', body: JSON.stringify(body) })
}
