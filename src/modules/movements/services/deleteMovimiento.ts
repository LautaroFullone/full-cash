import { fetchAPI } from '@/lib/fetchAPI'

export function deleteMovimiento(id: string) {
   return fetchAPI<{ success: boolean }>(`/movimientos/${id}`, { method: 'DELETE' })
}
