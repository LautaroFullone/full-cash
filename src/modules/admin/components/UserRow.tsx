import type { AdminUser } from '../services/getUsers'
import { UserCircle2, Trash2 } from 'lucide-react'
import { cn } from '@/utils/cn'

interface UserRowProps {
   user: AdminUser
   isDeleting: boolean
   onDelete: (id: string) => void
}

export const UserRow: React.FC<UserRowProps> = ({ user, isDeleting, onDelete }) => (
   <div
      className={cn(
         'flex items-center gap-3 px-4 py-3 rounded-lg bg-background border border-border transition-opacity',
         isDeleting && 'opacity-40'
      )}
   >
      <UserCircle2 size={28} className="text-text-muted shrink-0" />
      <div className="flex-1 min-w-0">
         <p className="text-sm font-semibold text-white truncate">{user.nombre}</p>
         <p className="text-xs text-text-muted truncate">{user.email}</p>
      </div>
      <span
         className={cn(
            'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
            user.role === 'ADMIN'
               ? 'bg-accent/15 text-accent'
               : 'bg-white/8 text-text-secondary'
         )}
      >
         {user.role}
      </span>
      {user.role !== 'ADMIN' && (
         <button
            onClick={() => onDelete(user.id)}
            disabled={isDeleting}
            className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors border-none bg-transparent cursor-pointer"
         >
            <Trash2 size={14} />
         </button>
      )}
   </div>
)
