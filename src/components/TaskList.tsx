import { useState } from 'react'
import { Plus } from 'lucide-react'

interface Task {
  id: string
  title: string
  pomodoroStatus: string
  pomodoroCount: number
  scheduledStartAt?: string | null
  scheduledEndAt?: string | null
}

interface TaskListProps {
  tasks: Task[]
  activeTaskId: string | null
  onStart: (taskId: string) => void
  onCreate: (title: string) => void
}

export default function TaskList({ tasks, activeTaskId, onStart, onCreate }: TaskListProps) {
  const [newTitle, setNewTitle] = useState('')

  const handleCreate = () => {
    if (!newTitle.trim()) return
    onCreate(newTitle.trim())
    setNewTitle('')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running': return { color: 'text-orange-400' }
      case 'paused': return { color: 'text-amber-400' }
      case 'done': return { color: 'text-green-400' }
      default: return { color: 'text-slate-600' }
    }
  }

  const untimedTasks = tasks.filter((t) => !t.scheduledStartAt)
  const timedTasks = tasks.filter((t) => t.scheduledStartAt)

  return (
    <div className="w-72">
      <div className="mb-4 flex gap-2">
        <input
          type="text" value={newTitle} placeholder="Add task..."
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          className="flex-1 rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-sm text-slate-50 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
        />
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-3 py-2 text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-1.5">
        {timedTasks.map((task) => {
          const start = task.scheduledStartAt ? new Date(task.scheduledStartAt) : null
          const end = task.scheduledEndAt ? new Date(task.scheduledEndAt) : null
          const timeLabel = start
            ? `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}${end ? ` - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}` : ''}`
            : ''
          return (
            <TaskItem
              key={task.id} task={task} activeTaskId={activeTaskId}
              timeLabel={timeLabel} onStart={onStart} badge={getStatusBadge(task.pomodoroStatus)}
            />
          )
        })}
        {untimedTasks.map((task) => (
          <TaskItem
            key={task.id} task={task} activeTaskId={activeTaskId}
            onStart={onStart} badge={getStatusBadge(task.pomodoroStatus)}
          />
        ))}
        {tasks.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">No tasks today</p>
        )}
      </div>
    </div>
  )
}

function TaskItem({ task, activeTaskId, timeLabel, onStart, badge }: {
  task: Task
  activeTaskId: string | null
  timeLabel?: string
  onStart: (id: string) => void
  badge: { color: string }
}) {
  const isActive = task.id === activeTaskId
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
        isActive
          ? 'border-indigo-500/30 bg-indigo-500/8'
          : 'border-white/6 hover:border-white/10'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className={`inline-block h-2 w-2 rounded-full shrink-0 ${badge.color.replace('text-', 'bg-')}`} />
        <span className="truncate text-slate-300">{task.title}</span>
        {timeLabel && <span className="text-xs text-slate-500 shrink-0 tabular-nums">{timeLabel}</span>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {task.pomodoroCount > 0 && (
          <span className="text-xs text-slate-500">{task.pomodoroCount}×</span>
        )}
        {task.pomodoroStatus === 'idle' && (
          <button
            onClick={() => onStart(task.id)}
            className="rounded px-2 py-0.5 text-xs font-medium text-indigo-400 transition-colors hover:bg-indigo-500/10"
          >
            Start
          </button>
        )}
      </div>
    </div>
  )
}
