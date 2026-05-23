import { fetchAPI } from '@/lib/fetchAPI'
import type { Configuracion } from './getConfiguracion'

export function putConfiguracion(porcentajeAhorro: number): Promise<Configuracion> {
   return fetchAPI('/configuracion', {
      method: 'PUT',
      body: JSON.stringify({ porcentajeAhorro }),
   })
}
