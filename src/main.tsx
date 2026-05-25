import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/Toaster'
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         retry: 1,
         staleTime: 30_000,
         refetchOnWindowFocus: false,
      },
   },
})

createRoot(document.getElementById('root')!).render(
   <StrictMode>
      <QueryClientProvider client={queryClient}>
         <App />
         <Toaster />
      </QueryClientProvider>
   </StrictMode>
)
