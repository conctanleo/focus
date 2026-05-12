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
    <div className="grid grid-cols-3 gap-4">
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
      className="cursor-pointer rounded-xl border border-white/6 bg-white/5 p-4 transition-colors hover:border-white/15"
      onClick={() => onSelect(month.month)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">{month.label}</h3>
        {month.taskCount > 0 && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs font-medium text-white">
            {month.taskCount}
          </span>
        )}
      </div>
      <div className="mt-2">
        {editing ? (
          <div onClick={(e) => e.stopPropagation()}>
            <input
              value={draft} onChange={(e) => setDraft(e.target.value)}
              placeholder="Month note..."
              className="w-full rounded border border-white/8 bg-white/5 px-2 py-1 text-xs text-slate-200 outline-none placeholder:text-slate-500"
              autoFocus
            />
            <button
              onClick={() => { onSaveNote(month.month, draft); setEditing(false) }}
              className="mt-1 rounded bg-indigo-500 px-2 py-0.5 text-[10px] text-white"
            >
              Save
            </button>
          </div>
        ) : (
          <p
            onClick={(e) => { e.stopPropagation(); setEditing(true) }}
            className="text-xs text-slate-500 transition-colors hover:text-slate-400"
          >
            {month.note || 'Add note...'}
          </p>
        )}
      </div>
    </div>
  )
}
