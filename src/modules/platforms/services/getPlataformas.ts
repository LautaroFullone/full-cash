import { fetchAPI } from '@/lib/fetchAPI'
import type { Plataforma } from '@/models/plataforma'

export function getPlataformas(): Promise<Plataforma[]> {
  return fetchAPI('/plataformas')
}
