
import { Link, useLocation } from 'react-router-dom'
import FloatingBackButton from '../components/FloatingBackButton'
import MaterialIcon from '../components/MaterialIcon'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'

const iconStyle = { color: '#5545ce' }

const formatDate = value => {
  if (!value) return 'Not available'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-IN')
}

export default function EventRegistration() {
  const location = useLocation()
  const event = location.state?.event || {}
  const hasEvent = Object.keys(event).length > 0

  const eventId = event.id || event._id
  const eventPath = eventId ? `/events/${eventId}` : '/search'
  const eventName = event.event_name || 'Untitled Event'

  return (
    <div className="bg-surface text-on-surface">
      <StudentSidebar />

      <TopBar
        sidebar="student"
        placeholder="Search events, clubs, or opportunities..."
      />

      <FloatingBackButton fallbackTo={eventPath} />

      <main className="px-4 pb-16 pt-24 lg:ml-64 lg:px-10 lg:pt-28">
        <div className="mx-auto max-w-6xl">

          {!hasEvent ? (
            <section className="rounded-[32px] bg-white p-8 shadow">
              <h1 className="text-4xl font-bold">Event not found</h1>
            </section>
          ) : (

            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">

              {/* LEFT */}
              <section className="rounded-[32px] bg-white p-10 shadow">
                <span className="rounded-full bg-primary-fixed px-4 py-1 text-xs font-bold">
                  Event Registration
                </span>

                <h1 className="mt-6 text-4xl font-extrabold">
                  {eventName}
                </h1>

                <p className="mt-4 text-on-surface-variant">
                  {event.description}
                </p>

                {/* 🔥 REMOVED REDUNDANT ICON ROW */}

                <form className="mt-10 grid gap-6 md:grid-cols-2">
                  <div className="md:col-span-2 flex gap-4">
                    <button className="block w-full py-4 mt-4 bg-gradient-to-r from-primary to-secondary-container text-white font-bold rounded-full shadow-primary-glow hover:scale-[1.02] transition-transform duration-300 text-center disabled:opacity-70 disabled:hover:scale-100">
                      Confirm Registration
                    </button>
                  </div>
                </form>
              </section>

              {/* RIGHT - SINGLE CLEAN CARD */}
              <aside>
                <section className="rounded-[32px] bg-white p-8 shadow space-y-6">

                  <h2 className="text-2xl font-bold">Event Details</h2>

                  {/* EVENT NAME */}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Event</span>
                    <span className="font-semibold">{eventName}</span>
                  </div>

                  {/* VENUE */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-500">
                      <MaterialIcon style={iconStyle}>location_on</MaterialIcon>
                      Venue
                    </span>
                    <span className="font-semibold">{event.venue}</span>
                  </div>

                  {/* DATE */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-500">
                      <MaterialIcon style={iconStyle}>calendar_today</MaterialIcon>
                      Date
                    </span>
                    <span className="font-semibold">{formatDate(event.event_date)}</span>
                  </div>

                  {/* TIME */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-500">
                      <MaterialIcon style={iconStyle}>access_time</MaterialIcon>
                      Time
                    </span>
                    <span className="font-semibold">{event.event_time}</span>
                  </div>

                  {/* STATUS */}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="font-semibold">{event.event_status}</span>
                  </div>

                </section>
              </aside>

            </div>
          )}
        </div>
      </main>
    </div>
  )
}

