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
      <form onSubmit={handleSubmit} className="border border-white/8 bg-white/5" style={{ width: 'var(--auth-card-w)', borderRadius: 'var(--radius)', padding: 'var(--content-pad)' }}>
        <div className="text-center" style={{ marginBottom: 'var(--section-gap)' }}>
          <div className="inline-flex items-center justify-center font-bold text-white" style={{
            width: 'clamp(36px, 3vw, 48px)', height: 'clamp(36px, 3vw, 48px)',
            background: 'linear-gradient(135deg, #6366F1, #818CF8)', borderRadius: 'var(--radius)', fontSize: 'clamp(15px, 1.2vw, 20px)', marginBottom: 'var(--item-gap)'
          }}>F</div>
          <h1 className="font-semibold text-slate-100" style={{ fontSize: 'clamp(16px, 1.4vw, 22px)' }}>Create account</h1>
        </div>
        {error && <p className="mb-4 bg-red-500/10 border border-red-500/20 text-red-400" style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--item-pad-y) var(--item-pad-x)', fontSize: 'var(--small-font)' }}>{error}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--item-gap)' }}>
          <input
            type="text" placeholder="Name" value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-white/8 bg-white/5 text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
            style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--item-pad-y) var(--item-pad-x)', fontSize: 'var(--body-font)' }}
          />
          <input
            type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-white/8 bg-white/5 text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
            style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--item-pad-y) var(--item-pad-x)', fontSize: 'var(--body-font)' }}
          />
          <input
            type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-white/8 bg-white/5 text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
            style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--item-pad-y) var(--item-pad-x)', fontSize: 'var(--body-font)' }}
          />
        </div>
        <button type="submit" className="w-full bg-indigo-500 font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400"
          style={{ padding: 'var(--btn-pad-y) var(--btn-pad-x)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--body-font)', marginTop: 'var(--section-gap)' }}>
          Register
        </button>
        <p className="text-center text-slate-400" style={{ fontSize: 'var(--small-font)', marginTop: 'var(--section-gap)' }}>
          Have an account? <Link to="/login" className="text-indigo-400 underline">Sign in</Link>
        </p>
      </form>
    </div>
  )
}
