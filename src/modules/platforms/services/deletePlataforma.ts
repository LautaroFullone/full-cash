import { fetchAPI } from '@/lib/fetchAPI'

export function deletePlataforma(id: string): Promise<{ success: boolean }> {
  return fetchAPI(`/plataformas/${id}`, { method: 'DELETE' })
}
