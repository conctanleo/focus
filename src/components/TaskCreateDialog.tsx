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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg border border-neutral-200"
      >
        <h3 className="mb-4 text-lg font-semibold">New Schedule Task</h3>
        <input
          type="text" value={title} placeholder="Task title"
          onChange={(e) => setTitle(e.target.value)}
          className="mb-3 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          autoFocus
        />
        <div className="mb-3 flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-neutral-400">Date</label>
            <input
              type="date" value={taskDate}
              onChange={(e) => setTaskDate(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>
        <div className="mb-4 flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-neutral-400">Start</label>
            <input
              type="time" value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs text-neutral-400">End</label>
            <input
              type="time" value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" className="flex-1 rounded-lg bg-neutral-900 py-2 text-sm font-medium text-white hover:bg-neutral-800">
            Create
          </button>
          <button type="button" onClick={onClose} className="rounded-lg border border-neutral-300 px-4 py-2 text-sm text-neutral-500 hover:bg-neutral-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
