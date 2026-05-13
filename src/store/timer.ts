import { create } from 'zustand'

type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

interface TimerState {
  mode: TimerMode
  secondsLeft: number
  isRunning: boolean
  activeTaskId: string | null
  completedPomodoros: number
  startedAt: number | null

  start: (taskId: string) => void
  pause: () => void
  resume: () => void
  sync: () => void
  complete: () => void
  reset: () => void
}

const FOCUS_SECONDS = 25 * 60
const SHORT_BREAK_SECONDS = 5 * 60
const LONG_BREAK_SECONDS = 15 * 60

export const useTimer = create<TimerState>((set, get) => ({
  mode: 'focus',
  secondsLeft: FOCUS_SECONDS,
  isRunning: false,
  activeTaskId: null,
  completedPomodoros: 0,
  startedAt: null,

  start: (taskId) =>
    set({
      activeTaskId: taskId,
      secondsLeft: FOCUS_SECONDS,
      isRunning: true,
      mode: 'focus',
      startedAt: Date.now(),
    }),

  pause: () => set({ isRunning: false, startedAt: null }),

  resume: () => {
    const state = get()
    set({
      isRunning: true,
      startedAt: Date.now() - (getTotal(state.mode) - state.secondsLeft) * 1000,
    })
  },

  sync: () => {
    const state = get()
    if (!state.isRunning || state.startedAt == null) return
    const elapsed = Math.floor((Date.now() - state.startedAt) / 1000)
    const total = getTotal(state.mode)
    const remaining = Math.max(total - elapsed, 0)
    if (remaining <= 0) {
      get().complete()
    } else {
      set({ secondsLeft: remaining })
    }
  },

  complete: () => {
    const state = get()
    if (state.mode === 'focus') {
      const newCount = state.completedPomodoros + 1
      const isLongBreak = newCount % 4 === 0
      set({
        mode: isLongBreak ? 'longBreak' : 'shortBreak',
        secondsLeft: isLongBreak ? LONG_BREAK_SECONDS : SHORT_BREAK_SECONDS,
        isRunning: true,
        completedPomodoros: newCount,
        startedAt: Date.now(),
      })
    } else {
      set({
        mode: 'focus',
        secondsLeft: FOCUS_SECONDS,
        isRunning: false,
        startedAt: null,
      })
    }
  },

  reset: () =>
    set({
      mode: 'focus',
      secondsLeft: FOCUS_SECONDS,
      isRunning: false,
      activeTaskId: null,
      startedAt: null,
    }),
}))

function getTotal(mode: TimerMode) {
  if (mode === 'focus') return FOCUS_SECONDS
  if (mode === 'shortBreak') return SHORT_BREAK_SECONDS
  return LONG_BREAK_SECONDS
}
