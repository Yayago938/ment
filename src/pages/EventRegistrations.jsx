import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'
import TopBar from '../components/TopBar'
import { getEventRegistrations } from '../api/eventApi'

const normalizeRegistrations = payload => {
  if (Array.isArray(payload)) {
    return payload
  }

  if (Array.isArray(payload?.registrations)) {
    return payload.registrations
  }

  if (Array.isArray(payload?.data?.registrations)) {
    return payload.data.registrations
  }

  if (Array.isArray(payload?.data)) {
    return payload.data
  }

  return []
}

const getRegistrantName = registration =>
  registration?.full_name ||
  registration?.name ||
  registration?.student_name ||
  registration?.student?.name ||
  'Unnamed Registrant'

const getRegistrantEmail = registration =>
  registration?.email ||
  registration?.student_email ||
  registration?.student?.email ||
  'No email provided'

export default function EventRegistrations() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const location = useLocation()
  const { eventId } = useParams()
  const event = location.state?.event
  const committeeId = localStorage.getItem('committeeId')

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await getEventRegistrations(eventId)
        setRegistrations(normalizeRegistrations(response))
      } catch (fetchError) {
        console.error(fetchError)
        setError('Failed to load event registrations')
        setRegistrations([])
      } finally {
        setLoading(false)
      }
    }

    if (!eventId) {
      setError('Event ID not found')
      setLoading(false)
      return
    }

    fetchRegistrations()
  }, [eventId])

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <CommitteeSidebar />
      <TopBar
        sidebar="committee"
        placeholder="Search registrations..."
        userName="Committee Lead"
        userRole="Registration Management"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBlnMwMiijKv4SJYQ2_QLTHTAtBMGIIcsK_eIZFsEjO22G7PNZNaEemJvklXWhRzpTu7BbQdL3IS8dKkSEVZXMtLYv0tV_z3EwtyGj86ss0fDXNlY5J9Oe7kwgRs5Q0H1pbzlOMduQGuWiwtoYGWa1QKvqkRdfBRI7hILUxI1FLP05GSkj77_bLGakapEmdHcNzlf7T7Ju6lPSMIux-6N5yEBzkN5K_uc11oPeQV67J4pDbaEU1QrCT2SscFxRQ5LPiwjNDhmv3Acg"
        actions={['notifications']}
      />

      <main className="px-4 pb-12 pt-24 lg:ml-64 lg:p-10 lg:pt-24">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,rgba(85,69,206,0.96),rgba(244,114,182,0.88))] p-8 text-white shadow-[0_25px_70px_rgba(85,69,206,0.22)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">
                Event Registrations
              </p>
              <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
                {event?.event_name || 'Event Registration List'}
              </h1>
              <p className="mt-3 text-lg text-white/90">
                Review everyone who has signed up for this event in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(committeeId ? `/committee/${committeeId}/events` : '/committee-dashboard')}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-on-surface transition-transform hover:scale-[1.02]"
            >
              Back to Events
            </button>
          </div>
        </section>

        {loading ? (
          <section className="mt-8 rounded-[28px] bg-white p-8 shadow-sm">
            <p className="text-sm text-on-surface-variant">Loading registrations...</p>
          </section>
        ) : null}

        {!loading && error ? (
          <section className="mt-8 rounded-[28px] bg-rose-50 p-8 shadow-sm">
            <p className="text-sm font-medium text-rose-600">{error}</p>
          </section>
        ) : null}

        {!loading && !error && registrations.length === 0 ? (
          <section className="mt-8 rounded-[28px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-on-surface">No registrations yet</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              This event does not have any registrations at the moment.
            </p>
          </section>
        ) : null}

        {!loading && !error && registrations.length > 0 ? (
          <section className="mt-8 grid gap-4">
            {registrations.map((registration, index) => (
              <article
                key={registration?.id || registration?._id || registration?.studentId || index}
                className="rounded-[28px] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-on-surface">{getRegistrantName(registration)}</h2>
                    <p className="mt-1 text-sm text-on-surface-variant">{getRegistrantEmail(registration)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-medium text-on-surface-variant">
                    {registration?.sap_id ? (
                      <span className="rounded-full bg-surface-container-low px-3 py-1">
                        SAP: {registration.sap_id}
                      </span>
                    ) : null}
                    {registration?.createdAt || registration?.registered_at ? (
                      <span className="rounded-full bg-surface-container-low px-3 py-1">
                        Registered: {new Date(registration.createdAt || registration.registered_at).toLocaleDateString()}
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </main>
    </div>
  )
}
