import { useEffect, useMemo, useState } from 'react'

const itemTone = {
  event: 'bg-primary',
  deadline: 'bg-secondary',
  interview: 'bg-tertiary',
}

const itemLabel = {
  event: 'Upcoming Event',
  deadline: 'Registration Deadline',
  interview: 'Interview',
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const startOfMonth = date => new Date(date.getFullYear(), date.getMonth(), 1)
const endOfMonth = date => new Date(date.getFullYear(), date.getMonth() + 1, 0)

const toCalendarDate = date => new Date(date.getFullYear(), date.getMonth(), date.getDate())

const formatDateKey = date => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const safeParseDate = value => {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value.getTime())
  }

  if (typeof value === 'number') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  }

  if (typeof value !== 'string') {
    return null
  }

  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  const dateOnlyMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})$/)

  if (dateOnlyMatch) {
    const [, year, month, day] = dateOnlyMatch
    const date = new Date(Number(year), Number(month) - 1, Number(day))
    return Number.isNaN(date.getTime()) ? null : date
  }

  const timestampMatch = trimmedValue.match(/^\d+$/)

  if (timestampMatch) {
    const date = new Date(Number(trimmedValue))
    return Number.isNaN(date.getTime()) ? null : date
  }

  const date = new Date(trimmedValue)
  return Number.isNaN(date.getTime()) ? null : date
}

