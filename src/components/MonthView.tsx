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
      <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-neutral-400">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <div key={d}>{d}</div>)}
      </div>
      {weeks.map((week, wi) => (
        <div key={wi} className="grid grid-cols-7">
          {week.map((day) => (
            <button
              key={day.date}
              onClick={() => onSelectDay(day.date)}
              className={`flex flex-col items-center rounded-lg p-2 transition-colors hover:bg-neutral-100 ${
                day.isToday ? 'bg-neutral-900 text-white hover:bg-neutral-800' : ''
              } ${!day.isCurrentMonth ? 'opacity-30' : ''}`}
            >
              <span className="text-sm">{day.dayNum}</span>
              {day.taskCount > 0 && (
                <span className={`mt-0.5 text-[10px] ${day.isToday ? 'text-white' : 'text-neutral-500'}`}>
                  {day.taskCount} tasks
                </span>
              )}
              {day.note && <span className="mt-0.5 text-[10px] text-orange-400">•</span>}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
