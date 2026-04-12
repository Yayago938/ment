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

const startOfMonth = date => new Date(date.getFullYear(), date.getMonth(), 1)
const endOfMonth = date => new Date(date.getFullYear(), date.getMonth() + 1, 0)

const formatDateKey = date => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDisplayDate = value => {
  const [year, month, day] = String(value).split('-').map(Number)
  const date = new Date(year, (month || 1) - 1, day || 1)

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ScheduleCalendarModal({ open, onClose, items }) {
  const itemMap = useMemo(() => {
    const mapped = new Map()

    items.forEach(item => {
      const date = new Date(item.date)

      if (Number.isNaN(date.getTime())) {
        return
      }

      const key = formatDateKey(date)
      const entry = mapped.get(key) || []
      entry.push(item)
      mapped.set(key, entry)
    })

    return mapped
  }, [items])

  const monthOptions = useMemo(() => {
    const uniqueMonths = Array.from(
      new Set(
        items.map(item => {
          const date = new Date(item.date)
          return Number.isNaN(date.getTime()) ? null : `${date.getFullYear()}-${date.getMonth()}`
        }).filter(Boolean),
      ),
    )

    if (uniqueMonths.length === 0) {
      const today = new Date()
      return [new Date(today.getFullYear(), today.getMonth(), 1)]
    }

    return uniqueMonths.map(value => {
      const [year, month] = value.split('-').map(Number)
      return new Date(year, month, 1)
    })
  }, [items])

  const [visibleMonth, setVisibleMonth] = useState(monthOptions[0])
  const [selectedDateKey, setSelectedDateKey] = useState(null)

  useEffect(() => {
    setVisibleMonth(monthOptions[0])
  }, [monthOptions])

  useEffect(() => {
    if (!open) {
      return
    }

    const firstKey = Array.from(itemMap.keys())[0] || formatDateKey(new Date())
    setSelectedDateKey(firstKey)
  }, [itemMap, open])

  if (!open) {
    return null
  }

  const firstDay = startOfMonth(visibleMonth)
  const lastDay = endOfMonth(visibleMonth)
  const leadingBlanks = (firstDay.getDay() + 6) % 7
  const totalDays = lastDay.getDate()
  const selectedItems = itemMap.get(selectedDateKey) || []

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
              <select
                value={`${visibleMonth.getFullYear()}-${visibleMonth.getMonth()}`}
                onChange={event => {
                  const [year, month] = event.target.value.split('-').map(Number)
                  setVisibleMonth(new Date(year, month, 1))
                }}
                className="rounded-full bg-surface-container-low px-4 py-2 text-sm font-bold text-on-surface outline-none"
              >
                {monthOptions.map(month => (
                  <option key={`${month.getFullYear()}-${month.getMonth()}`} value={`${month.getFullYear()}-${month.getMonth()}`}>
                    {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </option>
                ))}
              </select>
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
                const dayDate = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), dayNumber)
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
                        <span key={`${item.type}-${dotIndex}`} className={`h-2 w-2 rounded-full ${itemTone[item.type] || 'bg-outline-variant'}`} />
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
                <article key={`${item.title}-${index}`} className="rounded-[22px] bg-white p-4 shadow-[0_10px_24px_rgba(0,0,0,0.04)]">
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
