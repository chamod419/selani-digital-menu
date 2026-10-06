import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token =
        localStorage.getItem('selani_admin_token')

      if (!token) {
        setAuthLoading(false)
        return
      }

      try {
        const response = await api.get('/auth/me')

        setAdmin(response.data.admin)
      } catch {
        localStorage.removeItem('selani_admin_token')
        setAdmin(null)
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    })

    localStorage.setItem(
      'selani_admin_token',
      response.data.token
    )

    setAdmin(response.data.admin)

    return response.data
  }

  const logout = () => {
    localStorage.removeItem('selani_admin_token')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}