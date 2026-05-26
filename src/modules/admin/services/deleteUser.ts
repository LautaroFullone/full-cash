import { fetchAPI } from '@/lib/fetchAPI'

export function deleteUser(id: string) {
   return fetchAPI<{ success: boolean }>(`/admin/users/${id}`, { method: 'DELETE' })
}
