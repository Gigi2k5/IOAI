import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        const response = await api.get('/auth/me')
        if (response.data.success) {
          const userData = response.data.data
          // Enrichir avec name pour compatibilité
          userData.name = userData.candidate 
            ? `${userData.candidate.first_name} ${userData.candidate.last_name}`
            : userData.email
          localStorage.setItem('user', JSON.stringify(userData))
          setUser(userData)
        }
      } catch (error) {
        // Token invalide ou expiré
        localStorage.removeItem('user')
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Email ou mot de passe incorrect')
    }
    
    const { access_token, refresh_token, user: userData } = response.data
    
    // Enrichir avec name pour compatibilité
    userData.name = userData.candidate 
      ? `${userData.candidate.first_name} ${userData.candidate.last_name}`
      : userData.email
    
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    
    return userData
  }

  const register = async (data) => {
    const response = await api.post('/auth/register', {
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName
    })
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Erreur lors de l\'inscription')
    }
    
    // L'API connecte automatiquement après inscription
    const { access_token, refresh_token, user: userData } = response.data.data
    
    // Enrichir avec name pour compatibilité
    userData.name = userData.candidate 
      ? `${userData.candidate.first_name} ${userData.candidate.last_name}`
      : userData.email
    
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
    
    return { user_id: userData.id, message: 'Inscription réussie' }
  }

  const logout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isCandidate: user?.role === 'candidate',
    isVerified: user?.is_verified ?? true,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
