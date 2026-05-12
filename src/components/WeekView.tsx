interface DayInfo {
  date: string
  dayNum: number
  weekday: string
  taskCount: number
  note: string
}

export default function WeekView({ days, onSelectDay }: { days: DayInfo[]; onSelectDay: (date: string) => void }) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
        <div key={d} className="text-center text-xs font-medium text-neutral-400">{d}</div>
      ))}
      {days.map((day) => (
        <button
          key={day.date}
          onClick={() => onSelectDay(day.date)}
          className="flex flex-col items-center rounded-xl border border-neutral-200 bg-white p-3 transition-colors hover:border-neutral-400"
        >
          <span className="text-sm font-medium">{day.dayNum}</span>
          {day.taskCount > 0 && (
            <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white">
              {day.taskCount}
            </span>
          )}
          {day.note && <span className="mt-1 truncate text-[10px] text-neutral-400 max-w-full">{day.note}</span>}
        </button>
      ))}
    </div>
  )
}
