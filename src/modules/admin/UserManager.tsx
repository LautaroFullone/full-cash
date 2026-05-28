import { ConfirmModal, EntityManager, Skeleton, toast } from '@/components'
import type { AdminUser } from './services/getUsers'
import { deleteUser } from './services/deleteUser'
import { UserRow } from './components/UserRow'
import { getUsers } from './services/getUsers'
import { postUser } from './services/postUser'
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'

interface Props {
   onClose: () => void
}

export const UserManager: React.FC<Props> = ({ onClose }) => {
   const [users, setUsers] = useState<AdminUser[]>([])
   const [isLoading, setIsLoading] = useState(true)
   const [showForm, setShowForm] = useState(false)
   const [deletingId, setDeletingId] = useState<string | null>(null)
   const [confirmUserId, setConfirmUserId] = useState<string | null>(null)
   const [confirming, setConfirming] = useState(false)
   const [error, setError] = useState('')

   const [nombre, setNombre] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [creating, setCreating] = useState(false)
   const [formError, setFormError] = useState('')

   useEffect(() => {
      getUsers()
         .then(setUsers)
         .catch(() => setError('No se pudieron cargar los usuarios'))
         .finally(() => setIsLoading(false))
   }, [])

   const handleCreate = async () => {
      setFormError('')
      if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
         setFormError('Ya existe un usuario con ese email')
         return
      }
      setCreating(true)
      try {
         const user = await postUser({ nombre, email: email.trim(), password })
         setUsers((prev) => [...prev, user])
         handleCancelForm()
      } catch (err) {
         setFormError(err instanceof Error ? err.message : 'Error al crear usuario')
      } finally {
         setCreating(false)
      }
   }

   const handleDelete = (id: string) => {
      setConfirmUserId(id)
   }

   const handleConfirmDelete = async () => {
      if (!confirmUserId) return
      setConfirming(true)
      setDeletingId(confirmUserId)
      try {
         await deleteUser(confirmUserId)
         setUsers((prev) => prev.filter((u) => u.id !== confirmUserId))
         setConfirmUserId(null)
      } catch {
         toast.error('Error al eliminar el usuario')
      } finally {
         setDeletingId(null)
         setConfirming(false)
      }
   }

   const handleCancelForm = () => {
      setShowForm(false)
      setFormError('')
      setNombre('')
      setEmail('')
      setPassword('')
   }

   const confirmUser = users.find((u) => u.id === confirmUserId) ?? null

   return (
      <>
         <EntityManager
            title={showForm ? 'Nuevo usuario' : 'Usuarios'}
            description={
               showForm || isLoading ? undefined : `${users.length} usuarios registrados`
            }
            onClose={onClose}
            primaryBtn={
               showForm
                  ? {
                       label: 'Crear',
                       isLoading: creating,
                       disabled: !nombre || !email || !password,
                       onClick: handleCreate,
                    }
                  : {
                       icon: Plus,
                       label: 'Crear usuario',
                       onClick: () => setShowForm(true),
                    }
            }
            secondaryBtn={
               showForm ? { label: 'Cancelar', onClick: handleCancelForm } : undefined
            }
         >
            {showForm ? (
               <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                     <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                        Nombre
                     </label>

                     <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej. María García"
                        autoFocus
                        maxLength={100}
                     />
                  </div>

                  <div className="flex flex-col gap-1.5">
                     <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                        Email
                     </label>

                     <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="correo@ejemplo.com"
                        maxLength={254}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                     />
                  </div>

                  <div className="flex flex-col gap-1.5">
                     <label className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                        Contraseña
                     </label>

                     <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        maxLength={72}
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                     />
                  </div>

                  {formError && <p className="text-danger text-[13px]">{formError}</p>}
               </div>
            ) : (
               <>
                  {error && (
                     <p className="text-danger text-sm text-center mb-2">{error}</p>
                  )}

                  <div className="flex flex-col gap-2">
                     {isLoading
                        ? Array.from({ length: 4 }, (_, i) => <UserRowSkeleton key={i} />)
                        : users.map((user) => (
                             <UserRow
                                key={user.id}
                                user={user}
                                isDeleting={deletingId === user.id}
                                onDelete={handleDelete}
                             />
                          ))}
                  </div>
               </>
            )}
         </EntityManager>
         <ConfirmModal
            open={confirmUserId !== null}
            onCancel={() => setConfirmUserId(null)}
            onConfirm={handleConfirmDelete}
            title="¿Eliminar usuario?"
            description={
               confirmUser
                  ? `Se eliminará a ${confirmUser.nombre} junto con todos sus movimientos, categorías y plataformas. Esta acción no puede deshacerse.`
                  : undefined
            }
            confirmLabel="Eliminar"
            isLoading={confirming}
         />
      </>
   )
}

const UserRowSkeleton: React.FC = () => (
   <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-background border border-border">
      <Skeleton className="w-7 h-7 rounded-full shrink-0" />

      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
         <Skeleton className="h-3.5 w-28" />
         <Skeleton className="h-3 w-44" />
      </div>

      <Skeleton className="h-5 w-10 rounded-full" />
   </div>
)
