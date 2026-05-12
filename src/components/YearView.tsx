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
      className="cursor-pointer rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-400"
      onClick={() => onSelect(month.month)}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">{month.label}</h3>
        {month.taskCount > 0 && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs font-medium text-white">
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
              className="w-full rounded border border-neutral-300 px-2 py-1 text-xs outline-none"
              autoFocus
            />
            <button
              onClick={() => { onSaveNote(month.month, draft); setEditing(false) }}
              className="mt-1 rounded bg-neutral-900 px-2 py-0.5 text-[10px] text-white"
            >
              Save
            </button>
          </div>
        ) : (
          <p
            onClick={(e) => { e.stopPropagation(); setEditing(true) }}
            className="text-xs text-neutral-400 hover:text-neutral-600"
          >
            {month.note || 'Add note...'}
          </p>
        )}
      </div>
    </div>
  )
}
