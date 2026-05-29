import type { AdminUser } from './getUsers'
import { fetchAPI } from '@/lib/fetchAPI'

export interface PutUserBody {
   nombre?: string
   password?: string
}

export interface UpdateUserArgs {
   id: string
   data: PutUserBody
}

export const putUser = ({ id, data }: UpdateUserArgs) =>
   fetchAPI<AdminUser>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
   })
