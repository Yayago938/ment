import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'
import MaterialIcon from '../components/MaterialIcon'
import { getAllCommittees } from '../api/committeeApi'
import { getAllEvents } from '../api/eventApi'

const eventPlaceholderImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQoHpehiKE_8jtjAeiCbS_7HhSNmL4R0ASx1jSsupX2yUaQyunhAc2lkwtIT1rPeSiITzX1ao1XaW_wVNwsJ6wL4NgxvcIiSeMhrGO5zTisomoTyFfVeuj6-Ed_mHX4CmXzVW3qx6I-kDVm4VerdWQuGodAHJEFmPuCfny4WTAlUrlzH6NsHPtMOpOmRFLcCkJIzEq68tiNI2JCoMjJ1EwFUCkSTB2tqIp96tBMnSzfTrq2CDWUt9FOJpAEMmeiVqSw35McDy7GDw'
const clubPlaceholderImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAr8B3ozE7cUv05pzf39yYsPgyGHSHng2GZVwGVtS_700XAocmhrzqZiqmY0PyiS0nghe3e1HkcfvxXvqHEWPO5hCsMDgjESOr8o4XbsxNK2F0kghNtCG60D-4VWT3ongYMnc5tUHUSZQfRUOxCXWyHy23PQo8EJOwsv0BfaQ1AIsugqbR9Z53-W-HzT6CceH2OAfgoEMsDIZQQapdZaWnCzrdybOPQUCkb62dVPYETUHLRkon-MZ4eabrfY6MUHJfxiM8WRTDG9kc',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC79A9r23mQ8Y8Q9_p352ZddEBPiLfUS7NiN4iA53ZE5huv0Tzh73AHLNX-brNFdfocVdgxpcettotPsiKLm-rx-MeBFFdjDob6zBSxVqnp5y6Qfvle-9Z13UZ_KWwJUJN-uMu-Wy6Utz3vp3Kv_GnsOyRTgE2LBZBE-RQowuLTMMwWSwSAa-_f0BqLjTkS3OXFR3Lw8FB8Wj8L8Fq95inbXOd1WP9GQnjao5OO-LxBiPyUHnIKFjNpvK71gEM6fnAbZKy4f_RqZXI',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAIoLknvjDyQealNvWoteyconRoa7EJru_Bu7vttrR-ibaUrKjWlzXDZkI-TGJ11fbT1h3dwIHXmSfTvTzD7U-n_INhtH4ax1wWqnDTu_TggeLLVpF2NQHyqnJXoDIBBrmBpn1r6gn5-SoLoRY7Mk-DxwzYy9Ak9GfsCHZ38c0Ajy7RplUo1eJmjqx_e9odA-9tKO285vGyUSVsHueAZ3KdeAszy-Tbkj3pY8mw4jBoA1jIIcwKeUTMubUvMWwTecESS1SposCAX_Y',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBDMrjwQ0GErY5RoubU0LMIWzjQKuG6gGk0k7GKXGQm6heF8j2poVeDhWq4qmMlJjKnpdZou02pp34P4p8Q_c81MolUL6gQNyjhleOMYjgDljn_H3N-XbenrsUoaQ8OoLpQTmGhF0oa1-_COQtENepbsDRR-c3G324YLkP9dxpqq-K1-mDEzfAz1U0fFRfXxxyAL_SbBMainXsIuhjkF05TEGJW9Zum1FWEEi2KzXZ6VXazR1okqDDa59xKNUkAIiIUyqYS8mqB0Jc',
]

const applicationRows = [
  ['Summer SDE Intern - Google', 'Internship', 'Sep 28, 2023', 'In Review', 'Assessment Email', 'terminal', 'bg-primary/10 text-primary', 'bg-primary-fixed text-on-primary-fixed-variant'],
  ['Product Design Co-op', 'Co-op', 'Oct 01, 2023', 'Interviewing', 'Technical Round', 'brush', 'bg-secondary/10 text-secondary', 'bg-secondary-fixed text-on-secondary-fixed-variant'],
  ['Research Assistant', 'Academic', 'Oct 05, 2023', 'Submitted', 'Wait for review', 'science', 'bg-tertiary-fixed/40 text-tertiary', 'bg-surface-container-high text-on-surface-variant'],
]

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

const normalizeCommittees = response => {
  if (Array.isArray(response)) {
    return response
  }

  if (Array.isArray(response?.data)) {
    return response.data
  }

  if (Array.isArray(response?.committees)) {
    return response.committees
  }

  return []
}

