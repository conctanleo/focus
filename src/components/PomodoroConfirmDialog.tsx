import { Bell } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useTimer } from '../store/timer'

interface Props {
  taskId: string
  title: string
  scheduledStartAt: string
  onClose: () => void
}

export default function PomodoroConfirmDialog({ taskId, title, scheduledStartAt, onClose }: Props) {
  const queryClient = useQueryClient()
  const start = useTimer((s) => s.start)

  const startMutation = useMutation({
    mutationFn: () => api.post(`/tasks/${taskId}/pomodoro/start`),
    onSuccess: () => {
      start(taskId)
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      onClose()
    },
  })

  const skipMutation = useMutation({
    mutationFn: () => api.patch(`/tasks/${taskId}`, { notifiedAt: new Date().toISOString() }),
    onSuccess: onClose,
  })

  const startTime = new Date(scheduledStartAt)
  const timeLabel = startTime.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-xl border border-white/8 bg-slate-800 p-6 shadow-2xl">
        <div className="mb-4 text-center">
          <Bell size={36} className="mx-auto text-indigo-400" />
          <h3 className="mt-2 text-lg font-semibold text-slate-100">Scheduled Time</h3>
        </div>
        <p className="mb-1 text-center text-sm font-medium text-slate-200">{title}</p>
        <p className="mb-6 text-center text-xs text-slate-400">Scheduled: {timeLabel}</p>
        <div className="flex gap-3">
          <button
            onClick={() => startMutation.mutate()}
            disabled={startMutation.isPending}
            className="flex-1 rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white shadow-lg shadow-orange-500/20 transition-colors hover:bg-orange-400 disabled:opacity-50"
          >
            Start Pomodoro
          </button>
          <button
            onClick={() => skipMutation.mutate()}
            disabled={skipMutation.isPending}
            className="flex-1 rounded-lg border border-white/8 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
