import { useState } from 'react'

interface Task {
  id: string
  title: string
  scheduledStartAt: string | null
  scheduledEndAt: string | null
  pomodoroStatus: string
  pomodoroCount: number
}

interface DayViewProps {
  tasks: Task[]
  note: string
  onSaveNote: (content: string) => void
  onNewTask: () => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export default function DayView({ tasks, note, onSaveNote, onNewTask }: DayViewProps) {
  const [editingNote, setEditingNote] = useState(false)
  const [noteDraft, setNoteDraft] = useState(note)

  const timedTasks = tasks.filter((t) => t.scheduledStartAt)
  const untimedTasks = tasks.filter((t) => !t.scheduledStartAt)

  const getTaskPosition = (task: Task) => {
    if (!task.scheduledStartAt) return null
    const start = new Date(task.scheduledStartAt)
    const end = task.scheduledEndAt ? new Date(task.scheduledEndAt) : new Date(start.getTime() + 30 * 60000)
    const topPct = ((start.getHours() * 60 + start.getMinutes()) / (24 * 60)) * 100
    const heightPct = ((end.getTime() - start.getTime()) / (24 * 60 * 60000)) * 100
    return { top: topPct, height: Math.max(heightPct, 1.5) }
  }

  return (
    <div className="flex gap-6">
      {/* Time axis */}
      <div className="relative w-16 shrink-0">
        {HOURS.map((h) => (
          <div key={h} className="h-10 border-t border-neutral-100 text-right pr-2 text-xs text-neutral-400">
            {h.toString().padStart(2, '0')}:00
          </div>
        ))}
        {/* Timed tasks positioned on timeline */}
        <div className="absolute inset-0">
          {timedTasks.map((task) => {
            const pos = getTaskPosition(task)
            if (!pos) return null
            return (
              <div
                key={task.id}
                className="absolute left-0 right-0 mx-1 rounded bg-orange-100 border border-orange-200 px-1.5 py-0.5 text-xs"
                style={{ top: `${pos.top}%`, height: `${pos.height}%`, minHeight: 24 }}
              >
                <span className="truncate block">{task.title}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Task list + note */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-neutral-700">Tasks</h3>
          <button onClick={onNewTask} className="rounded-lg bg-neutral-900 px-3 py-1 text-xs font-medium text-white hover:bg-neutral-800">
            + New
          </button>
        </div>

        {timedTasks.length === 0 && untimedTasks.length === 0 && (
          <p className="text-sm text-neutral-400">No tasks for this day</p>
        )}

        {timedTasks.map((task) => {
          const start = task.scheduledStartAt ? new Date(task.scheduledStartAt) : null
          const end = task.scheduledEndAt ? new Date(task.scheduledEndAt) : null
          const timeLabel = start
            ? `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}${end ? ` - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}` : ''}`
            : ''
          return (
            <div key={task.id} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm">
              <span className="text-xs text-neutral-400">{timeLabel}</span>
              <span>{task.title}</span>
            </div>
          )
        })}

        {untimedTasks.length > 0 && (
          <div>
            <p className="mb-1 text-xs text-neutral-400">Untimed</p>
            {untimedTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2 rounded-lg border border-dashed border-neutral-200 px-3 py-2 text-sm text-neutral-500">
                {task.title}
              </div>
            ))}
          </div>
        )}

        {/* Day note */}
        <div className="border-t border-neutral-200 pt-4">
          {editingNote ? (
            <div>
              <textarea
                value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Notes for this day..."
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                rows={3}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => { onSaveNote(noteDraft); setEditingNote(false) }}
                  className="rounded-lg bg-neutral-900 px-3 py-1 text-xs font-medium text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => { setNoteDraft(note); setEditingNote(false) }}
                  className="rounded-lg border px-3 py-1 text-xs text-neutral-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setEditingNote(true)}
              className="cursor-text rounded-lg border border-dashed border-neutral-200 px-3 py-2 text-sm text-neutral-400 hover:border-neutral-400"
            >
              {note || 'Add note...'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
