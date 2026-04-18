import { Link } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'
import MaterialIcon from '../components/MaterialIcon'
import SaveItemButton from '../components/SaveItemButton'
import ScheduleCalendarModal from '../components/ScheduleCalendarModal'
import GlassBlobCard from '../components/GlassBlobCard'
import api from '../api/axios'
import { getAllCommittees } from '../api/committeeApi'
import { getAllEvents } from '../api/eventApi'
import interviewApi from '../api/interviewApi'
import useSavedEvents from '../hooks/useSavedEvents'

const eventPlaceholderImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQoHpehiKE_8jtjAeiCbS_7HhSNmL4R0ASx1jSsupX2yUaQyunhAc2lkwtIT1rPeSiITzX1ao1XaW_wVNwsJ6wL4NgxvcIiSeMhrGO5zTisomoTyFfVeuj6-Ed_mHX4CmXzVW3qx6I-kDVm4VerdWQuGodAHJEFmPuCfny4WTAlUrlzH6NsHPtMOpOmRFLcCkJIzEq68tiNI2JCoMjJ1EwFUCkSTB2tqIp96tBMnSzfTrq2CDWUt9FOJpAEMmeiVqSw35McDy7GDw'
const clubPlaceholderImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAr8B3ozE7cUv05pzf39yYsPgyGHSHng2GZVwGVtS_700XAocmhrzqZiqmY0PyiS0nghe3e1HkcfvxXvqHEWPO5hCsMDgjESOr8o4XbsxNK2F0kghNtCG60D-4VWT3ongYMnc5tUHUSZQfRUOxCXWyHy23PQo8EJOwsv0BfaQ1AIsugqbR9Z53-W-HzT6CceH2OAfgoEMsDIZQQapdZaWnCzrdybOPQUCkb62dVPYETUHLRkon-MZ4eabrfY6MUHJfxiM8WRTDG9kc',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC79A9r23mQ8Y8Q9_p352ZddEBPiLfUS7NiN4iA53ZE5huv0Tzh73AHLNX-brNFdfocVdgxpcettotPsiKLm-rx-MeBFFdjDob6zBSxVqnp5y6Qfvle-9Z13UZ_KWwJUJN-uMu-Wy6Utz3vp3Kv_GnsOyRTgE2LBZBE-RQowuLTMMwWSwSAa-_f0BqLjTkS3OXFR3Lw8FB8Wj8L8Fq95inbXOd1WP9GQnjao5OO-LxBiPyUHnIKFjNpvK71gEM6fnAbZKy4f_RqZXI',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAIoLknvjDyQealNvWoteyconRoa7EJru_Bu7vttrR-ibaUrKjWlzXDZkI-TGJ11fbT1h3dwIHXmSfTvTzD7U-n_INhtH4ax1wWqnDTu_TggeLLVpF2NQHyqnJXoDIBBrmBpn1r6gn5-SoLoRY7Mk-DxwzYy9Ak9GfsCHZ38c0Ajy7RplUo1eJmjqx_e9odA-9tKO285vGyUSVsHueAZ3KdeAszy-Tbkj3pY8mw4jBoA1jIIcwKeUTMubUvMWwTecESS1SposCAX_Y',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBDMrjwQ0GErY5RoubU0LMIWzjQKuG6gGk0k7GKXGQm6heF8j2poVeDhWq4qmMlJjKnpdZou02pp34P4p8Q_c81MolUL6gQNyjhleOMYjgDljn_H3N-XbenrsUoaQ8OoLpQTmGhF0oa1-_COQtENepbsDRR-c3G324YLkP9dxpqq-K1-mDEzfAz1U0fFRfXxxyAL_SbBMainXsIuhjkF05TEGJW9Zum1FWEEi2KzXZ6VXazR1okqDDa59xKNUkAIiIUyqYS8mqB0Jc',
]

const opportunityApplicationRoutes = studentId => ([
  studentId ? `/events/registration/student/${studentId}` : null,
  '/events/registration/my-applications',
]).filter(Boolean)

