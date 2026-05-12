import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

const links = [
  { to: '/pomodoro', label: 'Pomodoro', icon: '🍅' },
  { to: '/schedule', label: 'Schedule', icon: '📅' },
  { to: '/memo', label: 'Memo', icon: '📝' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <aside className="flex w-14 flex-col items-center border-r border-neutral-200 bg-white py-4">
      <div className="mb-8 text-lg font-bold">F</div>
      <nav className="flex flex-1 flex-col gap-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            title={link.label}
            className={({ isActive }) =>
              `flex h-9 w-9 items-center justify-center rounded-lg text-lg transition-colors ${
                isActive ? 'bg-neutral-100' : 'hover:bg-neutral-50'
              }`
            }
          >
            {link.icon}
          </NavLink>
        ))}
      </nav>
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-neutral-400">{user?.name?.[0]}</span>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className="text-xs text-neutral-300 hover:text-neutral-500"
          title="Sign out"
        >
          ↵
        </button>
      </div>
    </aside>
  )
}
