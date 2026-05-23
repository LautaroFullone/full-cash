import { fetchAPI } from '@/lib/fetchAPI'

export interface AdminUser {
  id: string
  email: string
  nombre: string
  role: 'ADMIN' | 'USER'
  createdAt: string
}

export function getUsers(): Promise<AdminUser[]> {
  return fetchAPI('/admin/users')
}
