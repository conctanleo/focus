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
        <div key={d} className="text-center text-xs font-medium text-slate-500">{d}</div>
      ))}
      {days.map((day) => (
        <button
          key={day.date}
          onClick={() => onSelectDay(day.date)}
          className="flex flex-col items-center rounded-xl border border-white/6 bg-white/5 p-3 transition-colors hover:border-white/15"
        >
          <span className="text-sm font-medium text-slate-300">{day.dayNum}</span>
          {day.taskCount > 0 && (
            <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-medium text-white">
              {day.taskCount}
            </span>
          )}
          {day.note && <span className="mt-1 truncate text-[10px] text-slate-500 max-w-full">{day.note}</span>}
        </button>
      ))}
    </div>
  )
}
