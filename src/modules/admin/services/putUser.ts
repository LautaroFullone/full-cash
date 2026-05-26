import type { AdminUser } from './getUsers'
import { fetchAPI } from '@/lib/fetchAPI'

export interface PutUserBody {
   nombre?: string
   password?: string
}

export function putUser(id: string, body: PutUserBody) {
   return fetchAPI<AdminUser>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
   })
}
