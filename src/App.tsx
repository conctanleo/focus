import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './store/auth'
import { SocketProvider } from './hooks/useSocket'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Register from './pages/Register'

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-400">Loading...</div>
  }
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const fetchUser = useAuth((s) => s.fetchUser)

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/*"
        element={
          <AuthGuard>
            <SocketProvider>
              <AppLayout />
            </SocketProvider>
          </AuthGuard>
        }
      />
    </Routes>
  )
}