export default function StudentDashboard() {
  const [events, setEvents] = useState([])
  const [committees, setCommittees] = useState([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [loadingCommittees, setLoadingCommittees] = useState(true)
  const [dashboardError, setDashboardError] = useState('')
  const userName = localStorage.getItem('userName') || 'Student'

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
        const committeesRaw = normalizeCommittees(committeesRes)
        const safeEvents = Array.isArray(eventsRaw) ? eventsRaw : []
        const safeCommittees = Array.isArray(committeesRaw) ? committeesRaw : []

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

  const mappedEvents = events.slice(0, 3).map((event, index) => {
    const formattedDate = formatEventDate(event)
    const tones = [
      'bg-secondary-fixed text-on-secondary-fixed',
      'bg-primary-fixed text-on-primary-fixed',
      'bg-tertiary-fixed text-on-tertiary-fixed',
    ]

    return {
      id: event.id,
      title: event.event_name || 'Untitled Event',
      detail: event.description || 'No description available',
      month: formattedDate.month,
      day: formattedDate.day,
      dateLabel: formattedDate.dateLabel,
      bg: tones[index % tones.length],
      to: '/events/portfolio-review',
    }
  })

  const featuredEvent = events[0]
    ? {
        title: events[0].event_name || 'Untitled Event',
        detail: events[0].description || 'No description available',
        dateLabel: formatEventDate(events[0]).dateLabel,
        image: events[0].image || events[0].event_image || eventPlaceholderImage,
      }
    : {
        title: 'Annual Tech Symposium 2024',
        detail: 'Join industry leaders from Silicon Valley and top researchers for a 2-day immersive experience on the future of AI and ethical engineering.',
        dateLabel: 'Upcoming',
        image: eventPlaceholderImage,
      }

  const mappedCommittees = committees.slice(0, 4).map((committee, index) => ({
    id: committee.id,
    title: committee.committee_name || 'Committee',
    subtitle: committee.tagline || 'Campus Committee',
    description: committee.description || '',
    image: committee.image || committee.committee_image || clubPlaceholderImages[index % clubPlaceholderImages.length],
    to: committee.id ? `/committee-detail/${committee.id}` : '/committee-detail',
  }))

  const stats = [
    { icon: 'pending_actions', label: 'Active Applications', value: '12', tone: 'text-primary bg-primary/10' },
    { icon: 'calendar_month', label: 'Upcoming Events', value: String(events.length).padStart(2, '0'), tone: 'text-secondary bg-secondary/10' },
    { icon: 'bookmarks', label: 'Saved Opportunities', value: '28', tone: 'text-tertiary bg-tertiary-fixed/40' },
  ]

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
        <section className="hero-gradient editorial-shadow relative overflow-hidden rounded-[28px] p-8 text-white lg:p-10">
          <div className="relative z-10 max-w-2xl">
            <h1 className="font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">Welcome back, {userName}.</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/90">
              Track applications, explore campus opportunities, and stay updated on upcoming events from your personal dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-full bg-white px-6 py-3 text-sm font-bold text-primary shadow-lg">View Schedule</button>
              <button className="rounded-full border border-white/30 bg-white/20 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm">My Goals</button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-10 h-52 w-52 rounded-full bg-secondary-container/20 blur-2xl" />
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.label} className="editorial-shadow flex items-center gap-5 rounded-[24px] border border-outline-variant/10 bg-white p-6">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.tone}`}>
                <MaterialIcon className="text-3xl">{stat.icon}</MaterialIcon>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">{stat.label}</p>
                <h2 className="mt-1 font-headline text-3xl font-extrabold">{stat.value}</h2>
              </div>
            </article>
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
            <article className="editorial-shadow overflow-hidden rounded-[28px] border border-outline-variant/10 bg-white md:flex">
              <div className="relative md:w-2/5">
                <img className="h-full w-full object-cover" src={featuredEvent.image} alt={featuredEvent.title} />
                <div className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">Featured Event</div>
              </div>
              <div className="p-8 md:w-3/5">
                <h3 className="font-headline text-3xl font-extrabold">{featuredEvent.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                  {featuredEvent.detail}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-surface-container-low px-4 py-2 text-xs font-semibold">{featuredEvent.dateLabel}</span>
                  <span className="rounded-full bg-surface-container-low px-4 py-2 text-xs font-semibold">Grand Hall</span>
                </div>
                <Link to="/events/register" className="mt-8 block w-full rounded-full bg-primary py-3 text-center text-sm font-bold text-white">
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
                <Link
                  key={event.id || event.title}
                  to={event.to}
                  className="editorial-shadow flex items-center gap-4 rounded-[24px] border border-outline-variant/10 bg-white p-4 transition-transform hover:translate-x-1"
                >
                  <div className={`flex h-16 w-16 flex-col items-center justify-center rounded-2xl ${event.bg}`}>
                    <span className="text-xs font-bold uppercase">{event.month}</span>
                    <span className="font-headline text-xl font-extrabold">{event.day}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="text-xs text-on-surface-variant">{event.detail}</p>
                  </div>
                  <MaterialIcon className="text-outline">chevron_right</MaterialIcon>
                </Link>
              ))}

              {!loadingEvents && mappedEvents.length === 0 && (
                <p className="text-sm text-on-surface-variant">No upcoming events available.</p>
              )}
            </div>
          </div>
        </section>

        <section id="clubs" className="mt-12">
          <h2 className="font-headline text-2xl font-bold">Recommended Clubs</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {loadingCommittees && (
              <p className="text-sm text-on-surface-variant">Loading clubs...</p>
            )}

            {!loadingCommittees && mappedCommittees.map((club) => (
              <article key={club.id || club.title} className="editorial-shadow rounded-[28px] border border-outline-variant/10 bg-white p-6 text-center transition-transform hover:scale-[1.02]">
                <div className="mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full ring-4 ring-white">
                  <img className="h-full w-full object-cover" src={club.image} alt={club.title} />
                </div>
                <h3 className="font-headline text-lg font-bold">{club.title}</h3>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.24em] text-primary">{club.subtitle}</p>
                <Link
                  to={club.to}
                  className="mt-5 block w-full rounded-full border border-primary/20 py-2 text-center text-xs font-bold text-primary transition-colors hover:bg-primary/5"
                >
                  Join Club
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
          <div className="editorial-shadow mt-6 overflow-hidden rounded-[28px] border border-outline-variant/10 bg-white">
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
                  {applicationRows.map(([title, type, date, status, nextStep, icon, iconTone, statusTone]) => (
                    <tr key={title} className="border-t border-surface-container-low hover:bg-surface-container-low/20">
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
                        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${statusTone}`}>{status}</span>
                      </td>
                      <td className="px-8 py-5 text-sm font-medium text-primary">{nextStep}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-surface-container-low/30 p-6 text-center">
              <button className="text-sm font-bold text-primary">View all 12 applications</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
