import { fetchAPI } from '@/lib/fetchAPI'
import type { AdminUser } from './getUsers'

export interface PostUserBody {
   email: string
   password: string
   nombre: string
}

export const postUser = (body: PostUserBody) =>
   fetchAPI<AdminUser>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(body),
   })
