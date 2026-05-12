import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { todayStr, dateStr, getWeekDays, getMonthWeeks, getMonthStart, getWeekStart } from '../lib/calendar'
import ViewSwitcher from '../components/ViewSwitcher'
import DayView from '../components/DayView'
import WeekView from '../components/WeekView'
import MonthView from '../components/MonthView'
import YearView from '../components/YearView'
import TaskCreateDialog from '../components/TaskCreateDialog'

type View = 'year' | 'month' | 'week' | 'day'

export default function SchedulePage() {
  const queryClient = useQueryClient()
  const [view, setView] = useState<View>('day')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  // Calculate date range based on view
  const dateRange = useMemo(() => {
    if (view === 'day') {
      const d = dateStr(currentDate)
      return { start: d, end: d, queryDate: d }
    }
    if (view === 'week') {
      const start = getWeekStart(currentDate)
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      return { start: dateStr(start), end: dateStr(end), queryDate: null }
    }
    if (view === 'month') {
      const start = getMonthStart(currentYear, currentMonth)
      const end = new Date(currentYear, currentMonth, 0)
      return { start: dateStr(start), end: dateStr(end), queryDate: null }
    }
    return { start: `${currentYear}-01-01`, end: `${currentYear}-12-31`, queryDate: null }
  }, [view, currentDate, currentYear, currentMonth])

  // Fetch tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', dateRange.start, dateRange.end],
    queryFn: () => api.get(`/tasks?start=${dateRange.start}&end=${dateRange.end}`).then((r) => r.data.tasks),
  })

  // Fetch day note (only for day view)
  const { data: noteData } = useQuery({
    queryKey: ['schedule-note', dateRange.queryDate],
    queryFn: () => api.get(`/schedule-notes?date=${dateRange.queryDate}`).then((r) => r.data.note),
    enabled: !!dateRange.queryDate,
  })

  const createTaskMutation = useMutation({
    mutationFn: (data: any) => api.post('/tasks', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  })

  const saveNoteMutation = useMutation({
    mutationFn: (data: { date: string; noteType: string; content: string }) =>
      api.post('/schedule-notes', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['schedule-note'] }),
  })

  const navigate = (dir: -1 | 1) => {
    setCurrentDate((d) => {
      const n = new Date(d)
      if (view === 'day') n.setDate(n.getDate() + dir)
      else if (view === 'week') n.setDate(n.getDate() + dir * 7)
      else if (view === 'month') n.setMonth(n.getMonth() + dir)
      else n.setFullYear(n.getFullYear() + dir)
      return n
    })
  }

  // Build week view data
  const weekDays = useMemo(() => {
    const days = getWeekDays(currentDate)
    return days.map((d) => {
      const dayTasks = tasks.filter((t: any) => t.taskDate === d.date)
      return { ...d, taskCount: dayTasks.length, note: '' }
    })
  }, [currentDate, tasks])

  // Build month view data
  const monthWeeks = useMemo(() => {
    const weeks = getMonthWeeks(currentYear, currentMonth)
    return weeks.map((week) =>
      week.map((day) => ({
        ...day,
        taskCount: tasks.filter((t: any) => t.taskDate === day.date).length,
        note: '',
      }))
    )
  }, [currentYear, currentMonth, tasks])

  // Build year view data
  const yearMonths = useMemo(() => {
    const months: { month: number; label: string; taskCount: number; note: string }[] = []
    for (let m = 1; m <= 12; m++) {
      const label = new Date(currentYear, m - 1, 1).toLocaleDateString('en', { month: 'long' })
      const count = tasks.filter((t: any) => {
        const d = t.taskDate
        return d && parseInt(d.slice(5, 7)) === m && d.startsWith(currentYear.toString())
      }).length
      months.push({ month: m, label, taskCount: count, note: '' })
    }
    return months
  }, [currentYear, tasks])

  const handleSelectDay = (date: string) => {
    setView('day')
    setCurrentDate(new Date(date + 'T00:00:00'))
  }

  const handleSelectMonth = (month: number) => {
    setView('month')
    setCurrentDate(new Date(currentYear, month - 1, 1))
  }

  return (
    <div className="p-8">
      <ViewSwitcher view={view} onChange={setView} currentDate={currentDate} onPrev={() => navigate(-1)} onNext={() => navigate(1)} />

      {view === 'day' && (
        <DayView
          tasks={tasks}
          note={noteData?.content || ''}
          onSaveNote={(content) => saveNoteMutation.mutate({ date: dateRange.queryDate!, noteType: 'day', content })}
          onNewTask={() => setShowCreateDialog(true)}
        />
      )}
      {view === 'week' && <WeekView days={weekDays} onSelectDay={handleSelectDay} />}
      {view === 'month' && <MonthView weeks={monthWeeks} onSelectDay={handleSelectDay} />}
      {view === 'year' && (
        <YearView
          months={yearMonths}
          onSelectMonth={handleSelectMonth}
          onSaveMonthNote={(month, content) =>
            saveNoteMutation.mutate({ date: `${currentYear}-${String(month).padStart(2, '0')}`, noteType: 'month', content })
          }
        />
      )}

      {showCreateDialog && (
        <TaskCreateDialog
          defaultDate={dateStr(currentDate)}
          onSave={(data) => createTaskMutation.mutate(data)}
          onClose={() => setShowCreateDialog(false)}
        />
      )}
    </div>
  )
}
