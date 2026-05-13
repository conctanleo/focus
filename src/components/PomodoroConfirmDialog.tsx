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
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm border border-white/8 bg-slate-800 shadow-2xl text-center"
        style={{ borderRadius: 'var(--radius)', padding: 'var(--section-gap)' }}>
        <Bell style={{ width: 'clamp(28px, 2.5vw, 40px)', height: 'clamp(28px, 2.5vw, 40px)' }} className="mx-auto text-indigo-400" />
        <h3 className="font-semibold text-slate-100" style={{ fontSize: 'var(--heading-font)', marginTop: 'var(--item-gap)' }}>Scheduled Time</h3>
        <p className="font-medium text-slate-200" style={{ fontSize: 'var(--body-font)', marginTop: 'clamp(4px, 0.3vw, 8px)' }}>{title}</p>
        <p className="text-slate-400" style={{ fontSize: 'var(--small-font)', marginBottom: 'var(--section-gap)' }}>Scheduled: {timeLabel}</p>
        <div className="flex" style={{ gap: 'var(--item-gap)' }}>
          <button
            onClick={() => startMutation.mutate()}
            disabled={startMutation.isPending}
            className="flex-1 bg-orange-500 font-medium text-white shadow-lg shadow-orange-500/20 transition-colors hover:bg-orange-400 disabled:opacity-50"
            style={{ padding: 'var(--btn-pad-y) var(--btn-pad-x)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--body-font)' }}>
            Start Pomodoro
          </button>
          <button
            onClick={() => skipMutation.mutate()}
            disabled={skipMutation.isPending}
            className="flex-1 border border-white/8 font-medium text-slate-400 transition-colors hover:bg-white/5"
            style={{ padding: 'var(--btn-pad-y) var(--btn-pad-x)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--body-font)' }}>
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
