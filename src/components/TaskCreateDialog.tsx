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
        className="w-full max-w-sm border border-white/8 bg-slate-800 shadow-2xl"
        style={{ borderRadius: 'var(--radius)', padding: 'var(--section-gap)' }}
      >
        <h3 className="font-semibold text-slate-100" style={{ fontSize: 'var(--heading-font)', marginBottom: 'var(--section-gap)' }}>New Schedule Task</h3>
        <input
          type="text" value={title} placeholder="Task title"
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-white/8 bg-white/5 text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500/50"
          style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--item-pad-y) var(--item-pad-x)', fontSize: 'var(--body-font)', marginBottom: 'var(--item-gap)' }}
          autoFocus
        />
        <div className="flex" style={{ gap: 'var(--item-gap)', marginBottom: 'var(--item-gap)' }}>
          <div className="flex-1">
            <label className="mb-1 block text-slate-400" style={{ fontSize: 'var(--small-font)' }}>Date</label>
            <input
              type="date" value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className="w-full border border-white/8 bg-white/5 text-slate-200 outline-none [color-scheme:dark]"
              style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--item-pad-y) var(--item-pad-x)', fontSize: 'var(--body-font)' }}
            />
          </div>
        </div>
        <div className="flex" style={{ gap: 'var(--item-gap)', marginBottom: 'var(--section-gap)' }}>
          <div className="flex-1">
            <label className="mb-1 block text-slate-400" style={{ fontSize: 'var(--small-font)' }}>Start</label>
            <input
              type="time" value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full border border-white/8 bg-white/5 text-slate-200 outline-none [color-scheme:dark]"
              style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--item-pad-y) var(--item-pad-x)', fontSize: 'var(--body-font)' }}
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-slate-400" style={{ fontSize: 'var(--small-font)' }}>End</label>
            <input
              type="time" value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full border border-white/8 bg-white/5 text-slate-200 outline-none [color-scheme:dark]"
              style={{ borderRadius: 'var(--radius-sm)', padding: 'var(--item-pad-y) var(--item-pad-x)', fontSize: 'var(--body-font)' }}
            />
          </div>
        </div>
        <div className="flex" style={{ gap: 'var(--item-gap)' }}>
          <button type="submit" className="flex-1 bg-indigo-500 font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400"
            style={{ padding: 'var(--btn-pad-y) var(--btn-pad-x)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--body-font)' }}>
            Create
          </button>
          <button type="button" onClick={onClose} className="border border-white/8 text-slate-400 transition-colors hover:bg-white/5"
            style={{ padding: 'var(--btn-pad-y) var(--btn-pad-x)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--body-font)' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
