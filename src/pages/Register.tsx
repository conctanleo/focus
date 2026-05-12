import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Register() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const register = useAuth((s) => s.register)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await register(email, name, password)
      navigate('/pomodoro')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-white/8 bg-white/5 p-8">
        <h1 className="mb-6 text-center text-2xl font-semibold text-slate-100">Create account</h1>
        {error && <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</p>}
        <input
          type="text" placeholder="Name" value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 w-full rounded-lg border border-white/8 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
        />
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded-lg border border-white/8 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border border-white/8 bg-white/5 px-4 py-2.5 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
        />
        <button type="submit" className="w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400">
          Register
        </button>
        <p className="mt-4 text-center text-sm text-slate-400">
          Have an account? <Link to="/login" className="text-indigo-400 underline">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
