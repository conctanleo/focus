import { useEffect, useRef } from 'react'
import { Play, Pause, Square } from 'lucide-react'
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

  const colors = {
    focus: { ring: '#F97316', text: '#F97316' },
    shortBreak: { ring: '#6366F1', text: '#818CF8' },
    longBreak: { ring: '#22C55E', text: '#22C55E' },
  }
  const ringColor = colors[mode].ring
  const textColor = colors[mode].text

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width="250" height="250" className="-rotate-90">
          <circle cx="125" cy="125" r="110" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="125" cy="125" r="110" fill="none" stroke={ringColor} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-5xl font-bold tracking-tight tabular-nums" style={{ color: textColor }}>
            {timeStr}
          </span>
          <span className="mt-1 text-xs text-slate-400">
            {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Break' : 'Long break'}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={`inline-block h-3 w-3 rounded-full ${
              i < (completedPomodoros % 4)
                ? 'bg-orange-500'
                : i < (completedPomodoros % 4) + (isRunning && mode === 'focus' ? 1 : 0)
                  ? 'bg-orange-500'
                  : 'border border-white/10 bg-transparent'
            }`}
          />
        ))}
      </div>

      <div className="mt-6 flex gap-3">
        {!isRunning ? (
          <button
            onClick={resume}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-5 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400"
          >
            <Play size={14} />
            {secondsLeft === totalSeconds ? 'Start' : 'Resume'}
          </button>
        ) : (
          <button
            onClick={pause}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-5 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/15"
          >
            <Pause size={14} />
            Pause
          </button>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-300"
        >
          <Square size={14} />
          Stop
        </button>
      </div>
    </div>
  )
}
