const API_BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('token')
}

export async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Error de red' }))
    throw new Error(error.error || `HTTP ${response.status}`)
  }

  return response.json()
}
