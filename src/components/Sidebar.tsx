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
    <aside className="flex w-14 flex-col items-center border-r border-white/6 bg-slate-900 py-4">
      <div className="mb-8 text-lg font-bold text-indigo-400">F</div>
      <nav className="flex flex-1 flex-col gap-3">
        {links.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              `flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
                isActive ? 'bg-indigo-500/15 text-indigo-400' : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`
            }
          >
            <Icon size={18} />
          </NavLink>
        ))}
      </nav>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-slate-500">{user?.name?.[0]}</span>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="text-slate-600 hover:text-slate-400"
          title="Sign out"
        >
          <LogOut size={14} />
        </button>
      </div>
    </aside>
  )
}