const formatDisplayDate = value => {
  const date = safeParseDate(value)

  if (!date) {
    return 'Select a date'
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ScheduleCalendarModal({ open, onClose, items }) {
  const today = useMemo(() => toCalendarDate(new Date()), [])

  const validItems = useMemo(
    () =>
      items.flatMap(item => {
        const parsedDate = safeParseDate(item?.date)

        if (!parsedDate) {
          return []
        }

        const calendarDate = toCalendarDate(parsedDate)

        return [{
          ...item,
          parsedDate: calendarDate,
          dateKey: formatDateKey(calendarDate),
        }]
      }),
    [items],
  )

  const itemMap = useMemo(() => {
    const mapped = new Map()

    validItems.forEach(item => {
      const entry = mapped.get(item.dateKey) || []
      entry.push(item)
      mapped.set(item.dateKey, entry)
    })

    return mapped
  }, [validItems])

  const availableYears = useMemo(() => {
    const years = Array.from(new Set(validItems.map(item => item.parsedDate.getFullYear())))
      .sort((left, right) => left - right)

    return years.length > 0 ? years : [today.getFullYear()]
  }, [today, validItems])

  const defaultSelection = useMemo(() => {
    const sortedDates = validItems
      .map(item => item.parsedDate)
      .sort((left, right) => left.getTime() - right.getTime())

    const defaultDate = sortedDates.find(date => date.getTime() >= today.getTime()) || sortedDates[0] || today

    return {
      month: defaultDate.getMonth(),
      year: defaultDate.getFullYear(),
      dateKey: sortedDates.length > 0 ? formatDateKey(defaultDate) : null,
    }
  }, [today, validItems])

  const [selectedMonth, setSelectedMonth] = useState(defaultSelection.month)
  const [selectedYear, setSelectedYear] = useState(defaultSelection.year)
  const [selectedDateKey, setSelectedDateKey] = useState(defaultSelection.dateKey)

  useEffect(() => {
    if (!open) {
      return
    }

    setSelectedMonth(defaultSelection.month)
    setSelectedYear(defaultSelection.year)
    setSelectedDateKey(defaultSelection.dateKey)
  }, [defaultSelection, open])

  useEffect(() => {
    if (!open) {
      return
    }

    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(defaultSelection.year)
    }
  }, [availableYears, defaultSelection.year, open, selectedYear])

  const visibleMonth = useMemo(
    () => new Date(selectedYear, selectedMonth, 1),
    [selectedMonth, selectedYear],
  )

  const visibleMonthDateKeys = useMemo(
    () =>
      validItems
        .filter(item =>
          item.parsedDate.getFullYear() === selectedYear
          && item.parsedDate.getMonth() === selectedMonth,
        )
        .map(item => item.dateKey)
        .sort(),
    [selectedMonth, selectedYear, validItems],
  )

  useEffect(() => {
    if (!open) {
      return
    }

    const selectedItemsDate = selectedDateKey ? safeParseDate(selectedDateKey) : null
    const isSelectedDateVisible = Boolean(
      selectedItemsDate
      && selectedItemsDate.getFullYear() === selectedYear
      && selectedItemsDate.getMonth() === selectedMonth,
    )

    if (isSelectedDateVisible) {
      return
    }

    setSelectedDateKey(visibleMonthDateKeys[0] || null)
  }, [open, selectedDateKey, selectedMonth, selectedYear, visibleMonthDateKeys])

  if (!open) {
    return null
  }

  const firstDay = startOfMonth(visibleMonth)
  const lastDay = endOfMonth(visibleMonth)
  const leadingBlanks = (firstDay.getDay() + 6) % 7
  const totalDays = lastDay.getDate()
  const selectedItems = selectedDateKey ? itemMap.get(selectedDateKey) || [] : []

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/20 px-4 py-8 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl rounded-[32px] bg-white p-8 shadow-[0_24px_70px_rgba(15,23,42,0.16)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant"
          aria-label="Close schedule"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <section>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Schedule</p>
                <h2 className="font-headline mt-2 text-3xl font-extrabold">Calendar View</h2>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedMonth}
                  onChange={event => setSelectedMonth(Number(event.target.value))}
                  className="rounded-full bg-surface-container-low px-4 py-2 text-sm font-bold text-on-surface outline-none"
                  aria-label="Select month"
                >
                  {monthNames.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={selectedYear}
                  onChange={event => setSelectedYear(Number(event.target.value))}
                  className="rounded-full bg-surface-container-low px-4 py-2 text-sm font-bold text-on-surface outline-none"
                  aria-label="Select year"
                >
                  {availableYears.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-7 gap-3 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-7 gap-3">
              {Array.from({ length: leadingBlanks }).map((_, index) => (
                <div key={`blank-${index}`} className="h-20 rounded-2xl bg-surface-container-low/40" />
              ))}

              {Array.from({ length: totalDays }).map((_, index) => {
                const dayNumber = index + 1
                const dayDate = new Date(selectedYear, selectedMonth, dayNumber)
                const dayKey = formatDateKey(dayDate)
                const dayItems = itemMap.get(dayKey) || []
                const isSelected = selectedDateKey === dayKey

                return (
                  <button
                    type="button"
                    key={dayKey}
                    onClick={() => setSelectedDateKey(dayKey)}
                    className={`h-20 rounded-2xl border px-3 py-2 text-left transition-colors ${isSelected ? 'border-primary bg-primary-fixed/40' : 'border-outline-variant/10 bg-surface-container-lowest hover:bg-surface-container-low'}`}
                  >
                    <span className="text-sm font-bold text-on-surface">{dayNumber}</span>
                    <div className="mt-4 flex gap-1.5">
                      {dayItems.slice(0, 3).map((item, dotIndex) => (
                        <span key={`${item.id || item.type}-${dotIndex}`} className={`h-2 w-2 rounded-full ${itemTone[item.type] || 'bg-outline-variant'}`} />
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <aside className="rounded-[28px] bg-surface-container-low p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">Date Summary</p>
            <h3 className="font-headline mt-3 text-2xl font-bold">
              {selectedDateKey ? formatDisplayDate(selectedDateKey) : 'Select a date'}
            </h3>

            <div className="mt-6 space-y-4">
              {selectedItems.length > 0 ? selectedItems.map((item, index) => (
                <article key={item.id || `${item.title}-${index}`} className="rounded-[22px] bg-white p-4 shadow-[0_10px_24px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-3">
                    <span className={`h-2.5 w-2.5 rounded-full ${itemTone[item.type] || 'bg-outline-variant'}`} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                      {itemLabel[item.type] || 'Scheduled Item'}
                    </p>
                  </div>
                  <h4 className="mt-3 font-bold text-on-surface">{item.title}</h4>
                  <p className="mt-2 text-sm text-on-surface-variant">{item.subtitle}</p>
                </article>
              )) : (
                <div className="rounded-[22px] bg-white p-5 text-sm text-on-surface-variant shadow-[0_10px_24px_rgba(0,0,0,0.04)]">
                  No scheduled items for this date yet.
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                Upcoming events
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-secondary" />
                Registration deadlines
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2">
                <span className="h-2.5 w-2.5 rounded-full bg-tertiary" />
                Interviews
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
