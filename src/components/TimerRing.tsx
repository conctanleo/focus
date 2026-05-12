import { useEffect, useRef } from 'react'
import { useTimer } from '../store/timer'

export default function TimerRing() {
  const { mode, secondsLeft, isRunning, completedPomodoros, tick, pause, resume, reset } = useTimer()
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(tick, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  const totalSeconds = mode === 'focus' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60
  const progress = 1 - secondsLeft / totalSeconds
  const circumference = 2 * Math.PI * 110
  const offset = circumference * (1 - progress)

  const minutes = Math.floor(secondsLeft / 60)
  const secs = secondsLeft % 60
  const timeStr = secondsLeft > 0 ? `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` : '00:00'

  const ringColor =
    mode === 'focus' ? '#e07020' : mode === 'shortBreak' ? '#3b82f6' : '#22c55e'

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="250" height="250" className="-rotate-90">
          <circle cx="125" cy="125" r="110" fill="none" stroke="#e5e5e5" strokeWidth="8" />
          <circle
            cx="125" cy="125" r="110" fill="none" stroke={ringColor} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-mono font-bold tracking-tight" style={{ color: ringColor }}>
            {timeStr}
          </span>
          <span className="mt-1 text-xs text-neutral-400">
            {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Break' : 'Long break'}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className="text-lg">
            {i < (completedPomodoros % 4) ? '🍅' : i < (completedPomodoros % 4) + (isRunning && mode === 'focus' ? 1 : 0) ? '🍅' : '⭕'}
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-3">
        {!isRunning ? (
          <button
            onClick={resume}
            className="rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            {secondsLeft === totalSeconds ? '▶ Start' : '▶ Resume'}
          </button>
        ) : (
          <button
            onClick={pause}
            className="rounded-lg bg-neutral-200 px-5 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-300"
          >
            ⏸ Pause
          </button>
        )}
        <button
          onClick={reset}
          className="rounded-lg border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
        >
          ⏹ Stop
        </button>
      </div>
    </div>
  )
}
