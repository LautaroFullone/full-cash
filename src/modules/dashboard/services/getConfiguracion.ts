import { fetchAPI } from '@/lib/fetchAPI'

export interface Configuracion {
   id: string
   porcentajeAhorro: number
   userId: string
}

export const getConfiguracion = () =>
   fetchAPI<Configuracion>('/configuracion')
