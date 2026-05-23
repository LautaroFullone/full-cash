import { fetchAPI } from '@/lib/fetchAPI'
import type { AdminUser } from './getUsers'

export interface PutUserBody {
  nombre?: string
  password?: string
}

export function putUser(id: string, body: PutUserBody): Promise<AdminUser> {
  return fetchAPI(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(body) })
}
