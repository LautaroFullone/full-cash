import { fetchAPI } from '@/lib/fetchAPI'

export function deleteMovimiento(id: string): Promise<{ success: boolean }> {
  return fetchAPI(`/movimientos/${id}`, { method: 'DELETE' })
}
