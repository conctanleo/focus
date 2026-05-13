import { useState } from 'react'

interface MonthInfo {
  month: number
  label: string
  taskCount: number
  note: string
}

export default function YearView({
  months,
  onSelectMonth,
  onSaveMonthNote,
}: {
  months: MonthInfo[]
  onSelectMonth: (month: number) => void
  onSaveMonthNote: (month: number, content: string) => void
}) {
  return (
    <div className="grid grid-cols-3" style={{ gap: 'var(--section-gap)' }}>
      {months.map((m) => (
        <MonthCard key={m.month} month={m} onSelect={onSelectMonth} onSaveNote={onSaveMonthNote} />
      ))}
    </div>
  )
}

function MonthCard({
  month,
  onSelect,
  onSaveNote,
}: {
  month: MonthInfo
  onSelect: (m: number) => void
  onSaveNote: (m: number, content: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(month.note)

  return (
    <div
      className="cursor-pointer border border-white/6 bg-white/5 transition-colors hover:border-white/15"
      style={{ borderRadius: 'var(--radius)', padding: 'var(--item-pad-y) var(--item-pad-x)' }}
      onClick={() => onSelect(month.month)}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-slate-300" style={{ fontSize: 'var(--body-font)' }}>{month.label}</h3>
        {month.taskCount > 0 && (
          <span className="flex items-center justify-center rounded-full bg-indigo-500 font-medium text-white"
            style={{ width: 'clamp(20px, 1.8vw, 28px)', height: 'clamp(20px, 1.8vw, 28px)', fontSize: 'var(--small-font)' }}>
            {month.taskCount}
          </span>
        )}
      </div>
      <div style={{ marginTop: 'var(--item-gap)' }}>
        {editing ? (
          <div onClick={(e) => e.stopPropagation()}>
            <input
              value={draft} onChange={(e) => setDraft(e.target.value)}
              placeholder="Month note..."
              className="w-full border border-white/8 bg-white/5 text-slate-200 outline-none placeholder:text-slate-500"
              style={{ borderRadius: 'var(--radius-sm)', padding: 'clamp(4px, 0.3vw, 6px) clamp(6px, 0.5vw, 10px)', fontSize: 'var(--small-font)' }}
              autoFocus
            />
            <button
              onClick={() => { onSaveNote(month.month, draft); setEditing(false) }}
              className="mt-1 bg-indigo-500 text-white"
              style={{ borderRadius: 'var(--radius-sm)', padding: 'clamp(2px, 0.2vw, 4px) clamp(6px, 0.5vw, 10px)', fontSize: 'clamp(8px, 0.6vw, 10px)' }}
            >Save</button>
          </div>
        ) : (
          <p
            onClick={(e) => { e.stopPropagation(); setEditing(true) }}
            className="text-slate-500 transition-colors hover:text-slate-400"
            style={{ fontSize: 'var(--small-font)' }}
          >{month.note || 'Add note...'}</p>
        )}
      </div>
    </div>
  )
}
