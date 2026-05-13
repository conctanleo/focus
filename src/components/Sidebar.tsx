import { NavLink, useNavigate } from 'react-router-dom'
import { Timer, CalendarDays, StickyNote, LogOut } from 'lucide-react'
import { useAuth } from '../store/auth'

const links = [
  { to: '/pomodoro', label: 'Pomodoro', Icon: Timer },
  { to: '/schedule', label: 'Schedule', Icon: CalendarDays },
  { to: '/memo', label: 'Memo', Icon: StickyNote },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside
      className="flex flex-col items-center border-r border-white/6 bg-slate-900 shrink-0"
      style={{ width: 'var(--sidebar-w)', paddingTop: 'var(--content-pad)', paddingBottom: 'var(--content-pad)' }}
    >
      <div
        className="flex items-center justify-center font-bold text-indigo-400"
        style={{
          width: 'clamp(28px, 2.5vw, 40px)',
          height: 'clamp(28px, 2.5vw, 40px)',
          fontSize: 'clamp(12px, 1vw, 18px)',
          marginBottom: 'clamp(14px, 2vw, 28px)',
          background: 'linear-gradient(135deg, #6366F1, #818CF8)',
          borderRadius: 'var(--radius)',
          color: '#fff',
        }}
      >
        F
      </div>
      <nav className="flex flex-1 flex-col items-center" style={{ gap: 'clamp(14px, 2vw, 28px)' }}>
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex items-center justify-center rounded-lg transition-colors ${
                isActive ? 'bg-indigo-500/15 text-indigo-400' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`
            }
            style={{ width: 'clamp(28px, 2.5vw, 40px)', height: 'clamp(28px, 2.5vw, 40px)' }}
          >
            <Icon style={{ width: 'clamp(14px, 1.3vw, 20px)', height: 'clamp(14px, 1.3vw, 20px)' }} />
          </NavLink>
        ))}
      </nav>
      <div className="flex flex-col items-center" style={{ gap: 'var(--item-gap)' }}>
        <span style={{ fontSize: 'var(--small-font)' }} className="text-slate-500">
          {user?.name?.[0]}
        </span>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="text-slate-600 hover:text-slate-400"
          title="Sign out"
        >
          <LogOut style={{ width: 'clamp(10px, 0.8vw, 14px)', height: 'clamp(10px, 0.8vw, 14px)' }} />
        </button>
      </div>
    </aside>
  )
}
