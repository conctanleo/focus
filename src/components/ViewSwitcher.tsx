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
        <button onClick={onPrev} className="rounded-lg border px-2 py-1 text-sm hover:bg-neutral-100">←</button>
        <span className="min-w-36 text-center text-sm font-medium">{labels[view]}</span>
        <button onClick={onNext} className="rounded-lg border px-2 py-1 text-sm hover:bg-neutral-100">→</button>
      </div>
      <div className="flex rounded-lg border border-neutral-200 bg-white p-0.5">
        {views.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${
              view === v ? 'bg-neutral-900 text-white' : 'text-neutral-500 hover:bg-neutral-100'
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  )
}
