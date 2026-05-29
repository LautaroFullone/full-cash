import { fetchAPI } from '@/lib/fetchAPI'
import type { Plataforma } from '@/models/plataforma'

export const getPlataformas = (): Promise<Plataforma[]> =>
   fetchAPI('/plataformas')
