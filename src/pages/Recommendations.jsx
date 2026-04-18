import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'
import { getAllCommittees } from '../api/committeeApi'
import { getAllEvents } from '../api/eventApi'

const INTEREST_KEYWORDS = {
  'AI/ML': ['ai', 'ml', 'machine learning', 'code', 'coding', 'developer', 'tech', 'innovation'],
  'Web Development': ['web', 'frontend', 'backend', 'code', 'developer', 'software', 'tech'],
  'App Development': ['app', 'mobile', 'android', 'ios', 'developer', 'software', 'tech'],
  'UI/UX Design': ['design', 'ux', 'ui', 'creative', 'visual', 'product'],
  Fintech: ['finance', 'fintech', 'economy', 'business', 'startup'],
  'Creative Arts': ['art', 'creative', 'cultural', 'festival', 'music', 'drama', 'dance', 'visual'],
  'Event Management': ['event', 'fest', 'management', 'organize', 'cultural'],
  Entrepreneurship: ['startup', 'business', 'innovation', 'leadership'],
  Research: ['research', 'innovation', 'science', 'academic', 'technology'],
  'Public Speaking': ['speaker', 'communication', 'host', 'public', 'debate', 'stage'],
}

const clubTones = [
  'bg-primary-fixed text-primary',
  'bg-secondary-fixed text-secondary',
  'bg-tertiary-fixed text-tertiary',
  'bg-primary-fixed text-primary',
  'bg-secondary-fixed text-secondary',
  'bg-tertiary-fixed text-tertiary',
]

const clubIcons = ['groups', 'terminal', 'palette', 'rocket_launch', 'campaign', 'science']
const eventTones = ['bg-primary-fixed text-primary', 'bg-secondary-fixed text-secondary', 'bg-tertiary-fixed text-tertiary']

const getStoredInterests = () => JSON.parse(localStorage.getItem('studentInterests') || '[]')
const getStoredEventPreferences = () => JSON.parse(localStorage.getItem('studentEventPreferences') || '[]')

const normalizeEvents = response => {
  const raw = response?.data?.data || response?.data?.events || response?.data || response?.events || []
  return Array.isArray(raw) ? raw : []
}

const normalizeEventId = event => event?.id || event?._id || event?.eventId || event?.event_id || null

