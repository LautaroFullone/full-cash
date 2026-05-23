import { create } from 'zustand'

export interface AuthUser {
   id: string
   email: string
   nombre: string
   role: 'ADMIN' | 'USER'
}

interface AuthStore {
   user: AuthUser | null
   isLoading: boolean
   setUser: (user: AuthUser | null) => void
   setIsLoading: (v: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
   user: null,
   isLoading: true,
   setUser: (user) => set({ user }),
   setIsLoading: (isLoading) => set({ isLoading }),
}))
