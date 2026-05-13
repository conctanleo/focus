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
    <div className="flex" style={{ gap: 'var(--section-gap)', height: '100%' }}>
      {/* Left: Timeline — flex-[3] */}
      <div className="flex-[3] border-r border-white/6 overflow-y-auto min-w-0" style={{ paddingRight: 'var(--section-gap)' }}>
        <div className="uppercase font-semibold text-slate-400" style={{ fontSize: 'var(--small-font)', marginBottom: 'var(--item-gap)' }}>Timeline</div>
        <div className="relative">
          {HOURS.map((h) => (
            <div
              key={h}
              className="flex items-start border-t border-white/5"
              style={{ height: 'clamp(36px, 3.5vw, 52px)', paddingTop: 3 }}
            >
              <span className="text-slate-500 font-mono font-medium" style={{ fontSize: 'clamp(9px, 0.65vw, 10px)' }}>
                {h.toString().padStart(2, '0')}:00
              </span>
            </div>
          ))}
          <div className="absolute inset-0">
            {timedTasks.map((task) => {
              const pos = getTaskPosition(task)
              if (!pos) return null
              return (
                <div
                  key={task.id}
                  className="absolute left-[40px] right-1 bg-orange-500/10 border border-orange-500/20 flex items-center gap-2"
                  style={{
                    top: `${pos.top}%`,
                    height: `${pos.height}%`,
                    minHeight: 24,
                    borderRadius: 'var(--radius-sm)',
                    padding: 'clamp(4px, 0.3vw, 8px) clamp(6px, 0.5vw, 10px)',
                    fontSize: 'clamp(10px, 0.8vw, 12px)',
                  }}
                >
                  <div className="bg-orange-500 rounded-sm shrink-0" style={{ width: 3, height: 'clamp(14px, 1.5vw, 22px)' }} />
                  <span className="truncate font-semibold text-orange-300">{task.title}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right: Tasks — flex-[4] */}
      <div className="flex-[4] flex flex-col overflow-y-auto min-w-0" style={{ paddingLeft: 'var(--section-gap)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--section-gap)' }}>
          <span className="uppercase font-semibold text-slate-400" style={{ fontSize: 'var(--small-font)' }}>Tasks</span>
          <button
            onClick={onNewTask}
            className="inline-flex items-center gap-1.5 bg-indigo-500 font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400"
            style={{ padding: 'var(--btn-pad-y) var(--btn-pad-x)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--small-font)' }}
          >
            <Plus style={{ width: 'clamp(9px, 0.7vw, 12px)', height: 'clamp(9px, 0.7vw, 12px)' }} />
            New
          </button>
        </div>

        {timedTasks.length === 0 && untimedTasks.length === 0 && (
          <p className="text-slate-500" style={{ fontSize: 'var(--body-font)' }}>No tasks for this day</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--item-gap)', flex: 1 }}>
          {timedTasks.length > 0 && (
            <div>
              <div className="uppercase font-semibold text-slate-500" style={{ fontSize: 'clamp(9px, 0.65vw, 10px)', marginBottom: 'clamp(3px, 0.3vw, 6px)' }}>Scheduled</div>
              {timedTasks.map((task) => {
                const start = task.scheduledStartAt ? new Date(task.scheduledStartAt) : null
                const end = task.scheduledEndAt ? new Date(task.scheduledEndAt) : null
                const timeLabel = start
                  ? `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}${end ? ` - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}` : ''}`
                  : ''
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-2 border border-white/6 text-slate-300"
                    style={{ padding: 'var(--item-pad-y) var(--item-pad-x)', borderRadius: 'var(--radius)', marginBottom: 'var(--item-gap)', fontSize: 'var(--body-font)' }}
                  >
                    <span className="text-slate-500 tabular-nums" style={{ fontSize: 'var(--small-font)' }}>{timeLabel}</span>
                    <span className="inline-block rounded-full shrink-0 bg-slate-500" style={{ width: 'clamp(5px, 0.4vw, 7px)', height: 'clamp(5px, 0.4vw, 7px)' }} />
                    <span>{task.title}</span>
                  </div>
                )
              })}
            </div>
          )}

          {untimedTasks.length > 0 && (
            <div>
              <div className="uppercase font-semibold text-slate-500" style={{ fontSize: 'clamp(9px, 0.65vw, 10px)', marginBottom: 'clamp(3px, 0.3vw, 6px)' }}>Untimed</div>
              {untimedTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-2 border border-dashed border-white/8 text-slate-400"
                  style={{ padding: 'var(--item-pad-y) var(--item-pad-x)', borderRadius: 'var(--radius)', marginBottom: 'var(--item-gap)', fontSize: 'var(--body-font)' }}
                >
                  <span className="inline-block rounded-full shrink-0 bg-slate-600" style={{ width: 'clamp(5px, 0.4vw, 7px)', height: 'clamp(5px, 0.4vw, 7px)' }} />
                  {task.title}
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-white/6" style={{ paddingTop: 'var(--section-gap)', marginTop: 'auto' }}>
            {editingNote ? (
              <div>
                <textarea
                  value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)}
                  placeholder="Notes for this day..."
                  className="w-full border border-white/8 bg-white/5 text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
                  style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--item-pad-y) var(--item-pad-x)', fontSize: 'var(--body-font)' }}
                  rows={3}
                />
                <div className="flex gap-2" style={{ marginTop: 'var(--item-gap)' }}>
                  <button
                    onClick={() => { onSaveNote(noteDraft); setEditingNote(false) }}
                    className="bg-indigo-500 font-medium text-white transition-colors hover:bg-indigo-400"
                    style={{ padding: 'var(--btn-pad-y) var(--btn-pad-x)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--small-font)' }}
                  >Save</button>
                  <button
                    onClick={() => { setNoteDraft(note); setEditingNote(false) }}
                    className="border border-white/8 text-slate-400 transition-colors hover:bg-white/5"
                    style={{ padding: 'var(--btn-pad-y) var(--btn-pad-x)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--small-font)' }}
                  >Cancel</button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setEditingNote(true)}
                className="cursor-text border border-dashed border-white/8 text-slate-500 transition-colors hover:border-white/15"
                style={{ padding: 'var(--item-pad-y) var(--item-pad-x)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--body-font)' }}
              >{note || 'Add note...'}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
