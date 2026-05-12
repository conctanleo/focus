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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg border border-neutral-200">
        <div className="mb-4 text-center">
          <span className="text-3xl">⏰</span>
          <h3 className="mt-2 text-lg font-semibold">Scheduled Time</h3>
        </div>
        <p className="mb-1 text-center text-sm font-medium">{title}</p>
        <p className="mb-6 text-center text-xs text-neutral-400">Scheduled: {timeLabel}</p>
        <div className="flex gap-3">
          <button
            onClick={() => startMutation.mutate()}
            disabled={startMutation.isPending}
            className="flex-1 rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white hover:bg-orange-600"
          >
            Start Pomodoro
          </button>
          <button
            onClick={() => skipMutation.mutate()}
            disabled={skipMutation.isPending}
            className="flex-1 rounded-lg border border-neutral-300 py-2.5 text-sm font-medium text-neutral-500 hover:bg-neutral-50"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
