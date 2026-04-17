import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'
import TopBar from '../components/TopBar'
import { deleteEvent, getEventsByCommittee } from '../api/eventApi'

const getEventId = event => event?.id || event?._id

const formatDate = value => {
  if (!value) {
    return 'Date to be announced'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return parsedDate.toLocaleDateString()
}

export default function CommitteeEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { id } = useParams()
  const committeeId = id || localStorage.getItem('committeeId')

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      setError('')

      try {
        console.log('Fetching events for committee:', committeeId)

        const res = await getEventsByCommittee(committeeId)
        console.log('Events API response:', res)

        const data = res?.events || res?.data || res || []
        setEvents(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setError('Failed to load events')
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    if (!committeeId) {
      setError('Committee ID not found. Please log in again.')
      setLoading(false)
      return
    }

    localStorage.setItem('committeeId', committeeId)
    fetchEvents()
  }, [committeeId])

  const handleDeleteEvent = async eventId => {
    if (!eventId) {
      return
    }

    if (!window.confirm('Are you sure you want to delete this event?')) {
      return
    }

    try {
      await deleteEvent(eventId)
      setEvents(prevEvents => prevEvents.filter(event => getEventId(event) !== eventId))
    } catch (err) {
      console.error('Failed to delete event', err)
    }
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <CommitteeSidebar />
      <TopBar
        sidebar="committee"
        placeholder="Search your events..."
        userName="Committee Lead"
        userRole="Event Management"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBlnMwMiijKv4SJYQ2_QLTHTAtBMGIIcsK_eIZFsEjO22G7PNZNaEemJvklXWhRzpTu7BbQdL3IS8dKkSEVZXMtLYv0tV_z3EwtyGj86ss0fDXNlY5J9Oe7kwgRs5Q0H1pbzlOMduQGuWiwtoYGWa1QKvqkRdfBRI7hILUxI1FLP05GSkj77_bLGakapEmdHcNzlf7T7Ju6lPSMIux-6N5yEBzkN5K_uc11oPeQV67J4pDbaEU1QrCT2SscFxRQ5LPiwjNDhmv3Acg"
        actions={['notifications']}
      />

      <main className="px-4 pb-12 pt-24 lg:ml-64 lg:p-10 lg:pt-24">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,rgba(85,69,206,0.96),rgba(244,114,182,0.88))] p-8 text-white shadow-[0_25px_70px_rgba(85,69,206,0.22)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">
                Committee Events
              </p>
              <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
                Manage Every Event You've Created
              </h1>
              <p className="mt-3 text-lg text-white/90">
                Review upcoming sessions, revisit event details, and jump straight into editing when plans change.
              </p>
            </div>

            <Link
              to={committeeId ? `/committee/${committeeId}/events/new` : '/committee-dashboard'}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-on-surface transition-transform hover:scale-[1.02]"
            >
              Create New Event
            </Link>
          </div>
        </section>

        {loading ? (
          <section className="mt-8 rounded-[28px] bg-white p-8 shadow-sm">
            <p className="text-sm text-on-surface-variant">Loading events...</p>
          </section>
        ) : null}

        {!loading && error ? (
          <section className="mt-8 rounded-[28px] bg-rose-50 p-8 shadow-sm">
            <p className="text-sm font-medium text-rose-600">{error}</p>
          </section>
        ) : null}

        {!loading && !error && events.length === 0 ? (
          <section className="mt-8 rounded-[28px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-on-surface">No events found</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Your committee has not created any events yet.
            </p>
          </section>
        ) : null}

        {!loading && !error && events.length > 0 ? (
          <section className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map(event => (
              <article
                key={getEventId(event)}
                className="cursor-pointer rounded-[28px] bg-white p-6 shadow-md transition-transform hover:-translate-y-1"
                onClick={() => navigate(`/events/${getEventId(event)}/registrations`, { state: { event } })}
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl font-bold text-on-surface">{event.event_name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                      Event
                    </span>
                    <button
                      onClick={clickEvent => {
                        clickEvent.stopPropagation()
                        handleDeleteEvent(getEventId(event))
                      }}
                      className="text-red-500 transition hover:text-red-700"
                      type="button"
                      aria-label={`Delete ${event.event_name}`}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                  {event.description || 'No description available.'}
                </p>

                <div className="mt-4 space-y-2 text-sm text-on-surface">
                  <p>Venue: {event.venue || 'Venue to be announced'}</p>
                  <p>Date: {formatDate(event.event_date)}</p>
                  <p>Time: {event.event_time || 'Time to be announced'}</p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(event.tags || []).map(tag => (
                    <span key={tag} className="rounded-full bg-surface-container-low px-3 py-1 text-xs font-medium text-on-surface-variant">
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={clickEvent => {
                    clickEvent.stopPropagation()
                    navigate(`/events/edit/${getEventId(event)}`, { state: event })
                  }}
                  className="mt-6 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  type="button"
                >
                  Edit Event
                </button>
              </article>
            ))}
          </section>
        ) : null}
      </main>
    </div>
  )
}
