import { fetchAPI } from '@/lib/fetchAPI'
import type { Plataforma } from '@/models/plataforma'

export function postPlataforma(nombre: string): Promise<Plataforma> {
  return fetchAPI('/plataformas', { method: 'POST', body: JSON.stringify({ nombre }) })
}
