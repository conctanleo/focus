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
        <svg
          style={{ width: 'var(--timer-size)', height: 'var(--timer-size)' }}
          viewBox="0 0 250 250"
          className="-rotate-90"
        >
          <circle cx="125" cy="125" r="110" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="125" cy="125" r="110" fill="none" stroke={ringColor} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-bold tracking-tight tabular-nums" style={{ color: textColor, fontSize: 'var(--timer-font)' }}>
            {timeStr}
          </span>
          <span className="text-slate-400" style={{ fontSize: 'clamp(10px, 0.8vw, 13px)', marginTop: 'clamp(4px, 0.3vw, 8px)' }}>
            {mode === 'focus' ? 'Focus' : mode === 'shortBreak' ? 'Break' : 'Long break'}
          </span>
        </div>
      </div>

      <div className="flex items-center" style={{ gap: 'clamp(4px, 0.4vw, 8px)', marginTop: 'clamp(8px, 0.8vw, 16px)' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            style={{ width: 'clamp(6px, 0.5vw, 10px)', height: 'clamp(6px, 0.5vw, 10px)' }}
            className={`inline-block rounded-full ${
              i < (completedPomodoros % 4)
                ? 'bg-orange-500'
                : i < (completedPomodoros % 4) + (isRunning && mode === 'focus' ? 1 : 0)
                  ? 'bg-orange-500'
                  : 'border border-white/10 bg-transparent'
            }`}
          />
        ))}
      </div>

      <div className="flex" style={{ gap: 'clamp(6px, 0.6vw, 12px)', marginTop: 'clamp(12px, 1vw, 20px)' }}>
        {!isRunning ? (
          <button
            onClick={resume}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 font-medium text-white shadow-lg shadow-indigo-500/20 transition-colors hover:bg-indigo-400"
            style={{ padding: 'var(--btn-pad-y) var(--btn-pad-x)', fontSize: 'clamp(11px, 0.8vw, 14px)', borderRadius: 'var(--radius)' }}
          >
            <Play style={{ width: 'clamp(10px, 0.8vw, 14px)', height: 'clamp(10px, 0.8vw, 14px)' }} />
            {secondsLeft === totalSeconds ? 'Start' : 'Resume'}
          </button>
        ) : (
          <button
            onClick={pause}
            className="inline-flex items-center gap-2 rounded-lg bg-white/10 font-medium text-slate-200 transition-colors hover:bg-white/15"
            style={{ padding: 'var(--btn-pad-y) var(--btn-pad-x)', fontSize: 'clamp(11px, 0.8vw, 14px)', borderRadius: 'var(--radius)' }}
          >
            <Pause style={{ width: 'clamp(10px, 0.8vw, 14px)', height: 'clamp(10px, 0.8vw, 14px)' }} />
            Pause
          </button>
        )}
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-300"
          style={{ padding: 'var(--btn-pad-y) var(--btn-pad-x)', fontSize: 'clamp(11px, 0.8vw, 14px)', borderRadius: 'var(--radius)' }}
        >
          <Square style={{ width: 'clamp(10px, 0.8vw, 14px)', height: 'clamp(10px, 0.8vw, 14px)' }} />
          Stop
        </button>
      </div>
    </div>
  )
}
