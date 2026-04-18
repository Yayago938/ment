import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'
import FloatingBackButton from '../components/FloatingBackButton'
import SaveItemButton from '../components/SaveItemButton'
import { getEventById } from '../api/eventApi'
import useSavedEvents from '../hooks/useSavedEvents'

const fallbackPoster = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDclrmqU_6qblCD-kgD4Ty4AzznzU2hGGoWPp8mv4fU01ZCtpJndw2npWIGrIhKUxyexiFmDVy1Q0jZvj6SSiDCOF78AbpuDFmaWJJwYeJWjBZPvjpWuW8sIdMBz-VQTEWmvZtk0RiRLr2sCFywXsqvRdS5vBlIh2Xo1cMaTktBc46g3YNleHFLy0pQy0sclLwzNBzbMN3LzmuN1vzg0wndQFyI_PPCLT0BVFludc2xZ59e0hK-rxXMz_32vueQxS3JdrpKHZosEoI'

const formatDate = value => {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const normalizeQuestions = questions =>
  Array.isArray(questions)
    ? questions.map((question, index) => ({
        id: question?.id || question?._id || `question-${index}`,
        label: typeof question === 'string' ? question : question?.question || question?.label || question?.prompt || `Question ${index + 1}`,
      }))
    : []

const normalizeContacts = contacts =>
  Array.isArray(contacts)
    ? contacts.map((contact, index) => ({
        id: contact?.id || contact?._id || `contact-${index}`,
        label:
          typeof contact === 'string'
            ? contact
            : [contact?.name || contact?.fullName, contact?.email || contact?.phone || contact?.role]
                .filter(Boolean)
                .join(' • ') || 'Point of contact available',
      }))
    : []

export default function EventDetails() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const event = location.state?.event || {}
  const [eventDetails, setEventDetails] = useState(Object.keys(event).length > 0 ? event : null)
  const { pendingEventIds, isEventSaved, toggleSaveEvent } = useSavedEvents()

  const selectedEventId =
    id ||
    event.id ||
    event._id ||
    location.state?.eventId ||
    location.state?.eventPayload?.eventId ||
    location.state?.eventPayload?.id

  useEffect(() => {
    if (!selectedEventId) {
      return
    }

    const loadEvent = async () => {
      try {
        const response = await getEventById(selectedEventId)
        const event =
          response?.data?.data ||
          response?.data?.event ||
          response?.data ||
          response?.event ||
          null
        setEventDetails(event)
      } catch (error) {
        console.error('Failed to load event details:', error)
      }
    }

    loadEvent()
  }, [selectedEventId])

  const eventMeta = useMemo(() => {
    const contacts = normalizeContacts(eventDetails?.point_of_contact)
    const questions = normalizeQuestions(eventDetails?.registration_questions)

    return {
      id: eventDetails?.id || eventDetails?._id || selectedEventId || null,
      title: eventDetails?.event_name || eventDetails?.title || eventDetails?.name || 'Portfolio Review Night',
      description:
        eventDetails?.description ||
        'Step into an evening of collaborative exploration at our premier Portfolio Review Night.',
      tags: Array.isArray(eventDetails?.tags) && eventDetails.tags.length > 0 ? eventDetails.tags : ['Workshop', 'Featured'],
      eventType: eventDetails?.event_type || 'Workshop',
      status: eventDetails?.event_status || 'Featured',
      venue: eventDetails?.venue || eventDetails?.location || eventDetails?.event_location || 'The Glass House, San Francisco',
      dateLabel: formatDate(eventDetails?.event_date) || 'October 24, 2024',
      timeLabel: eventDetails?.event_time || '6:00 PM - 9:30 PM PDT',
      registrationDeadline: formatDate(eventDetails?.registration_deadline) || 'Closes soon',
      requiresRegistration:
        typeof eventDetails?.requires_registration === 'boolean'
          ? eventDetails.requires_registration
          : true,
      poster: eventDetails?.poster_url || fallbackPoster,
      questions,
      contacts,
    }
  }, [eventDetails, selectedEventId])

  const registrationEvent = eventDetails || event

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <StudentSidebar />
      <TopBar
        sidebar="student"
        placeholder="Search events, clubs, or opportunities..."
        userName="Alex Rivera"
        userRole="Explorer"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAICFf55z-CdTc8gQwA4MI1a4IGoNIhxjTw6BMIXZsDRx6NSMCt6Ilak1A4RCMvKXJR9S9Z0awqbNV-ZHzDeNviN91S1aNO7GHP_0GBTEtWadfFNbiUr4PtRFrVJTR92b649zjYYxEY6PD3jA9PP4NPn-CRe40umypDBNOzPj6xDjEjp0HICz3-qkWTdIsxCEXiabcSiLsG2Ow7fxk8ytqQUokTi_SQM0UNslagq5HGkd4ttHvEysuxpnF1RogXZ3g57o2sRE1GiL8"
      />
      <FloatingBackButton fallbackTo="/explore" />

      <main className="px-4 pb-16 pt-24 lg:ml-64 lg:px-10 lg:pt-28">
        <div className="mx-auto max-w-7xl">
          <section className="group relative mb-12 h-[400px] overflow-hidden rounded-[32px] border border-black/5 shadow-[0_32px_64px_rgba(85,69,206,0.14)] transition-all duration-300 ease-out">
            <img className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]" src={eventMeta.poster} alt={eventMeta.title} />
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary-container opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute right-6 top-6 z-20">
              <SaveItemButton
                eventId={eventMeta.id}
                isSaved={isEventSaved(eventMeta.id)}
                disabled={!eventMeta.id || pendingEventIds.has(String(eventMeta.id))}
                onToggle={() => toggleSaveEvent(eventDetails || event)}
              />
            </div>
            <div className="absolute bottom-0 left-0 z-10 w-full p-12">
              <div className="flex flex-wrap gap-2">
                {eventMeta.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="rounded-full border border-white/10 bg-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-sm">
                    {tag}
                  </span>
                ))}
                <span className="rounded-full border border-white/10 bg-secondary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md shadow-sm">
                  {eventMeta.status}
                </span>
              </div>
              <h1 className="font-headline mt-4 text-5xl font-extrabold tracking-tight text-white">{eventMeta.title}</h1>
              <div className="mt-4 flex flex-wrap gap-6 text-white/90">
                <span>{eventMeta.dateLabel}</span>
                <span>{eventMeta.venue}</span>
                <span>{eventMeta.timeLabel}</span>
              </div>
            </div>
          </section>

          <div className="grid gap-12 lg:grid-cols-12">
            <div className="space-y-12 lg:col-span-8">
              <section>
                <h2 className="font-headline text-3xl font-bold text-primary">About the Event</h2>
                <div className="mt-6 space-y-4 text-on-surface-variant">
                  <p className="text-lg">{eventMeta.description}</p>
                  <p>
                    {eventMeta.contacts.length > 0
                      ? `Point of contact: ${eventMeta.contacts[0].label}.`
                      : `Event type: ${eventMeta.eventType}.`}
                  </p>
                  <div className="rounded-[24px] border border-black/5 border-l-4 border-primary bg-surface-container-low p-8 italic shadow-sm">
                    {eventMeta.requiresRegistration
                      ? `Registration deadline: ${eventMeta.registrationDeadline}.`
                      : 'Registration is not required for this event.'}
                  </div>
                </div>
              </section>

              <section className="grid gap-6 md:grid-cols-3">
                {[
                  ['Event Type', eventMeta.eventType || 'Workshop'],
                  ['Status', eventMeta.status || 'Upcoming'],
                  ['Registration', eventMeta.requiresRegistration ? 'Required' : 'Open access'],
                ].map(([label, value]) => (
                  <article key={label} className="rounded-[24px] border border-black/5 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">{label}</p>
                    <h3 className="font-headline mt-4 text-lg font-bold">{value}</h3>
                  </article>
                ))}
              </section>

              {eventMeta.questions.length > 0 ? (
                <section>
                  <h2 className="font-headline text-2xl font-bold">Registration Questions</h2>
                  <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                    <div className="space-y-4">
                      {eventMeta.questions.map(question => (
                        <div key={question.id} className="rounded-[18px] border border-black/5 bg-surface-container-low p-4 text-sm text-on-surface-variant transition-colors duration-200 ease-out hover:bg-primary/5">
                          {question.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="sticky top-28 h-fit space-y-6 lg:col-span-4">
              <article className="rounded-[28px] border border-black/5 bg-white p-8 shadow-[0_20px_40px_rgba(123,110,246,0.10)] transition-all duration-300 ease-out hover:shadow-md">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">Registration Details</span>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-headline text-4xl font-extrabold">{eventMeta.requiresRegistration ? 'Open' : 'Free'}</span>
                  <span className="text-sm text-on-surface-variant">/ access</span>
                </div>
                <div className="mt-8 space-y-5 text-sm">
                  <p>{eventMeta.timeLabel}</p>
                  <p>{eventMeta.venue}</p>
                  <p>{eventMeta.requiresRegistration ? `Deadline: ${eventMeta.registrationDeadline}` : 'No registration required'}</p>
                  <p className="font-semibold text-error">{eventMeta.status}</p>
                </div>
                {eventMeta.contacts.length > 0 ? (
                  <div className="mt-6 rounded-[20px] border border-black/5 bg-surface-container-low p-4 text-sm text-on-surface-variant shadow-sm">
                    {eventMeta.contacts.slice(0, 2).map(contact => (
                      <p key={contact.id} className="mt-2 first:mt-0">{contact.label}</p>
                    ))}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/events/${eventMeta.id}/register`, {
                      state: { event: registrationEvent },
                    })
                  }
                  className="mt-8 block w-full rounded-full bg-gradient-to-br from-[#7B6EF6] to-[#F6A6C1] px-8 py-5 text-center text-lg font-bold text-white shadow-lg transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl active:scale-[0.99]"
                >
                  Register Now
                </button>
              </article>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
