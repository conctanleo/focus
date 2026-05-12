import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import PomodoroPage from '../pages/PomodoroPage'
import SchedulePage from '../pages/SchedulePage'
import MemoPage from '../pages/MemoPage'
import PomodoroConfirmDialog from './PomodoroConfirmDialog'
import { useSocket } from '../hooks/useSocket'

export default function AppLayout() {
  const { reminder, clearReminder } = useSocket()

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-slate-900">
        <Routes>
          <Route path="/" element={<Navigate to="/pomodoro" replace />} />
          <Route path="/pomodoro" element={<PomodoroPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/memo" element={<MemoPage />} />
        </Routes>
      </main>
      {reminder && (
        <PomodoroConfirmDialog
          taskId={reminder.taskId}
          title={reminder.title}
          scheduledStartAt={reminder.scheduledStartAt}
          onClose={clearReminder}
        />
      )}
    </div>
  )
}
