import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ApiError } from '../api'
import { useAuth } from '../useAuth'

interface AuthPageProps {
  mode: 'login' | 'register'
}

export default function AuthPage({ mode }: AuthPageProps) {
  const { isAuthenticated, login, register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const isLogin = mode === 'login'

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setFieldErrors({})
    setLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(email, password)
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
        setFieldErrors(err.fieldErrors ?? {})
      } else {
        setError('Erro inesperado')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center font-mono text-xl font-semibold tracking-tight">
          <span className="text-emerald-400">~/</span>to-do list
          <span className="animate-pulse text-emerald-400">_</span>
        </div>

        <div className="card p-6">
          <h1 className="text-lg font-semibold">{isLogin ? 'Entrar' : 'Criar conta'}</h1>
          <p className="mt-1 text-sm text-zinc-400">
            {isLogin ? 'Acesse as suas tarefas.' : 'Cadastre-se para organizar as suas tarefas.'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="label">
              E-mail
              <input
                className="input"
                type="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </label>

            <label className="label">
              Senha
              <input
                className="input"
                type="password"
                placeholder={isLogin ? '••••••••' : 'Mínimo de 8 caracteres'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                minLength={isLogin ? undefined : 8}
                required
              />
              {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
            </label>

            {error && <p className="alert-error">{error}</p>}

            <button type="submit" className="btn-primary mt-2" disabled={loading}>
              {loading ? 'Aguarde...' : isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-400">
          {isLogin ? (
            <>
              Não tem conta?{' '}
              <Link to="/register" className="font-medium text-emerald-400 hover:underline">
                Cadastre-se
              </Link>
            </>
          ) : (
            <>
              Já tem conta?{' '}
              <Link to="/login" className="font-medium text-emerald-400 hover:underline">
                Entrar
              </Link>
            </>
          )}
        </p>
      </div>
    </main>
  )
}