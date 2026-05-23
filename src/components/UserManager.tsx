import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { X, Plus, Trash2, Loader2, UserCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  email: string;
  nombre: string;
  role: string;
  createdAt: string;
}

interface Props {
  onClose: () => void;
}

export function UserManager({ onClose }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    api.getUsers()
      .then(setUsers)
      .catch(() => setError('No se pudieron cargar los usuarios'))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate() {
    setFormError('');
    setCreating(true);
    try {
      const user = await api.createUser({ nombre, email, password }) as User;
      setUsers(prev => [...prev, user]);
      setNombre(''); setEmail(''); setPassword('');
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error al crear usuario');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await api.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch {
      // silently ignore
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="modal-overlay fixed inset-0 bg-black/70 backdrop-blur-lg z-[60] flex justify-center">
      <div className="modal-sheet animate-slide-up bg-surface flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-heading text-base font-bold text-white">Gestión de usuarios</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-text-muted hover:text-white hover:bg-white/[8%] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {error && <p className="text-danger text-sm text-center">{error}</p>}

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 size={24} className="text-accent animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {users.map(user => (
                <div
                  key={user.id}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg bg-background border border-border transition-opacity',
                    deletingId === user.id && 'opacity-40'
                  )}
                >
                  <UserCircle2 size={28} className="text-text-muted shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.nombre}</p>
                    <p className="text-xs text-text-muted truncate">{user.email}</p>
                  </div>
                  <span className={cn(
                    'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full',
                    user.role === 'ADMIN' ? 'bg-accent/15 text-accent' : 'bg-white/[8%] text-text-secondary'
                  )}>
                    {user.role}
                  </span>
                  {user.role !== 'ADMIN' && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={deletingId === user.id}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Create form */}
          {showForm && (
            <div className="card p-4 flex flex-col gap-3 mt-2">
              <p className="text-sm font-semibold text-white">Nuevo usuario</p>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Nombre"
                className="h-10 px-3 rounded-md bg-background border border-border text-white text-sm placeholder:text-text-muted outline-none focus:border-accent transition-colors"
              />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                className="h-10 px-3 rounded-md bg-background border border-border text-white text-sm placeholder:text-text-muted outline-none focus:border-accent transition-colors"
              />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="h-10 px-3 rounded-md bg-background border border-border text-white text-sm placeholder:text-text-muted outline-none focus:border-accent transition-colors"
              />
              {formError && <p className="text-danger text-xs">{formError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowForm(false); setFormError(''); }}
                  className="flex-1 h-9 rounded-md border border-border text-text-secondary text-sm cursor-pointer hover:border-border-strong hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreate}
                  disabled={creating || !nombre || !email || !password}
                  className="flex-1 h-9 rounded-md bg-accent text-background-deep font-heading font-bold text-sm cursor-pointer hover:bg-accent-dim transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  {creating && <Loader2 size={13} className="animate-spin" />}
                  Crear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!showForm && (
          <div className="px-5 py-4 border-t border-border">
            <button
              onClick={() => setShowForm(true)}
              className="w-full h-10 rounded-md bg-accent text-background-deep font-heading font-bold text-sm cursor-pointer hover:bg-accent-dim transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={15} strokeWidth={2.5} />
              Crear usuario
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
