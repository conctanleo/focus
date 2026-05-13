interface DayInfo {
  date: string
  dayNum: number
  weekday: string
  taskCount: number
  note: string
}

export default function WeekView({ days, onSelectDay }: { days: DayInfo[]; onSelectDay: (date: string) => void }) {
  return (
    <div className="grid grid-cols-7" style={{ gap: 'clamp(6px, 0.6vw, 10px)' }}>
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
        <div key={d} className="text-center font-medium text-slate-500" style={{ fontSize: 'clamp(10px, 0.7vw, 11px)' }}>{d}</div>
      ))}
      {days.map((day) => (
        <button
          key={day.date}
          onClick={() => onSelectDay(day.date)}
          className="flex flex-col items-center border border-white/6 bg-white/5 transition-colors hover:border-white/15 text-center"
          style={{ borderRadius: 'clamp(8px, 0.7vw, 12px)', padding: 'clamp(8px, 0.8vw, 14px)' }}
        >
          <span className="font-medium text-slate-300" style={{ fontSize: 'clamp(16px, 1.3vw, 20px)' }}>{day.dayNum}</span>
          {day.taskCount > 0 && (
            <span className="mt-1 flex items-center justify-center rounded-full bg-indigo-500 font-medium text-white"
              style={{ width: 'clamp(20px, 1.8vw, 28px)', height: 'clamp(20px, 1.8vw, 28px)', fontSize: 'clamp(9px, 0.7vw, 12px)' }}>
              {day.taskCount}
            </span>
          )}
          {day.note && <span className="mt-1 truncate text-slate-500 max-w-full" style={{ fontSize: 'clamp(8px, 0.6vw, 10px)' }}>{day.note}</span>}
        </button>
      ))}
    </div>
  )
}
