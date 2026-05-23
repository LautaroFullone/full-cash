import { fetchAPI } from '@/lib/fetchAPI'

export interface Configuracion {
   id: string
   porcentajeAhorro: number
   userId: string
}

export function getConfiguracion(): Promise<Configuracion> {
   return fetchAPI('/configuracion')
}
