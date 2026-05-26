import { fetchAPI } from '@/lib/fetchAPI'
import type { AdminUser } from './getUsers'

export interface PostUserBody {
   email: string
   password: string
   nombre: string
}

export function postUser(body: PostUserBody) {
   return fetchAPI<AdminUser>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(body),
   })
}
