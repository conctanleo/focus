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
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl bg-white p-8 shadow-sm border border-neutral-200">
        <h1 className="mb-6 text-center text-2xl font-semibold">Create account</h1>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <input
          type="text" placeholder="Name" value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900"
        />
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900"
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900"
        />
        <button type="submit" className="w-full rounded-lg bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800">
          Register
        </button>
        <p className="mt-4 text-center text-sm text-neutral-500">
          Have an account? <Link to="/login" className="text-neutral-900 underline">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
