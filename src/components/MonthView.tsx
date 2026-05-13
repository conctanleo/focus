interface DayInfo {
  date: string
  dayNum: number
  taskCount: number
  note: string
  isCurrentMonth: boolean
  isToday: boolean
}

export default function MonthView({ weeks, onSelectDay }: { weeks: DayInfo[][]; onSelectDay: (date: string) => void }) {
  return (
    <div>
      <div className="mb-1 grid grid-cols-7 text-center font-medium text-slate-500" style={{ fontSize: 'clamp(10px, 0.7vw, 11px)' }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d}>{d}</div>)}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((day) => (
            <button
              key={day.date}
              onClick={() => onSelectDay(day.date)}
              className={`flex flex-col items-center transition-colors hover:bg-white/5 ${
                day.isToday ? 'bg-indigo-500 text-white hover:bg-indigo-400' : 'text-slate-400'
              } ${!day.isCurrentMonth ? 'opacity-30' : ''}`}
              style={{ borderRadius: 'var(--radius-sm)', padding: 'clamp(6px, 0.5vw, 10px)' }}
            >
              <span style={{ fontSize: 'clamp(13px, 1vw, 16px)' }}>{day.dayNum}</span>
              {day.taskCount > 0 && (
                <span
                  className={`${day.isToday ? 'text-white' : 'text-slate-500'}`}
                  style={{ fontSize: 'clamp(8px, 0.6vw, 10px)', marginTop: 'clamp(2px, 0.15vw, 4px)' }}
                >{day.taskCount} tasks</span>
              )}
              {day.note && <span className="text-indigo-400" style={{ fontSize: 'clamp(8px, 0.6vw, 10px)', marginTop: 'clamp(2px, 0.15vw, 4px)' }}>•</span>}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
