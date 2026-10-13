export type TaskStatus = 'PENDING' | 'COMPLETED'

export interface Task {
  id: number
  title: string
  description: string | null
  status: TaskStatus
  createdAt: string
}

export interface TaskInput {
  title: string
  description: string
}

export interface AuthResponse {
  token: string
  email: string
}

export interface ApiErrorBody {
  status: number
  message: string
  fieldErrors?: Record<string, string> | null
}