import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, setUnauthorizedHandler, tokenStorage } from "./api";
import { AuthContext } from "./AuthContext";
import type { AuthResponse } from './types';

const EMAIL_KEY = 'todolist.email';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenStorage.get())
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem(EMAIL_KEY))

    const startSession = useCallback((auth: AuthResponse) => {
    tokenStorage.set(auth.token)
    localStorage.setItem(EMAIL_KEY, auth.email)
    setToken(auth.token)
    setEmail(auth.email)
  }, [])

  const logout = useCallback(() => {
    tokenStorage.clear()
    localStorage.removeItem(EMAIL_KEY)
    setToken(null)
    setEmail(null)
  }, [])

  const login = useCallback(
    async (emailInput: string, password: string) => {
      startSession(await api.login(emailInput, password))
    },
    [startSession],
  )

  const register = useCallback(
    async (emailInput: string, password: string) => {
      startSession(await api.register(emailInput, password))
    },
    [startSession],
  )

  // Se a API responder 401 (token expirado), a sessão é encerrada
  useEffect(() => {
    setUnauthorizedHandler(logout)
    return () => setUnauthorizedHandler(null)
  }, [logout])

  const value = useMemo(
    () => ({ email, isAuthenticated: token !== null, login, register, logout }),
    [email, token, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}