const formatEventDate = value => {
  if (!value) {
    return 'Date to be announced'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

const scoreCommittee = (committee, interests) => {
  const searchableText = `${committee?.name || committee?.committee_name || ''} ${committee?.tagline || ''} ${committee?.description || ''}`.toLowerCase()

  return interests.reduce((score, interest) => {
    const keywords = INTEREST_KEYWORDS[interest] || []
    return score + keywords.reduce((count, keyword) => count + (searchableText.includes(keyword) ? 1 : 0), 0)
  }, 0)
}

const scoreEvent = (event, selectedTags) => {
  const eventTags = Array.isArray(event?.tags)
    ? event.tags.map(tag => String(tag || '').trim().toLowerCase()).filter(Boolean)
    : []
  const normalizedSelections = selectedTags.map(tag => String(tag || '').trim().toLowerCase())
  const searchableText = `${event?.event_name || event?.title || event?.name || ''} ${event?.description || ''}`.toLowerCase()

  return normalizedSelections.reduce((score, tag) => {
    let nextScore = score

    if (eventTags.includes(tag)) {
      nextScore += 2
    }

    if (searchableText.includes(tag)) {
      nextScore += 1
    }

    return nextScore
  }, 0)
}

const sortUpcomingEvents = events => [...events].sort((left, right) => {
  const leftTime = new Date(left?.event_date || left?.date || left?.startDate || left?.start_date || 0).getTime()
  const rightTime = new Date(right?.event_date || right?.date || right?.startDate || right?.start_date || 0).getTime()
  return leftTime - rightTime
})

export default function Recommendations() {
  const [committees, setCommittees] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const userName = localStorage.getItem('userName') || 'Student'
  const selectedInterests = useMemo(getStoredInterests, [])
  const selectedEventPreferences = useMemo(getStoredEventPreferences, [])

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true)

      try {
        const [committeesRes, eventsRes] = await Promise.all([
          getAllCommittees(),
          getAllEvents(),
        ])

        setCommittees(Array.isArray(committeesRes) ? committeesRes : [])
        setEvents(normalizeEvents(eventsRes))
      } catch (error) {
        console.error('Failed to load recommendations:', error)
        setCommittees([])
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    loadRecommendations()
  }, [])

  const recommendedClubs = useMemo(() => {
    const scored = committees
      .map((committee, index) => ({
        committee,
        score: scoreCommittee(committee, selectedInterests),
        tone: clubTones[index % clubTones.length],
        icon: clubIcons[index % clubIcons.length],
      }))
      .sort((left, right) => right.score - left.score)

    const meaningfulMatches = scored.filter(item => item.score > 0).slice(0, 6)

    if (meaningfulMatches.length > 0) {
      return meaningfulMatches
    }

    return scored.slice(0, 3)
  }, [committees, selectedInterests])

  const recommendedEvents = useMemo(() => {
    const upcomingEvents = sortUpcomingEvents(events)
    const scored = upcomingEvents
      .map((event, index) => ({
        event,
        score: scoreEvent(event, selectedEventPreferences),
        tone: eventTones[index % eventTones.length],
      }))
      .sort((left, right) => right.score - left.score)

    const meaningfulMatches = scored.filter(item => item.score > 0).slice(0, 6)

    if (meaningfulMatches.length > 0) {
      return meaningfulMatches
    }

    return scored.slice(0, 3)
  }, [events, selectedEventPreferences])

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <StudentSidebar />
      <TopBar
        sidebar="student"
        placeholder="Search people, skills, or clubs..."
        userName={userName}
        userRole="Student"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuA_e5YA48CeTVgUXixdFT304tZ_oOiojwLHPErCcZ3hskrWzT9yKGz1vmD67nrSlMQYNis34dlwn0I6mS2mS_CCO-dDnQKnRd6jHuokefySQPPkLml1BlazdAWPw8yleusjtgvXFusjHqS6qygN7YrIYz4Gm00jzdzfjAM-OCByjDEsaXqrEZAIJZKKn_9OxLpmAAjH7WkFI6qAO5qVJoLPjSX9djhRe6BhT-GB_Ru1PocZSHRbIy3D-KePqcDHaqlg4s7wXPU5JHQ"
        actions={[]}
      />

      <main className="px-4 pb-16 pt-24 lg:ml-64 lg:p-12 lg:pt-28">
        <section className="mb-16 max-w-6xl">
          <h1 className="font-headline mt-6 text-4xl font-extrabold tracking-tight lg:text-5xl lg:leading-none xl:text-[3.5rem]">
            Your communities and events are ready
          </h1>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/edit-student-profile"
              className="inline-flex rounded-full bg-gradient-to-r from-primary to-secondary-container px-8 py-4 text-sm font-bold text-white shadow-[0_20px_40px_rgba(123,110,246,0.2)]"
            >
              Complete Profile Setup
            </Link>
            <Link
              to="/explore"
              className="inline-flex rounded-full border border-outline-variant/20 bg-white px-8 py-4 text-sm font-bold text-primary"
            >
              Explore More
            </Link>
          </div>
        </section>

        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-headline text-2xl font-bold">Recommended Clubs</h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-secondary-container" />
            </div>
          </div>

          {loading ? (
            <div className="rounded-[28px] bg-white p-8 editorial-shadow">Loading club recommendations...</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recommendedClubs.map(({ committee, tone, icon }) => (
                <article key={committee.id || committee.name} className="rounded-[28px] bg-white p-6 editorial-shadow transition-transform hover:-translate-y-1">
                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${tone}`}>
                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {committee.facultyName ? (
                      <span className="rounded-full bg-primary-fixed px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-on-primary-fixed-variant">
                        {committee.facultyName}
                      </span>
                    ) : null}
                  </div>
                  <h3 className="font-headline mt-4 text-2xl font-bold">{committee.name}</h3>
                  <p className="mt-2 text-sm font-semibold text-primary">{committee.tagline || 'Community for curious students'}</p>
                  <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">{committee.description}</p>
                  <Link
                    to={committee.id ? `/committee-detail/${committee.id}` : '/committee-detail'}
                    className="mt-6 block w-full rounded-full bg-surface-container-low py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary-fixed"
                  >
                    View Community
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mb-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-headline text-2xl font-bold">Recommended Events</h2>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary-container" />
            </div>
          </div>

          {loading ? (
            <div className="rounded-[28px] bg-white p-8 editorial-shadow">Loading event recommendations...</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recommendedEvents.map(({ event, tone }) => {
                const eventId = normalizeEventId(event)
                const eventTags = Array.isArray(event?.tags) ? event.tags.slice(0, 4) : []

                return (
                  <article key={eventId || event.event_name} className="overflow-hidden rounded-[28px] bg-white editorial-shadow transition-transform hover:-translate-y-1">
                    <div className="p-6">
                      <div className={`mb-6 inline-flex rounded-2xl px-4 py-3 text-sm font-bold ${tone}`}>
                        Suggested Event
                      </div>
                      <h3 className="font-headline text-2xl font-bold">{event?.event_name || event?.title || event?.name || 'Untitled Event'}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-on-surface-variant">
                        {event?.description || 'No description available.'}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {eventTags.map(tag => (
                          <span key={tag} className="rounded-full bg-surface-container-low px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-6 space-y-2 text-sm text-on-surface-variant">
                        <p>{formatEventDate(event?.event_date || event?.date || event?.startDate || event?.start_date)}</p>
                        <p>{event?.venue || event?.location || event?.event_location || 'Venue to be announced'}</p>
                      </div>
                      <Link
                        to={eventId ? `/events/${eventId}` : '/events/portfolio-review'}
                        state={eventId ? { eventId, event } : undefined}
                        className="mt-6 block w-full rounded-full bg-gradient-to-r from-primary to-secondary-container py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-white"
                      >
                        View Details
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
