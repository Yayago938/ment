import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'
import SaveItemButton from '../components/SaveItemButton'
import { getAllCommittees } from '../api/committeeApi'
import { getAllEvents } from '../api/eventApi'
import { filterCommitteesByTags, searchAll } from '../api/searchApi'

const defaultSpotlight = [
  { id: null, title: 'The Coding Collective', category: 'Tech', memberCount: '1.2k members', description: 'Deep dives into full-stack development and creative engineering practices.', icon: 'code', tone: 'text-primary bg-primary-fixed' },
  { id: null, title: 'Visual Atelier', category: 'Arts', memberCount: '840 members', description: 'Exploring digital minimalism and editorial design for the next generation.', icon: 'palette', tone: 'text-secondary bg-secondary-fixed' },
  { id: null, title: 'Venture Society', category: 'Business', memberCount: '2.1k members', description: 'Nurturing high-impact student startups through mentorship and equity workshops.', icon: 'auto_graph', tone: 'text-tertiary bg-tertiary-fixed' },
]

const defaultEvents = [
  { id: null, month: 'OCT', day: '24', title: 'Global Tech Symposium', description: 'The premier gathering of student innovators.', tone: 'text-primary' },
  { id: null, month: 'NOV', day: '02', title: 'Acoustic Garden Sessions', description: 'An evening of unplugged performances under the willow trees.', tone: 'text-secondary' },
  { id: null, month: 'NOV', day: '15', title: 'Founders Breakfast', description: 'Connect with alumni who launched successful startups.', tone: 'text-tertiary' },
]

const communityIcons = ['code', 'palette', 'auto_graph']
const communityTones = ['text-primary bg-primary-fixed', 'text-secondary bg-secondary-fixed', 'text-tertiary bg-tertiary-fixed']
const eventTones = ['text-primary', 'text-secondary', 'text-tertiary']

const categoryOptions = [
  { label: 'Technology', tags: ['technology', 'tech', 'technical'] },
  { label: 'Business & Law', tags: ['business', 'law', 'business & law'] },
  { label: 'Arts & Culture', tags: ['arts', 'art', 'culture', 'cultural'] },
]

const normalizeCollection = (response, keys = []) => {
  const candidates = [
    response,
    response?.data,
    response?.data?.data,
    response?.data?.results,
    response?.results,
  ]

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
    }

    if (candidate && typeof candidate === 'object') {
      for (const key of keys) {
        if (Array.isArray(candidate[key])) {
          return candidate[key]
        }
      }
    }
  }

  return []
}

