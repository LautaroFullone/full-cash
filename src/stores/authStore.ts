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
   actions: {
      setUser: (user: AuthUser | null) => void
      setIsLoading: (v: boolean) => void
      resetStore: () => void
   }
}

export const useAuthStore = create<AuthStore>((set) => ({
   user: null,
   isLoading: true,
   actions: {
      setUser: (user) => set({ user }),
      setIsLoading: (isLoading) => set({ isLoading }),
      resetStore: () => set({ user: null }),
   },
}))
