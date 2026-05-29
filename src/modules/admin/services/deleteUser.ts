import { fetchAPI } from '@/lib/fetchAPI'

export const deleteUser = (id: string) =>
   fetchAPI<{ success: boolean }>(`/admin/users/${id}`, { method: 'DELETE' })
