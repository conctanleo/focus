import { useState } from 'react'

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
      case 'running': return { text: '●', color: 'text-orange-500' }
      case 'paused': return { text: '⏸', color: 'text-yellow-500' }
      case 'done': return { text: '✓', color: 'text-green-500' }
      default: return { text: '○', color: 'text-neutral-300' }
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
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
        />
        <button onClick={handleCreate} className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800">
          +
        </button>
      </div>

      <div className="space-y-1.5">
        {timedTasks.map((task) => {
          const start = task.scheduledStartAt ? new Date(task.scheduledStartAt) : null
          const end = task.scheduledEndAt ? new Date(task.scheduledEndAt) : null
          const timeLabel = start ? `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}${end ? ` - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}` : ''}` : ''
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
          <p className="py-8 text-center text-sm text-neutral-400">No tasks today</p>
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
  badge: { text: string; color: string }
}) {
  const isActive = task.id === activeTaskId
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
        isActive ? 'border-orange-300 bg-orange-50' : 'border-neutral-200'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className={badge.color}>{badge.text}</span>
        <span className="truncate">{task.title}</span>
        {timeLabel && <span className="text-xs text-neutral-400 shrink-0">{timeLabel}</span>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {task.pomodoroCount > 0 && <span className="text-xs text-neutral-400">🍅×{task.pomodoroCount}</span>}
        {task.pomodoroStatus === 'idle' && (
          <button
            onClick={() => onStart(task.id)}
            className="rounded px-2 py-0.5 text-xs font-medium text-neutral-600 hover:bg-neutral-100"
          >
            Start
          </button>
        )}
      </div>
    </div>
  )
}
