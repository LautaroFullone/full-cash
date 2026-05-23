import { fetchAPI } from '@/lib/fetchAPI'
import type { AdminUser } from './getUsers'

export interface PostUserBody {
   email: string
   password: string
   nombre: string
}

export function postUser(body: PostUserBody): Promise<AdminUser> {
   return fetchAPI('/admin/users', { method: 'POST', body: JSON.stringify(body) })
}
