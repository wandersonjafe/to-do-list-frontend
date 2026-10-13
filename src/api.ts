import type { ApiErrorBody, AuthResponse, Task, TaskInput } from './types'

const API_URL = import.meta.env.VITE_API_URL as string
const TOKEN_KEY = 'todolist.token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  status: number
  fieldErrors: Record<string, string> | null

  constructor(status: number, message: string, fieldErrors: Record<string, string> | null = null) {
    super(message)
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

// Chamado quando o token expira ou fica inválido (para deslogar o usuário)
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get()
  const headers = new Headers(options.headers)

  if (options.body) headers.set('Content-Type', 'application/json')
  const isAuthRoute = path.startsWith('/auth/')
  if (token && !isAuthRoute) headers.set('Authorization', `Bearer ${token}`)

  let response: Response
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers })
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor')
  }

  if (response.status === 204) return undefined as T

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    // 401 com token enviado = sessão expirada. Login com senha errada não cai aqui (ainda não há token).
    if (response.status === 401 && token && !isAuthRoute) onUnauthorized?.()
    const body = data as ApiErrorBody | null
    throw new ApiError(response.status, body?.message ?? 'Erro inesperado', body?.fieldErrors ?? null)
  }

  return data as T
}

export const api = {
  register: (email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  listTasks: () => request<Task[]>('/tasks'),

  createTask: (input: TaskInput) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify(input) }),

  updateTask: (id: number, input: TaskInput) =>
    request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(input) }),

  completeTask: (id: number) => request<Task>(`/tasks/${id}/complete`, { method: 'PATCH' }),

  reopenTask: (id: number) => request<Task>(`/tasks/${id}/reopen`, { method: 'PATCH' }),

  deleteTask: (id: number) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),

  deleteAllTasks: () => request<void>('/tasks', { method: 'DELETE' }),
}