const formatMemberCount = value => {
  if (typeof value === 'string' && value.trim()) {
    return value
  }

  const count = Number(value)

  if (!Number.isFinite(count) || count <= 0) {
    return 'Members'
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace('.0', '')}k members`
  }

  return `${count} members`
}

const normalizeCommittee = (committee, index = 0) => ({
  id: committee?.id || committee?._id || committee?.committeeId || committee?.committee_id || null,
  title: committee?.name || committee?.committee_name || committee?.title || 'Committee',
  subtitle: committee?.tagline || committee?.subtitle || '',
  description: committee?.description || 'No description available.',
  category:
    committee?.category ||
    committee?.domain ||
    committee?.committee_type ||
    (Array.isArray(committee?.tags) ? committee.tags[0] : committee?.tags) ||
    'Community',
  memberCount: formatMemberCount(
    committee?.memberCount ||
      committee?.member_count ||
      committee?.membersCount ||
      committee?.members_count ||
      committee?.totalMembers,
  ),
  image: committee?.image || committee?.logo || committee?.committee_image || committee?.profileImage || null,
  icon: communityIcons[index % communityIcons.length],
  tone: communityTones[index % communityTones.length],
})

const parseEventDate = event => {
  if (event?.month && event?.day) {
    return {
      month: event.month,
      day: event.day,
      timestamp: Number.MAX_SAFE_INTEGER,
    }
  }

  const rawDate = event?.event_date || event?.date || event?.startDate || event?.start_date || event?.eventDate

  if (!rawDate) {
    return { month: 'UP', day: '00', timestamp: Number.MAX_SAFE_INTEGER }
  }

  const parsed = new Date(rawDate)

  if (Number.isNaN(parsed.getTime())) {
    return { month: 'UP', day: '00', timestamp: Number.MAX_SAFE_INTEGER }
  }

  return {
    month: parsed.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: parsed.toLocaleDateString('en-US', { day: '2-digit' }),
    timestamp: parsed.getTime(),
  }
}

const normalizeEvent = (event, index = 0) => {
  const parsedDate = parseEventDate(event)

  return {
    id: event?.id || event?._id || event?.eventId || event?.event_id || null,
    title: event?.event_name || event?.title || event?.name || 'Untitled Event',
    description: event?.description || event?.summary || 'No description available.',
    date: event?.event_date || event?.date || event?.startDate || event?.start_date || event?.eventDate || '',
    month: parsedDate.month,
    day: parsedDate.day,
    timestamp: parsedDate.timestamp,
    image: event?.image || event?.event_image || null,
    tone: eventTones[index % eventTones.length],
  }
}

const normalizeSearchResults = response => {
  const directCommittees = normalizeCollection(response, ['committees', 'committeeResults'])
  const directEvents = normalizeCollection(response, ['events', 'eventResults'])

  if (directCommittees.length > 0 || directEvents.length > 0) {
    return { committees: directCommittees, events: directEvents }
  }

  const mixedResults = normalizeCollection(response, ['results', 'items'])
  const committees = mixedResults.filter(item => {
    const type = String(item?.type || item?.entityType || item?.kind || '').toLowerCase()
    return type.includes('committee') || type.includes('community') || item?.committee_name
  })
  const events = mixedResults.filter(item => {
    const type = String(item?.type || item?.entityType || item?.kind || '').toLowerCase()
    return type.includes('event') || item?.event_name
  })

  return { committees, events }
}

export default function ExploreCommunities() {
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCategories, setSelectedCategories] = useState(['Business & Law'])
  const [hasInteractedWithFilters, setHasInteractedWithFilters] = useState(false)
  const [allCommittees, setAllCommittees] = useState(defaultSpotlight)
  const [visibleCommittees, setVisibleCommittees] = useState(defaultSpotlight)
  const [allEvents, setAllEvents] = useState(defaultEvents)
  const [visibleEvents, setVisibleEvents] = useState(defaultEvents)
  const [isLoadingCommunities, setIsLoadingCommunities] = useState(true)
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(searchValue.trim())
    }, 400)

    return () => window.clearTimeout(timeoutId)
  }, [searchValue])

  useEffect(() => {
    const loadExploreData = async () => {
      setIsLoadingCommunities(true)
      setIsLoadingEvents(true)

      try {
        const [committeesResponse, eventsResponse] = await Promise.all([
          getAllCommittees(),
          getAllEvents(),
        ])

        const committees = Array.isArray(committeesResponse) ? committeesResponse : []
        const mappedCommittees = (committees.length > 0 ? committees : defaultSpotlight).map(normalizeCommittee)
        setAllCommittees(mappedCommittees)
        setVisibleCommittees(mappedCommittees)
        const events = normalizeCollection(eventsResponse, ['events'])
        const mappedEvents = (events.length > 0 ? events : defaultEvents)
          .map(normalizeEvent)
          .sort((a, b) => a.timestamp - b.timestamp)
        setAllEvents(mappedEvents)
        setVisibleEvents(mappedEvents)
      } catch (error) {
        console.error('Failed to load Explore data:', error)
      } finally {
        setIsLoadingCommunities(false)
        setIsLoadingEvents(false)
      }
    }

    loadExploreData()
  }, [])

  useEffect(() => {
    if (debouncedSearch === '') {
      setVisibleEvents(allEvents)

      if (selectedCategories.length > 0 && hasInteractedWithFilters) {
        return
      }

      setVisibleCommittees(allCommittees)
      return
    }

    const runSearch = async () => {
      setIsSearching(true)

      try {
        const response = await searchAll(debouncedSearch)
        const results = normalizeSearchResults(response)
        const committees = results.committees.map(normalizeCommittee)
        const events = results.events
          .map(normalizeEvent)
          .sort((a, b) => a.timestamp - b.timestamp)

        setVisibleCommittees(committees)
        setVisibleEvents(events)
      } catch (error) {
        console.error('Explore search failed:', error)
      } finally {
        setIsSearching(false)
      }
    }

    runSearch()
  }, [allCommittees, allEvents, debouncedSearch, hasInteractedWithFilters, selectedCategories.length])

  useEffect(() => {
    if (!hasInteractedWithFilters || debouncedSearch !== '') {
      return
    }

    if (selectedCategories.length === 0) {
      setVisibleCommittees(allCommittees)
      return
    }

    const runFilter = async () => {
      try {
        const tags = selectedCategories.flatMap(label => {
          const option = categoryOptions.find(item => item.label === label)
          return option ? option.tags : [label]
        })

        const response = await filterCommitteesByTags(tags)
        const filteredCommittees = normalizeCollection(response, ['committees']).map(normalizeCommittee)
        setVisibleCommittees(filteredCommittees)
      } catch (error) {
        console.error('Committee filter failed:', error)
      }
    }

    runFilter()
  }, [allCommittees, debouncedSearch, hasInteractedWithFilters, selectedCategories])

  const spotlightCommunities = useMemo(
    () => visibleCommittees.slice(0, defaultSpotlight.length).map((club, index) => ({
      ...club,
      icon: club.icon || communityIcons[index % communityIcons.length],
      tone: club.tone || communityTones[index % communityTones.length],
    })),
    [visibleCommittees],
  )

  const upcomingEvents = useMemo(
    () => visibleEvents.slice(0, defaultEvents.length).map((event, index) => ({
      ...event,
      tone: event.tone || eventTones[index % eventTones.length],
    })),
    [visibleEvents],
  )

  const handleCategoryChange = label => event => {
    setHasInteractedWithFilters(true)
    setSelectedCategories(current =>
      event.target.checked
        ? Array.from(new Set([...current, label]))
        : current.filter(item => item !== label),
    )
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <StudentSidebar />
      <TopBar
        sidebar="student"
        placeholder="Search clubs, events, or opportunities..."
        searchValue={searchValue}
        onSearchChange={event => setSearchValue(event.target.value)}
      />

      <main className="px-4 pb-12 pt-24 lg:ml-64 lg:px-8 lg:pt-28">
        <div className="mx-auto flex max-w-[1440px] gap-8">
          <div className="flex-1 space-y-10">
            <header className="relative overflow-hidden rounded-[28px] border border-outline-variant/10 bg-white px-6 py-5 shadow-[0_20px_40px_rgba(123,110,246,0.04)] lg:px-8 lg:py-6">
              <div className="relative z-10 max-w-3xl">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Search</span>
                <h1 className="font-headline mt-2 text-3xl font-extrabold tracking-tight lg:text-4xl">Discover Clubs & Communities</h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-on-surface-variant lg:text-base">Browse campus communities and events with the search bar above.</p>
              </div>
              <div className="absolute -bottom-16 -right-12 h-40 w-40 rounded-full bg-primary-fixed/30 blur-3xl" />
            </header>

            <section>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Curation</span>
                <h2 className="font-headline mt-2 text-3xl font-bold">Spotlight Communities</h2>
                {isLoadingCommunities || isSearching ? (
                  <p className="mt-3 text-sm text-on-surface-variant">
                    {isSearching ? 'Searching communities...' : 'Loading communities...'}
                  </p>
                ) : null}
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {spotlightCommunities.map((club) => (
                  <article key={club.id || club.title} className="relative rounded-[24px] border border-outline-variant/10 bg-white p-8 transition-all hover:shadow-xl">
                    <div className="absolute right-6 top-6">
                      <SaveItemButton itemKey={`committee:${club.id || club.title}`} className="h-9 w-9 bg-surface-container-low shadow-none" iconClassName="text-[18px]" />
                    </div>
                    <Link to={club.id ? `/committee-detail/${club.id}` : '/committee-detail'} className="block">
                      <div className="mb-6 flex items-start justify-between">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${club.tone}`}>
                          <span className="material-symbols-outlined scale-125">{club.icon}</span>
                        </div>
                        <span className="rounded-full bg-surface-container-low px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">{club.category}</span>
                      </div>
                      <h3 className="font-headline text-xl font-bold">{club.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{club.description}</p>
                      <div className="mt-6 flex items-center justify-between border-t border-outline-variant/10 pt-6">
                        <span className="text-xs font-bold text-on-surface-variant">{club.memberCount}</span>
                        <span className="material-symbols-outlined text-outline-variant">arrow_forward</span>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-headline mb-8 text-3xl font-bold">Upcoming Events</h2>
              {(isLoadingEvents || isSearching) ? (
                <p className="mb-8 text-sm text-on-surface-variant">
                  {isSearching ? 'Searching events...' : 'Loading events...'}
                </p>
              ) : null}
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <article key={event.id || event.title} className="relative overflow-hidden rounded-[24px] border border-outline-variant/10 bg-white">
                    <div className="absolute right-4 top-4 z-10">
                      <SaveItemButton itemKey={`event:${event.id || event.title}`} className="h-9 w-9 bg-white shadow-none" iconClassName="text-[18px]" />
                    </div>
                    <div className="relative h-56 bg-surface-container-low">
                      <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-1.5 text-center shadow-lg">
                        <span className="block text-xs font-bold leading-none">{event.month}</span>
                        <span className={`text-lg font-extrabold leading-none ${event.tone}`}>{event.day}</span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="font-headline text-xl font-bold">{event.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{event.description}</p>
                      <Link
                        to={event.id ? `/events/${event.id}` : '/events/portfolio-review'}
                        state={event.id ? { eventId: event.id } : undefined}
                        className={`mt-8 inline-flex items-center gap-2 text-sm font-bold ${event.tone}`}
                      >
                        View Details
                        <span className="material-symbols-outlined">arrow_right_alt</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
