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

export const postLogin = (body: LoginBody) =>
   fetchAPI<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
   })
