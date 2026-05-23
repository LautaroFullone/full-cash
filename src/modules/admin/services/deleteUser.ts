import { fetchAPI } from '@/lib/fetchAPI'

export function deleteUser(id: string): Promise<{ success: boolean }> {
   return fetchAPI(`/admin/users/${id}`, { method: 'DELETE' })
}
