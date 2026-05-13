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
    <div style={{ width: 'var(--task-panel-w)' }}>
      <div className="mb-4 flex gap-2">
        <input
          type="text" value={newTitle} placeholder="Add task..."
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          className="flex-1 border border-white/8 bg-white/5 text-slate-50 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--item-pad-y) var(--item-pad-x)', fontSize: 'var(--body-font)' }}
        />
        <button
          onClick={handleCreate}
          className="inline-flex items-center justify-center bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--item-pad-y) var(--item-pad-x)' }}
        >
          <Plus style={{ width: 'clamp(12px, 1vw, 16px)', height: 'clamp(12px, 1vw, 16px)' }} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--item-gap)' }}>
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
          <p className="py-8 text-center text-slate-500" style={{ fontSize: 'var(--body-font)' }}>No tasks today</p>
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
      className={`flex items-center justify-between border transition-colors ${
        isActive
          ? 'border-indigo-500/30 bg-indigo-500/8'
          : 'border-white/6 hover:border-white/10'
      }`}
      style={{ borderRadius: 'var(--radius)', padding: 'var(--item-pad-y) var(--item-pad-x)' }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`inline-block rounded-full shrink-0 ${badge.color.replace('text-', 'bg-')}`}
          style={{ width: 'clamp(5px, 0.4vw, 8px)', height: 'clamp(5px, 0.4vw, 8px)' }}
        />
        <span className="truncate text-slate-300" style={{ fontSize: 'var(--body-font)' }}>{task.title}</span>
        {timeLabel && <span className="text-xs text-slate-500 shrink-0 tabular-nums" style={{ fontSize: 'clamp(9px, 0.7vw, 11px)' }}>{timeLabel}</span>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {task.pomodoroCount > 0 && (
          <span className="text-slate-500" style={{ fontSize: 'clamp(10px, 0.7vw, 12px)' }}>{task.pomodoroCount}×</span>
        )}
        {task.pomodoroStatus === 'idle' && (
          <button
            onClick={() => onStart(task.id)}
            className="font-medium text-indigo-400 transition-colors hover:bg-indigo-500/10"
            style={{ borderRadius: 'var(--radius-sm)', padding: 'clamp(2px, 0.2vw, 4px) clamp(6px, 0.5vw, 10px)', fontSize: 'var(--small-font)' }}
          >
            Start
          </button>
        )}
      </div>
    </div>
  )
}
