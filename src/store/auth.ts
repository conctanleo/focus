import { create } from 'zustand'
import api from '../lib/api'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, name: string, password: string) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    set({ user: data.user })
  },
  register: async (email, name, password) => {
    const { data } = await api.post('/auth/register', { email, name, password })
    localStorage.setItem('token', data.token)
    set({ user: data.user })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null })
  },
  fetchUser: async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        set({ loading: false })
        return
      }
      const { data } = await api.get('/auth/me')
      set({ user: data.user, loading: false })
    } catch {
      localStorage.removeItem('token')
      set({ user: null, loading: false })
    }
  },
}))
