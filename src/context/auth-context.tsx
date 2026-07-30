"use client"

import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from "react"

interface User {
  id: string
  email: string
  name: string
  role: string
  rewardPoints: number
}

interface AuthContextType {
  user: User | null
  login: (email: string) => Promise<boolean>
  logout: () => void
  isAuthModalOpen: boolean
  setAuthModalOpen: (open: boolean) => void
  requireAuth: (onSuccess: () => void) => void
  isLoaded: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthModalOpen, setAuthModalOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const pendingActionRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("kortsync_user")
    if (saved) {
      setUser(JSON.parse(saved))
    }
    setIsLoaded(true)
  }, [])

  const login = useCallback(async (email: string) => {
    try {
      const res = await fetch(`/api/auth/login?email=${encodeURIComponent(email)}`)
      const data = await res.json()
      if (data.user) {
        setUser(data.user)
        localStorage.setItem("kortsync_user", JSON.stringify(data.user))

        if (pendingActionRef.current) {
          pendingActionRef.current()
          pendingActionRef.current = null
        }
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("kortsync_user")
    pendingActionRef.current = null
  }, [])

  const requireAuth = useCallback((onSuccess: () => void) => {
    if (user) {
      onSuccess()
    } else {
      pendingActionRef.current = onSuccess
      setAuthModalOpen(true)
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthModalOpen, setAuthModalOpen, requireAuth, isLoaded }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
