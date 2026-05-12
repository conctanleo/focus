import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useTimer } from '../store/timer'
import TimerRing from '../components/TimerRing'
import TaskList from '../components/TaskList'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function PomodoroPage() {
  const queryClient = useQueryClient()
  const { activeTaskId, start, complete } = useTimer()

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', todayStr()],
    queryFn: () => api.get(`/tasks?date=${todayStr()}`).then((r) => r.data.tasks),
  })

  const createMutation = useMutation({
    mutationFn: (title: string) =>
      api.post('/tasks', { title, taskDate: todayStr() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const startMutation = useMutation({
    mutationFn: (taskId: string) => api.post(`/tasks/${taskId}/pomodoro/start`),
    onSuccess: (_, taskId) => start(taskId),
  })

  const handleStart = (taskId: string) => {
    // Stop current timer if any
    if (activeTaskId && activeTaskId !== taskId) {
      api.post(`/tasks/${activeTaskId}/pomodoro/complete`).then(() => {
        complete()
        startMutation.mutate(taskId)
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
      })
    } else {
      startMutation.mutate(taskId)
    }
  }

  return (
    <div className="flex h-full gap-8 p-8 bg-slate-900">
      <div className="flex flex-1 items-center justify-center">
        <TimerRing />
      </div>
      <div className="border-l border-white/6 pl-8">
        {isLoading ? (
          <p className="text-sm text-slate-400">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={data || []}
            activeTaskId={activeTaskId}
            onStart={handleStart}
            onCreate={(title) => createMutation.mutate(title)}
          />
        )}
      </div>
    </div>
  )
}
