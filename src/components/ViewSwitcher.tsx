import { ChevronLeft, ChevronRight } from 'lucide-react'

type View = 'year' | 'month' | 'week' | 'day'

export default function ViewSwitcher({
  view, onChange, currentDate, onPrev, onNext,
}: {
  view: View
  onChange: (v: View) => void
  currentDate: Date
  onPrev: () => void
  onNext: () => void
}) {
  const views: View[] = ['year', 'month', 'week', 'day']
  const fmt = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' })
  const labels: Record<View, string> = {
    year: currentDate.getFullYear().toString(),
    month: fmt.format(currentDate),
    week: `${fmt.format(currentDate)}`,
    day: currentDate.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
  }

  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onPrev} className="rounded-lg border border-white/8 p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200">
          <ChevronLeft size={16} />
        </button>
        <span className="min-w-36 text-center text-sm font-medium text-slate-200">{labels[view]}</span>
        <button onClick={onNext} className="rounded-lg border border-white/8 p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200">
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="flex rounded-lg border border-white/8 bg-white/5 p-0.5">
        {views.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
              view === v ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
