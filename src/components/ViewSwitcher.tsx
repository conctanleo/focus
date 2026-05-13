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
      <div className="flex items-center" style={{ gap: 'clamp(6px, 0.5vw, 10px)' }}>
        <button
          onClick={onPrev}
          className="border border-white/8 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200 flex items-center justify-center"
          style={{ width: 'clamp(24px, 2vw, 32px)', height: 'clamp(24px, 2vw, 32px)', borderRadius: 'var(--radius-sm)' }}
        >
          <ChevronLeft style={{ width: 'clamp(12px, 1vw, 16px)', height: 'clamp(12px, 1vw, 16px)' }} />
        </button>
        <span className="min-w-36 text-center font-medium text-slate-200" style={{ fontSize: 'clamp(11px, 0.9vw, 15px)' }}>
          {labels[view]}
        </span>
        <button
          onClick={onNext}
          className="border border-white/8 text-slate-400 transition-colors hover:bg-white/5 hover:text-slate-200 flex items-center justify-center"
          style={{ width: 'clamp(24px, 2vw, 32px)', height: 'clamp(24px, 2vw, 32px)', borderRadius: 'var(--radius-sm)' }}
        >
          <ChevronRight style={{ width: 'clamp(12px, 1vw, 16px)', height: 'clamp(12px, 1vw, 16px)' }} />
        </button>
      </div>
      <div className="flex border border-white/8 bg-white/5 p-0.5" style={{ borderRadius: 'var(--radius)' }}>
        {views.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`capitalize transition-colors ${
              view === v ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            style={{
              padding: 'clamp(3px, 0.3vw, 5px) clamp(8px, 0.8vw, 14px)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'clamp(9px, 0.7vw, 11px)',
              fontWeight: 500,
            }}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
