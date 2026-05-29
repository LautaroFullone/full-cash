import { fetchAPI } from '@/lib/fetchAPI'

export const deleteMovimiento = (id: string) =>
   fetchAPI<{ success: boolean }>(`/movimientos/${id}`, { method: 'DELETE' })
