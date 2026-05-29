import { fetchAPI } from '@/lib/fetchAPI'

export const deletePlataforma = (id: string): Promise<{ success: boolean }> =>
   fetchAPI(`/plataformas/${id}`, { method: 'DELETE' })
