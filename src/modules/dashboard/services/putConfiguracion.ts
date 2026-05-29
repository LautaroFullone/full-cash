import { fetchAPI } from '@/lib/fetchAPI'
import type { Configuracion } from './getConfiguracion'

export const putConfiguracion = (porcentajeAhorro: number) =>
   fetchAPI<Configuracion>('/configuracion', {
      method: 'PUT',
      body: JSON.stringify({ porcentajeAhorro }),
   })
