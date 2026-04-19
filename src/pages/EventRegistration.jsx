import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti' // Import the confetti library
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
  const [showModal, setShowModal] = useState(false)

  const navigate = useNavigate()
  const eventId = event.id || event._id
  const eventPath = eventId ? `/events/${eventId}` : '/search'
  const eventName = event.event_name || 'Untitled Event'

  const fireConfetti = () => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

    const randomInRange = (min, max) => Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      // Since particles fall down, start them a bit higher than random
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })
    }, 250)
  }

  const handleSubmit = () => {
    setShowModal(true)
    fireConfetti() // Trigger the full screen effect
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
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
                <span className="rounded-full bg-primary-fixed px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                  Registration
                </span>

                <h1 className="mt-6 text-4xl font-extrabold tracking-tight">
                  {eventName}
                </h1>

                <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
                  {event.description}
                </p>

                <div className="mt-12 border-t border-gray-100 pt-10">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-primary py-4 text-lg font-bold text-white transition-all hover:bg-opacity-90 active:scale-95"
                  >
                    Confirm Registration
                  </button>
                </div>
              </section>

              {/* RIGHT */}
              <aside>
                <section className="space-y-6 rounded-[32px] bg-white p-8 shadow">
                  <h2 className="text-xl font-bold text-gray-800">Summary</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">Venue</span>
                      <span className="font-medium text-right">{event.venue}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium">{formatDate(event.event_date)}</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-gray-50">
                      <span className="text-gray-500">Time</span>
                      <span className="font-medium">{event.event_time}</span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Status</span>
                      <span className="font-bold text-green-600 capitalize">{event.event_status}</span>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          )}
        </div>
      </main>

      {/* MINIMALIST MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Card */}
          <div className="relative w-full max-w-md transform overflow-hidden rounded-[40px] bg-white p-10 shadow-2xl transition-all animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="h-1.5 w-12 rounded-full bg-primary/20" />
              </div>
              
              <h2 className="text-3xl font-black tracking-tight text-on-surface">
                Confirmed!
              </h2>
              
              <p className="mt-4 text-on-surface-variant">
                Your registration for <span className="font-semibold text-primary">{eventName}</span> is complete.
              </p>

              <div className="mt-10 space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    navigate(eventPath, { state: { event } })
                  }}
                  className="w-full rounded-2xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:translate-y-[-2px] hover:shadow-xl"
                >
                  Back to Event
                </button>
                
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full py-2 text-sm font-semibold text-gray-400 transition-colors hover:text-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}