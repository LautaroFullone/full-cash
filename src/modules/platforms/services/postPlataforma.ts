import { fetchAPI } from '@/lib/fetchAPI'
import type { Plataforma } from '@/models/plataforma'

export const postPlataforma = (nombre: string): Promise<Plataforma> =>
   fetchAPI('/plataformas', { method: 'POST', body: JSON.stringify({ nombre }) })
