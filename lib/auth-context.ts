"use client"

import { useState, useEffect, useCallback } from "react"
import { getCurrentUser, logoutUser } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const loadUser = useCallback(async () => {
    try {
      const user = await getCurrentUser()
      setUser(user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const logout = async () => {
    await logoutUser()
    window.location.href = "/login"
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    logout,
  }
}
