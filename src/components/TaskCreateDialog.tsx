import { useState } from 'react'

interface Props {
  defaultDate: string
  onSave: (data: { title: string; taskDate: string; scheduledStartAt: string; scheduledEndAt: string }) => void
  onClose: () => void
}

export default function TaskCreateDialog({ defaultDate, onSave, onClose }: Props) {
  const [title, setTitle] = useState('')
  const [taskDate, setTaskDate] = useState(defaultDate)
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onSave({
      title: title.trim(),
      taskDate,
      scheduledStartAt: `${taskDate}T${startTime}:00`,
      scheduledEndAt: `${taskDate}T${endTime}:00`,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl border border-white/8 bg-slate-800 p-6 shadow-2xl"
      >
        <h3 className="mb-4 text-lg font-semibold text-slate-100">New Schedule Task</h3>
        <input
          type="text" value={title} placeholder="Task title"
          onChange={(e) => setTitle(e.target.value)}
          className="mb-3 w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
          autoFocus
        />
        <div className="mb-3 flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-slate-400">Date</label>
            <input
              type="date" value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className="w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-sm text-slate-200 outline-none [color-scheme:dark]"
            />
          </div>
        </div>
        <div className="mb-4 flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-slate-400">Start</label>
            <input
              type="time" value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-sm text-slate-200 outline-none [color-scheme:dark]"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-slate-400">End</label>
            <input
              type="time" value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-white/8 bg-white/5 px-3 py-2 text-sm text-slate-200 outline-none [color-scheme:dark]"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 rounded-lg bg-indigo-500 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400">
            Create
          </button>
          <button type="button" onClick={onClose} className="rounded-lg border border-white/8 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