const activeStatuses = new Set([
  'APPLIED',
  'SUBMITTED',
  'IN REVIEW',
  'IN_REVIEW',
  'REVIEWING',
  'INTERVIEWING',
  'UNDER REVIEW',
  'SHORTLISTED',
  'PENDING',
  'REVIEWED',
])

const formatEventDate = event => {
  const rawDate = event.event_date || event.date || event.startDate || event.start_date

  if (!rawDate) {
    return {
      month: 'UP',
      day: '00',
      dateLabel: 'Upcoming',
    }
  }

  const parsedDate = new Date(rawDate)

  if (Number.isNaN(parsedDate.getTime())) {
    return {
      month: 'UP',
      day: '00',
      dateLabel: 'Upcoming',
    }
  }

  return {
    month: parsedDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: parsedDate.toLocaleDateString('en-US', { day: '2-digit' }),
    dateLabel: parsedDate.toLocaleDateString(),
  }
}

const formatAppliedDate = value => {
  if (!value) {
    return 'Recently'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

const getSafeDateValue = (...values) => {
  for (const value of values) {
    if (!value) {
      continue
    }

    const parsedDate = new Date(value)

    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString()
    }
  }

  return ''
}

const getEventId = event =>
  event?.id || event?._id || event?.eventId || event?.event_id || null

const normalizeEventSummary = event => ({
  id: getEventId(event),
  title: event?.event_name || event?.title || event?.name || 'Untitled Event',
  description: event?.description || event?.summary || 'No description available',
  venue: event?.venue || event?.location || event?.event_location || 'Venue to be announced',
  eventDate: event?.event_date || event?.date || event?.startDate || event?.start_date || '',
  eventTime: event?.event_time || event?.time || '',
  registrationDeadline: event?.registration_deadline || '',
  requiresRegistration:
    typeof event?.requires_registration === 'boolean'
      ? event.requires_registration
      : Boolean(event?.requiresRegistration),
  image: event?.image_url || event?.image || event?.event_image || null,
})

const getDefaultNextStep = status => {
  switch (String(status || '').toUpperCase()) {
    case 'PENDING':
      return 'Awaiting review'
    case 'REVIEWED':
      return 'Committee review completed'
    case 'ACCEPTED':
      return 'Selected for next round'
    case 'REJECTED':
      return 'Application closed'
    case 'INTERVIEWING':
      return 'Interview round scheduled'
    case 'SHORTLISTED':
      return 'Shortlist announced'
    case 'IN REVIEW':
    case 'IN_REVIEW':
    case 'REVIEWING':
    case 'UNDER REVIEW':
      return 'Under committee review'
    case 'APPLIED':
    case 'SUBMITTED':
      return 'Awaiting update'
    case 'CLOSED':
    case 'WITHDRAWN':
      return 'Application closed'
    default:
      return 'Awaiting update'
  }
}

const getReadableStatus = status => {
  const normalizedStatus = String(status || '').replace(/_/g, ' ').trim()

  if (!normalizedStatus) {
    return 'Submitted'
  }

  return normalizedStatus
    .toLowerCase()
    .replace(/\b\w/g, character => character.toUpperCase())
}

const getApplicationsFromPayload = payload => {
  const candidates = [
    payload,
    payload?.data,
    payload?.data?.data,
    payload?.data?.applications,
    payload?.data?.registrations,
    payload?.applications,
    payload?.registrations,
  ]

  return candidates.find(Array.isArray) || []
}

const normalizeOpportunityApplications = payload => {
  const applications = getApplicationsFromPayload(payload)

  return applications.map(application => {
    const rawType =
      application?.type ||
      application?.event?.type ||
      application?.event?.category ||
      application?.event?.event_type ||
      application?.event?.tag ||
      'Opportunity'
    const rawStatus = application?.status || application?.application_status || 'Submitted'
    const title =
      application?.title ||
      application?.event?.title ||
      application?.event?.name ||
      application?.event?.event_name ||
      'Registered Event'

    return {
      id: application?._id || application?.id || `${title}-${rawStatus}`,
      source: 'opportunity',
      title,
      type: rawType,
      appliedOn: application?.createdAt || application?.created_at || application?.applied_at || application?.updated_at || '',
      status: rawStatus,
      nextStep:
        application?.nextStep ||
        application?.next_step ||
        application?.event?.next_step ||
        application?.event?.nextStep ||
        getDefaultNextStep(rawStatus),
      sortDate: getSafeDateValue(
        application?.updated_at,
        application?.updatedAt,
        application?.createdAt,
        application?.created_at,
        application?.applied_at,
      ),
    }
  })
}

const normalizeInterviewApplications = payload => {
  const applications = getApplicationsFromPayload(payload)

  return applications.map(application => ({
    id: application?.id || application?._id || application?.application_id || `interview-${application?.interview_id}`,
    source: 'interview',
    title: application?.interviews?.title || 'Interview Application',
    type: 'Interview',
    appliedOn: application?.applied_at || application?.updated_at || application?.created_at || '',
    status: application?.status || 'PENDING',
    nextStep: getDefaultNextStep(application?.status),
    sortDate: getSafeDateValue(
      application?.updated_at,
      application?.applied_at,
      application?.created_at,
    ),
  }))
}

const normalizeTableRow = application => {
  const normalizedStatus = String(application?.status || '').toUpperCase().replace(/_/g, ' ').trim()
  const normalizedType = String(application?.type || '').toLowerCase()
  const isInterview = application?.source === 'interview'
  let icon = 'terminal'
  let iconTone = 'bg-primary/10 text-primary'

  if (isInterview) {
    icon = 'groups'
    iconTone = 'bg-secondary/10 text-secondary'
  } else if (normalizedType.includes('design') || normalizedType.includes('co-op') || normalizedType.includes('coop')) {
    icon = 'brush'
    iconTone = 'bg-secondary/10 text-secondary'
  } else if (normalizedType.includes('academic') || normalizedType.includes('research')) {
    icon = 'science'
    iconTone = 'bg-tertiary-fixed/40 text-tertiary'
  }

  let statusLabel = getReadableStatus(application?.status)
  let statusTone = 'bg-surface-container-high text-on-surface-variant'

  if (['PENDING', 'APPLIED', 'SUBMITTED'].includes(normalizedStatus)) {
    statusLabel = 'Submitted'
    statusTone = 'bg-surface-container-high text-on-surface-variant'
  } else if (['REVIEWED', 'IN REVIEW', 'IN_REVIEW', 'REVIEWING', 'UNDER REVIEW'].includes(normalizedStatus)) {
    statusLabel = 'In Review'
    statusTone = 'bg-primary-fixed text-on-primary-fixed-variant'
  } else if (normalizedStatus === 'INTERVIEWING') {
    statusLabel = 'Interviewing'
    statusTone = 'bg-secondary-fixed text-on-secondary-fixed-variant'
  } else if (normalizedStatus === 'SHORTLISTED') {
    statusLabel = 'Shortlisted'
    statusTone = 'bg-secondary-fixed text-on-secondary-fixed-variant'
  } else if (normalizedStatus === 'ACCEPTED') {
    statusLabel = 'Accepted'
    statusTone = 'bg-tertiary-fixed/40 text-tertiary'
  } else if (normalizedStatus === 'REJECTED') {
    statusLabel = 'Rejected'
    statusTone = 'bg-error-container text-on-error-container'
  } else if (normalizedStatus === 'CLOSED' || normalizedStatus === 'WITHDRAWN') {
    statusLabel = 'Closed'
    statusTone = 'bg-error-container text-on-error-container'
  }

  return [
    application?.title || 'Application',
    application?.type || 'Opportunity',
    formatAppliedDate(application?.appliedOn),
    statusLabel,
    application?.nextStep || getDefaultNextStep(application?.status),
    icon,
    iconTone,
    statusTone,
  ]
}

const fetchOpportunityApplications = async studentId => {
  let lastError

  for (const route of opportunityApplicationRoutes(studentId)) {
    try {
      const response = await api.get(route)
      return normalizeOpportunityApplications(response)
    } catch (error) {
      lastError = error
    }
  }

  if (lastError) {
    throw lastError
  }

  return []
}

export default function StudentDashboard() {
  const [events, setEvents] = useState([])
  const [committees, setCommittees] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingCommittees, setLoadingCommittees] = useState(true)
  const [opportunityApplications, setOpportunityApplications] = useState([])
  const [interviewApplications, setInterviewApplications] = useState([])
  const [dashboardError, setDashboardError] = useState('')
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const savedEventsSectionRef = useRef(null)
  const userName = localStorage.getItem('userName') || 'Student'
  const studentId = localStorage.getItem('studentId')
  const {
    savedEvents,
    loading: loadingSavedEvents,
    pendingEventIds,
    isEventSaved,
    toggleSaveEvent,
  } = useSavedEvents()

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoadingEvents(true)
      setLoadingCommittees(true)
      setDashboardError('')

      try {
        const [eventsRes, committeesRes] = await Promise.all([
          getAllEvents(),
          getAllCommittees(),
        ])

        console.log('Student dashboard events response:', eventsRes)
        console.log('Student dashboard committees response:', committeesRes)

        const eventsRaw = eventsRes.data?.data || eventsRes.data?.events || eventsRes.data || []
        const safeEvents = Array.isArray(eventsRaw) ? eventsRaw : []
        const safeCommittees = Array.isArray(committeesRes) ? committeesRes : []

        setEvents(safeEvents)
        setCommittees(safeCommittees)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
        setDashboardError(error.response?.data?.message || 'Failed to load dashboard data.')
      } finally {
        setLoadingEvents(false)
        setLoadingCommittees(false)
      }
    }

    fetchDashboardData()
  }, [])

  useEffect(() => {
    const fetchApplications = async () => {
      const [opportunityResult, interviewResult] = await Promise.allSettled([
        fetchOpportunityApplications(studentId),
        interviewApi.getMyApplications({ page: 1, limit: 10 }),
      ])

      if (opportunityResult.status === 'fulfilled') {
        setOpportunityApplications(Array.isArray(opportunityResult.value) ? opportunityResult.value : [])
      } else {
        console.error('Failed to load student opportunity applications:', opportunityResult.reason)
        setOpportunityApplications([])
      }

      if (interviewResult.status === 'fulfilled') {
        setInterviewApplications(normalizeInterviewApplications(interviewResult.value))
      } else {
        console.error('Failed to load interview applications:', interviewResult.reason)
        setInterviewApplications([])
      }
    }

    fetchApplications()
  }, [studentId])

  const unifiedApplications = useMemo(
    () => [...opportunityApplications, ...interviewApplications]
      .sort((left, right) => {
        const leftTime = left?.sortDate ? new Date(left.sortDate).getTime() : 0
        const rightTime = right?.sortDate ? new Date(right.sortDate).getTime() : 0
        return rightTime - leftTime
      }),
    [interviewApplications, opportunityApplications],
  )

  const applicationRows = useMemo(
    () => unifiedApplications
      .slice(0, 5)
      .map(normalizeTableRow),
    [unifiedApplications],
  )

  const activeApplicationsCount = useMemo(
    () => unifiedApplications.filter(application => activeStatuses.has(
      String(application?.status || '').toUpperCase().replace(/_/g, ' ').trim(),
    )).length,
    [unifiedApplications],
  )

  const mappedEvents = events.slice(0, 3).map((event, index) => {
    const formattedDate = formatEventDate(event)
    const tones = [
      'bg-secondary-fixed text-on-secondary-fixed',
      'bg-primary-fixed text-on-primary-fixed',
      'bg-tertiary-fixed text-on-tertiary-fixed',
    ]
    const normalizedEvent = normalizeEventSummary(event)

    return {
      id: normalizedEvent.id,
      title: normalizedEvent.title,
      detail: normalizedEvent.description,
      event: event,
      month: formattedDate.month,
      day: formattedDate.day,
      dateLabel: formattedDate.dateLabel,
      bg: tones[index % tones.length],
      venue: normalizedEvent.venue,
      time: normalizedEvent.eventTime,
      to: normalizedEvent.id ? `/events/${normalizedEvent.id}` : '/events/portfolio-review',
    }
  })

  const featuredEvent = events[0]
    ? (() => {
        const summary = normalizeEventSummary(events[0])

        return {
          ...summary,
          detail: summary.description,
          dateLabel: formatEventDate(events[0]).dateLabel,
          image: summary.image || eventPlaceholderImage,
          raw: events[0],
          fid: summary.id,
        }
      })()
    : {
        title: 'Annual Tech Symposium 2024',
        detail: 'Join industry leaders from Silicon Valley and top researchers for a 2-day immersive experience on the future of AI and ethical engineering.',
        dateLabel: 'Upcoming',
        image: eventPlaceholderImage,
      }

  const mappedCommittees = committees.slice(0, 4).map((committee, index) => ({
    id: committee.id,
    title: committee.name || 'Committee',
    subtitle: committee.tagline || '',
    description: committee.description || '',
    image: committee.image || committee.committee_image || clubPlaceholderImages[index % clubPlaceholderImages.length],
    to: committee.id ? `/committee-detail/${committee.id}` : '/committee-detail',
  }))

  const stats = [
    { icon: 'pending_actions', label: 'Active Applications', value: String(activeApplicationsCount).padStart(2, '0'), tone: 'text-primary bg-primary/10' },
    { icon: 'calendar_month', label: 'Upcoming Events', value: String(events.length).padStart(2, '0'), tone: 'text-secondary bg-secondary/10' },
    { icon: 'bookmarks', label: 'Saved Events', value: String(savedEvents.length).padStart(2, '0'), tone: 'text-tertiary bg-tertiary-fixed/40', action: 'saved-events' },
  ]

  const scheduleItems = useMemo(() => {
    const mergedEvents = [...events, ...savedEvents.map(savedEvent => ({
      id: savedEvent.eventId,
      event_name: savedEvent.event_name,
      description: savedEvent.description,
      venue: savedEvent.venue,
      event_date: savedEvent.event_date,
      event_time: savedEvent.event_time,
      registration_deadline: savedEvent.registration_deadline,
      requires_registration: savedEvent.requires_registration,
    }))].filter((event, index, collection) => {
      const eventId = getEventId(event)
      return collection.findIndex(candidate => String(getEventId(candidate)) === String(eventId)) === index
    })

    const upcomingEvents = mergedEvents.flatMap(event => {
      const eventId = getEventId(event)
      const title = event.event_name || event.title || event.name || 'Untitled Event'
      const venue = event.venue || event.location || event.event_location || 'Venue to be announced'
      const items = []

      if (event.event_date || event.date || event.startDate || event.start_date) {
        items.push({
          id: `${eventId || title}-event`,
          type: 'event',
          date: event.event_date || event.date || event.startDate || event.start_date,
          title,
          subtitle: venue,
        })
      }

      if (event.registration_deadline) {
        items.push({
          id: `${eventId || title}-deadline`,
          type: 'deadline',
          date: event.registration_deadline,
          title,
          subtitle: 'Registration deadline',
        })
      }

      return items
    })

    const interviews = applicationRows.map(([title, , date, status, nextStep]) => ({
      id: `${title}-interview`,
      type: status === 'Interviewing' ? 'interview' : null,
      date,
      title,
      subtitle: nextStep,
    })).filter(item => item.type)

    return [...upcomingEvents, ...interviews]
  }, [applicationRows, events, savedEvents])

  const handleSavedEventsScroll = () => {
    savedEventsSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <StudentSidebar />
      <TopBar
        sidebar="student"
        placeholder="Search clubs, events, or opportunities..."
        userName={userName}
        userRole="Student"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBpnlTjpqYIsCoZ5khwkRrFm8_emkxZGSfsWQtl_6IdianwZU7Za24L8fsTlufqaghErqy1IKVItEGcwE4v5qH6_FQW84epxB0e5AsMJVot1T2rOPtXrH--WUv3MH8k5y6QcDf-L_01oVI6aSLzglmGpr6WYngyOJycmJbFB80AfRa6Y2rBj0qsHZO96vrnNhNrwmw-mDxvN6Np0pn119Ewhv132eUndE6nkNQB6djZUgap2v_dR42L4s-ZkengTiC0pCSn9AqB8_4"
        actions={['school']}
      />

      <main className="px-4 pb-12 pt-24 lg:ml-64 lg:p-8 lg:pt-28">
        <section className="hero-gradient editorial-shadow relative overflow-hidden rounded-[28px] border border-white/10 p-8 text-white shadow-[0_28px_70px_rgba(85,69,206,0.18)] transition-all duration-300 ease-out lg:p-10">
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">Welcome back, {userName}.</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/90">
              Track applications, explore campus opportunities, and stay updated on upcoming events from your personal dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setIsScheduleOpen(true)}
                className="premium-button premium-glow rounded-full bg-white px-6 py-3 text-sm font-bold text-primary shadow-lg transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl active:scale-[0.99]"
              >
                View Schedule
              </button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-52 w-52 rounded-full bg-secondary-container/20 blur-2xl" />
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <GlassBlobCard
              key={stat.label}
              className={`editorial-shadow flex items-center gap-5 border-black/5 p-6 ${stat.action ? 'cursor-pointer' : ''}`}
              interactive={Boolean(stat.action)}
              onClick={stat.action === 'saved-events' ? handleSavedEventsScroll : undefined}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ring-black/5 ${stat.tone}`}>
                <MaterialIcon className="text-3xl">{stat.icon}</MaterialIcon>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">{stat.label}</p>
                <h2 className="mt-1 font-headline text-3xl font-extrabold">{stat.value}</h2>
              </div>
            </GlassBlobCard>
          ))}
        </section>

        {dashboardError && (
          <p className="mt-8 text-sm text-error">{dashboardError}</p>
        )}

        <section className="mt-12 grid gap-8 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-headline text-2xl font-bold">Campus Spotlight</h2>
              <a className="text-sm font-bold text-primary" href="#clubs">Explore all</a>
            </div>
            <article className="premium-card premium-glow group editorial-shadow overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md md:flex">
              <div className="relative overflow-hidden md:w-2/5">
                <img className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]" src={featuredEvent.image} alt={featuredEvent.title} />
                <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm">Featured Event</div>
                <div className="absolute right-4 top-4">
                  <SaveItemButton
                    eventId={featuredEvent.fid}
                    isSaved={isEventSaved(featuredEvent.fid)}
                    disabled={!featuredEvent.fid || pendingEventIds.has(String(featuredEvent.fid))}
                    onToggle={() => toggleSaveEvent(featuredEvent.raw || events[0])}
                    className="bg-white text-on-surface-variant"
                  />
                </div>
              </div>
              <div className="p-8 md:w-3/5">
                <h3 className="font-headline text-3xl font-extrabold">{featuredEvent.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                  {featuredEvent.detail}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-surface-container-low px-4 py-2 text-xs font-semibold">{featuredEvent.dateLabel}</span>
                  <span className="rounded-full bg-surface-container-low px-4 py-2 text-xs font-semibold">{featuredEvent.venue}</span>
                </div>
                <Link
                  to={`/events/${featuredEvent.fid}/register`}
                  state={{ event: featuredEvent }}
                  className="premium-button premium-glow mt-8 block w-full rounded-full bg-primary py-3 text-center text-sm font-bold text-white shadow-sm transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-md active:scale-[0.99]"
                >
                  Register Now
                </Link>
              </div>
            </article>
          </div>

          <div className="xl:col-span-5">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="font-headline text-2xl font-bold">Upcoming Events</h2>
            </div>
            <div className="space-y-4">
                {loadingEvents && (
                  <p className="text-sm text-on-surface-variant">Loading events...</p>
                )}

              {!loadingEvents && mappedEvents.map((event) => (
                <article
                  key={event.id || event.title}
                  className="premium-card premium-glow group editorial-shadow flex items-center gap-4 rounded-[24px] border border-black/5 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-primary/5 hover:shadow-md"
                >
                  <Link
                    to={event.to}
                    state={event.id ? { eventId: event.id } : undefined}
                    className="flex flex-1 items-center gap-4"
                  >
                    <div className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl ring-1 ring-black/5 ${event.bg}`}>
                      <span className="text-xs font-bold uppercase">{event.month}</span>
                      <span className="font-headline text-xl font-extrabold">{event.day}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{event.title}</h3>
                      <p className="text-xs text-on-surface-variant">{event.detail}</p>
                    </div>
                    <MaterialIcon className="text-outline transition-transform duration-300 ease-out group-hover:translate-x-0.5">chevron_right</MaterialIcon>
                  </Link>
                  <SaveItemButton
                    eventId={event.id}
                    isSaved={isEventSaved(event.id)}
                    disabled={!event.id || pendingEventIds.has(String(event.id))}
                    onToggle={() => toggleSaveEvent(event.event)}
                    className="h-9 w-9 bg-surface-container-low shadow-none"
                    iconClassName="text-[18px]"
                  />
                </article>
              ))}

              {!loadingEvents && mappedEvents.length === 0 && (
                <p className="text-sm text-on-surface-variant">No upcoming events available.</p>
              )}
            </div>
          </div>
        </section>

        <section ref={savedEventsSectionRef} className="mt-12 scroll-mt-32">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-headline text-2xl font-bold">Saved Events</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Revisit the events you bookmarked and jump back into details in one place.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSavedEventsScroll}
              className="rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-bold text-primary transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/5"
            >
              Saved Events
            </button>
          </div>

          <div className="space-y-4">
            {loadingSavedEvents && (
              <div className="premium-card rounded-[28px] border border-black/5 bg-white p-6 text-sm text-on-surface-variant shadow-sm">
                Loading saved events...
              </div>
            )}

            {!loadingSavedEvents && savedEvents.length === 0 && (
              <div className="premium-card rounded-[28px] border border-dashed border-black/10 bg-white p-8 shadow-sm">
                <p className="font-semibold text-on-surface">No saved events yet</p>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Bookmark events to quickly access them here.
                </p>
              </div>
            )}

            {!loadingSavedEvents && savedEvents.map(savedEvent => {
              const formattedDate = formatEventDate({ event_date: savedEvent.event_date })

              return (
                <article
                  key={savedEvent.saveId || savedEvent.eventId}
                  className="premium-card premium-glow editorial-shadow rounded-[28px] border border-black/5 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                    <Link
                      to={`/events/${savedEvent.eventId}`}
                      state={{ eventId: savedEvent.eventId, event: savedEvent.raw?.event || savedEvent }}
                      className="flex min-w-0 flex-1 items-start gap-4"
                    >
                      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary-fixed text-on-primary-fixed ring-1 ring-black/5">
                        <span className="text-xs font-bold uppercase">{formattedDate.month}</span>
                        <span className="font-headline text-xl font-extrabold">{formattedDate.day}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-headline text-xl font-bold">{savedEvent.event_name}</h3>
                          {savedEvent.requires_registration && savedEvent.registration_deadline ? (
                            <span className="rounded-full bg-secondary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-fixed">
                              Deadline {formatEventDate({ event_date: savedEvent.registration_deadline }).dateLabel}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
                          {savedEvent.description || 'No description available.'}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-on-surface-variant">
                          <span className="rounded-full bg-surface-container-low px-3 py-2">{formattedDate.dateLabel}</span>
                          {savedEvent.venue ? (
                            <span className="rounded-full bg-surface-container-low px-3 py-2">{savedEvent.venue}</span>
                          ) : null}
                          {savedEvent.event_time ? (
                            <span className="rounded-full bg-surface-container-low px-3 py-2">{savedEvent.event_time}</span>
                          ) : null}
                        </div>
                      </div>
                    </Link>

                    <div className="flex items-center justify-between gap-4 lg:justify-end">
                      <SaveItemButton
                        eventId={savedEvent.eventId}
                        isSaved
                        disabled={pendingEventIds.has(String(savedEvent.eventId))}
                        onToggle={() => toggleSaveEvent(savedEvent.eventId)}
                        className="h-10 w-10 bg-surface-container-low shadow-none"
                        iconClassName="text-[18px]"
                      />
                      <Link
                        to={`/events/${savedEvent.eventId}`}
                        state={{ eventId: savedEvent.eventId, event: savedEvent.raw?.event || savedEvent }}
                        className="inline-flex items-center gap-2 rounded-full border border-primary/15 px-4 py-2 text-sm font-bold text-primary transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/5"
                      >
                        View Details
                        <MaterialIcon className="text-base">arrow_forward</MaterialIcon>
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section id="clubs" className="mt-12">
          <h2 className="font-headline text-2xl font-bold">Recommended Clubs</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {loadingCommittees && (
              <p className="text-sm text-on-surface-variant">Loading clubs...</p>
            )}

            {!loadingCommittees && mappedCommittees.map((club) => (
              <article key={club.id || club.title} className="premium-card premium-glow group editorial-shadow relative rounded-[28px] border border-black/5 bg-white p-6 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md">
                <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full ring-4 ring-white shadow-sm">
                  <img className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]" src={club.image} alt={club.title} />
                </div>
                <h3 className="font-headline text-lg font-bold">{club.title}</h3>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">{club.subtitle}</p>
                <Link
                  to={club.to}
                  className="premium-button premium-glow mt-5 block w-full rounded-full border border-primary/20 py-2 text-center text-xs font-bold text-primary transition-all duration-300 ease-out hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm"
                >
                  View Club
                </Link>
              </article>
            ))}

            {!loadingCommittees && mappedCommittees.length === 0 && (
              <p className="text-sm text-on-surface-variant">No clubs available.</p>
            )}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="font-headline text-2xl font-bold">Application Updates</h2>
          <div className="premium-card editorial-shadow mt-6 overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="bg-surface-container-low/50">
                  <tr>
                    {['Opportunity', 'Type', 'Applied On', 'Status', 'Next Step'].map((heading) => (
                      <th key={heading} className="px-8 py-5 text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applicationRows.length > 0 ? applicationRows.map(([title, type, date, status, nextStep, icon, iconTone, statusTone]) => (
                    <tr key={`${title}-${type}-${date}`} className="border-t border-black/5 transition-colors duration-200 ease-out hover:bg-primary/5">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconTone}`}>
                            <MaterialIcon className="text-lg">{icon}</MaterialIcon>
                          </div>
                          <span className="text-sm font-semibold">{title}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-on-surface-variant">{type}</td>
                      <td className="px-8 py-5 text-sm text-on-surface-variant">{date}</td>
                      <td className="px-8 py-5">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ring-1 ring-black/5 ${statusTone}`}>{status}</span>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-primary">{nextStep}</td>
                    </tr>
                  )) : (
                    <tr className="border-t border-surface-container-low">
                      <td colSpan="5" className="px-8 py-8">
                        <div className="mx-auto flex max-w-md items-start gap-4 rounded-[24px] border border-black/5 bg-surface-container-low/60 p-6 text-left shadow-sm">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary ring-1 ring-black/5">
                            <MaterialIcon>pending_actions</MaterialIcon>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">No application updates yet</p>
                            <p className="mt-1 text-sm text-on-surface-variant">
                              Once you apply to opportunities or interviews, updates will appear here.
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-surface-container-low/30 p-6 text-center">
              <Link to="/applications" className="text-sm font-bold text-primary transition-colors duration-300 ease-out hover:text-primary/80 hover:underline">
                View all {unifiedApplications.length} applications
              </Link>
            </div>
          </div>
        </section>
      </main>
      <ScheduleCalendarModal
        open={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        items={scheduleItems}
      />
    </div>
  )
}
