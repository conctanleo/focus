import { useState } from 'react'
import { Plus } from 'lucide-react'

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
      <div className="relative w-16 shrink-0">
        {HOURS.map((h) => (
          <div key={h} className="h-10 border-t border-white/5 pr-2 text-right text-xs text-slate-500">
            {h.toString().padStart(2, '0')}:00
          </div>
        ))}
        <div className="absolute inset-0">
          {timedTasks.map((task) => {
            const pos = getTaskPosition(task)
            if (!pos) return null
            return (
              <div
                key={task.id}
                className="absolute left-0 right-0 mx-1 rounded bg-orange-500/15 border border-orange-500/20 px-1.5 py-0.5 text-xs text-orange-300"
                style={{ top: `${pos.top}%`, height: `${pos.height}%`, minHeight: 24 }}
              >
                <span className="truncate block">{task.title}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-300">Tasks</h3>
          <button
            onClick={onNewTask}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400"
          >
            <Plus size={12} />
            New
          </button>
        </div>

        {timedTasks.length === 0 && untimedTasks.length === 0 && (
          <p className="text-sm text-slate-500">No tasks for this day</p>
        )}

        {timedTasks.map((task) => {
          const start = task.scheduledStartAt ? new Date(task.scheduledStartAt) : null
          const end = task.scheduledEndAt ? new Date(task.scheduledEndAt) : null
          const timeLabel = start
            ? `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}${end ? ` - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}` : ''}`
            : ''
          return (
            <div key={task.id} className="flex items-center gap-2 rounded-lg border border-white/6 px-3 py-2 text-sm text-slate-300">
              <span className="text-xs text-slate-500 tabular-nums">{timeLabel}</span>
              <span>{task.title}</span>
            </div>
          )
        })}

        {untimedTasks.length > 0 && (
          <div>
            <p className="mb-1 text-xs text-slate-500">Untimed</p>
            {untimedTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2 rounded-lg border border-dashed border-white/8 px-3 py-2 text-sm text-slate-400">
                {task.title}
              </div>
            ))}
          </div>
        )}

        <div className="border-t border-white/6 pt-4">
          {editingNote ? (
            <div>
              <textarea
                value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Notes for this day..."
                className="w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
                rows={3}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => { onSaveNote(noteDraft); setEditingNote(false) }}
                  className="rounded-lg bg-indigo-500 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-indigo-400"
                >
                  Save
                </button>
                <button
                  onClick={() => { setNoteDraft(note); setEditingNote(false) }}
                  className="rounded-lg border border-white/8 px-3 py-1 text-xs text-slate-400 transition-colors hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setEditingNote(true)}
              className="cursor-text rounded-lg border border-dashed border-white/8 px-3 py-2 text-sm text-slate-500 transition-colors hover:border-white/15"
            >
              {note || 'Add note...'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
