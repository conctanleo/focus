export function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function dateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export function getWeekDays(date: Date): { date: string; dayNum: number; weekday: string }[] {
  const day = date.getDay()
  const monday = new Date(date)
  monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
  const days: { date: string; dayNum: number; weekday: string }[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push({ date: dateStr(d), dayNum: d.getDate(), weekday: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] })
  }
  return days
}

export function getMonthWeeks(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const startDay = firstDay.getDay()
  const mondayOffset = startDay === 0 ? -5 : 2 - startDay

  const weeks: { date: string; dayNum: number; isCurrentMonth: boolean; isToday: boolean }[][] = []
  const today = todayStr()
  let currentWeek: { date: string; dayNum: number; isCurrentMonth: boolean; isToday: boolean }[] = []

  // Fill leading days
  for (let i = mondayOffset; i < 1; i++) {
    const d = new Date(year, month - 1, i)
    currentWeek.push({ date: dateStr(d), dayNum: d.getDate(), isCurrentMonth: false, isToday: dateStr(d) === today })
  }
  // Fill month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month - 1, i)
    currentWeek.push({ date: dateStr(d), dayNum: i, isCurrentMonth: true, isToday: dateStr(d) === today })
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  // Fill trailing days
  if (currentWeek.length > 0) {
    let i = 1
    while (currentWeek.length < 7) {
      const d = new Date(year, month, i)
      currentWeek.push({ date: dateStr(d), dayNum: d.getDate(), isCurrentMonth: false, isToday: dateStr(d) === today })
      i++
    }
    weeks.push(currentWeek)
  }
  return weeks
}

export function getMonthStart(year: number, month: number) {
  return new Date(year, month - 1, 1)
}

export function getWeekStart(date: Date) {
  const day = date.getDay()
  const monday = new Date(date)
  monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
  return monday
}
