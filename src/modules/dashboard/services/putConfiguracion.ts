import { fetchAPI } from '@/lib/fetchAPI'
import type { Configuracion } from './getConfiguracion'

export function putConfiguracion(porcentajeAhorro: number) {
   return fetchAPI<Configuracion>('/configuracion', {
      method: 'PUT',
      body: JSON.stringify({ porcentajeAhorro }),
   })
}
