import { create } from 'zustand'

type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

interface TimerState {
  mode: TimerMode
  secondsLeft: number
  isRunning: boolean
  activeTaskId: string | null
  completedPomodoros: number

  start: (taskId: string) => void
  pause: () => void
  resume: () => void
  tick: () => void
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

  start: (taskId) =>
    set({
      activeTaskId: taskId,
      secondsLeft: FOCUS_SECONDS,
      isRunning: true,
      mode: 'focus',
    }),

  pause: () => set({ isRunning: false }),

  resume: () => set({ isRunning: true }),

  tick: () => {
    const state = get()
    if (!state.isRunning) return
    if (state.secondsLeft <= 1) {
      get().complete()
      return
    }
    set({ secondsLeft: state.secondsLeft - 1 })
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
      })
    } else {
      // Break completed, reset to focus
      set({
        mode: 'focus',
        secondsLeft: FOCUS_SECONDS,
        isRunning: false,
      })
    }
  },

  reset: () =>
    set({
      mode: 'focus',
      secondsLeft: FOCUS_SECONDS,
      isRunning: false,
      activeTaskId: null,
    }),
}))
