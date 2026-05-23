const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error de red' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetchAPI<{ token: string; user: { id: string; email: string; nombre: string; role: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) }
    ),

  getMe: () =>
    fetchAPI<{ id: string; email: string; nombre: string; role: string }>('/auth/me'),

  // Admin - Users
  getUsers: () =>
    fetchAPI<{ id: string; email: string; nombre: string; role: string; createdAt: string }[]>('/admin/users'),

  createUser: (data: { email: string; password: string; nombre: string }) =>
    fetchAPI('/admin/users', { method: 'POST', body: JSON.stringify(data) }),

  updateUser: (id: string, data: { nombre?: string; password?: string }) =>
    fetchAPI(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteUser: (id: string) =>
    fetchAPI(`/admin/users/${id}`, { method: 'DELETE' }),

  // Movimientos
  getMovimientos: (mes: number, anio: number) =>
    fetchAPI(`/movimientos?mes=${mes}&anio=${anio}`),

  getResumen: (mes: number, anio: number) =>
    fetchAPI(`/movimientos/resumen?mes=${mes}&anio=${anio}`),

  createMovimiento: (data: Record<string, unknown>) =>
    fetchAPI('/movimientos', { method: 'POST', body: JSON.stringify(data) }),

  updateMovimiento: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/movimientos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteMovimiento: (id: string) =>
    fetchAPI(`/movimientos/${id}`, { method: 'DELETE' }),

  // Categorías
  getCategorias: () => fetchAPI('/categorias'),

  createCategoria: (data: Record<string, unknown>) =>
    fetchAPI('/categorias', { method: 'POST', body: JSON.stringify(data) }),

  updateCategoria: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/categorias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteCategoria: (id: string) =>
    fetchAPI(`/categorias/${id}`, { method: 'DELETE' }),

  // Plataformas
  getPlataformas: () => fetchAPI('/plataformas'),

  createPlataforma: (data: { nombre: string }) =>
    fetchAPI('/plataformas', { method: 'POST', body: JSON.stringify(data) }),

  deletePlataforma: (id: string) =>
    fetchAPI(`/plataformas/${id}`, { method: 'DELETE' }),

  // Configuración
  getConfiguracion: () => fetchAPI('/configuracion'),

  updateConfiguracion: (data: { porcentajeAhorro: number }) =>
    fetchAPI('/configuracion', { method: 'PUT', body: JSON.stringify(data) }),
};
