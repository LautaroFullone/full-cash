import { useState, FormEvent } from 'react'
import { useAuth } from './hooks/useAuth'
import { Wallet, Loader2 } from 'lucide-react'

export function LoginPage() {
   const { login } = useAuth()
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)

   async function handleSubmit(e: FormEvent) {
      e.preventDefault()
      setError('')
      setLoading(true)
      try {
         await login(email, password)
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
      } finally {
         setLoading(false)
      }
   }

   return (
      <div className="min-h-dvh flex items-center justify-center px-4">
         <div className="w-full max-w-[380px]">
            <div className="flex flex-col items-center mb-8">
               <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4"
                  style={{
                     background:
                        'linear-gradient(135deg, var(--color-accent), var(--color-accent-dim))',
                  }}
               >
                  <Wallet size={26} color="#002a26" strokeWidth={2.5} />
               </div>
               <h1 className="font-heading text-2xl font-black tracking-tight text-white">
                  Full Cash
               </h1>
               <p className="text-text-muted text-sm mt-1">
                  Ingresá a tu panel de finanzas
               </p>
            </div>

            <div className="card p-6">
               <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                     <label className="text-[12px] font-semibold text-text-secondary uppercase tracking-[0.8px]">
                        Email
                     </label>
                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        autoComplete="email"
                        className="h-11 px-3.5 rounded-md bg-background border border-border text-white text-sm placeholder:text-text-muted outline-none focus:border-accent transition-colors"
                     />
                  </div>

                  <div className="flex flex-col gap-1.5">
                     <label className="text-[12px] font-semibold text-text-secondary uppercase tracking-[0.8px]">
                        Contraseña
                     </label>
                     <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        autoComplete="current-password"
                        className="h-11 px-3.5 rounded-md bg-background border border-border text-white text-sm placeholder:text-text-muted outline-none focus:border-accent transition-colors"
                     />
                  </div>

                  {error && <p className="text-danger text-sm text-center">{error}</p>}

                  <button
                     type="submit"
                     disabled={loading}
                     className="h-11 rounded-md bg-accent text-background-deep font-heading font-bold text-sm cursor-pointer hover:bg-accent-dim transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
                  >
                     {loading && <Loader2 size={15} className="animate-spin" />}
                     {loading ? 'Ingresando...' : 'Ingresar'}
                  </button>
               </form>
            </div>
         </div>
      </div>
   )
}
