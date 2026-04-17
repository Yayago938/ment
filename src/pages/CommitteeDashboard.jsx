import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'
import TopBar from '../components/TopBar'
import MaterialIcon from '../components/MaterialIcon'
import {
  getCommitteeById,
  getCommitteeHeads,
  getCommitteeMembers,
} from '../api/committeeApi'
import { getEventsByCommittee } from '../api/eventApi'

const applications = [
  ['Marcus Chen', 'Applied for Visual Lead', 'New', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL9b--ORFPfgorc3Fig7xYN55tVOK91Ow0aEWERsjlwiHj5N8fMiXP5MBP5YLf93ob1ihV1hxfscuGzYnWHihJOuqkN6z53diDqGkTuS2QzuViRP6wExB2JbtApG9n-wP59TLcDiEb2JTcyvAh0_ps0ZmQjyICtLX2vqrPZPaNctuCGc5pjImroNfd0A4bnNIMDzIo6Jg5sB9iCeYi53DpnXSLCp9N8l3c9_5SHc0H7ij_7Il5eYiKW-OC_c07MmAA8No4hAcyJ3g', 'bg-primary-fixed text-on-primary-fixed-variant'],
  ['Elena Soros', 'Applied for UX Research Mentor', 'Reviewing', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFhCHSDagrZXCdbGSFEUbvHHc8Qp7BnsFqW0XtYrQ9gNeoYWC8DqD_9Tp7eZZ-2MfkoFOb7yIMGMA486uU_FC6Eg_7dMQ5z23dcmxdgujiNJotYEA2AuMNfngrZqzs315QT4-kf0A_e-6BnbtJW_fnfsKN-jT1o_jhoGut2iLNN9Dg3AOPXR72ZghQbwK00jqvVZxLXZl9u7B9cf_Ujz__j6hQGrtWv0K-Y194i5kQ-oMROUCWmvowgWR00sFdGX-Oxv5HfcsjoUg', 'bg-surface-container-high text-outline'],
  ['Jordan Hayes', 'Applied for Brand Ambassador', 'New', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgjsRj2mhnkefo3PQCbHBzxfph4MQBVPNHkGq7G1RhXsEBcqNIpvIuLZzgKGHgeDeyGYjd2GFpayE9L8fc-2TL52Lwwx_TXPr4cZO6zBHIW-m_hS1k9BDL-7UIDw2iWvh6W-tqYmIdoTj7ZzIA6YPg-WEyCWv8AohCvJkxnDS_3lZDkbJbalpbXeejgk70EaWBSpoytKA3EoKPVFBXn5k6Ov-45VLFr3VN50IZ_7J3E3FrfW8B8ZO21RM2pUKHlAPThzSmobHftvI', 'bg-primary-fixed text-on-primary-fixed-variant'],
]

const normalizePeople = data => {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.data)) {
    return data.data
  }

  if (Array.isArray(data?.members)) {
    return data.members
  }

  if (Array.isArray(data?.heads)) {
    return data.heads
  }

  return []
}

const getPersonName = person =>
  person?.student_name ||
  person?.students?.name ||
  person?.name ||
  person?.student_id ||
  'Unnamed'

const getPersonImage = person =>
  person?.students?.profile_picture_url ||
  person?.profile_picture_url ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(getPersonName(person))}`

const defaultAvatar = 'https://ui-avatars.com/api/?name=User'

export default function CommitteeDashboard() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [committee, setCommittee] = useState(null)
  const [activeTab, setActiveTab] = useState('applications')
  const [members, setMembers] = useState([])
  const [heads, setHeads] = useState([])
  const [events, setEvents] = useState([])
  const [loadingCommittee, setLoadingCommittee] = useState(Boolean(id))
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [loadingHeads, setLoadingHeads] = useState(false)
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const networkSize = loadingMembers || loadingHeads
    ? '...'
    : ((members?.length || 0) + (heads?.length || 0)).toString()
  const totalEvents = loadingEvents ? '...' : events.length.toString()
  const stats = [
    ['Total Pipeline', '142', '12%', 'Active Applications', 'description', 'text-primary'],
    ['Upcoming', totalEvents, 'This Week', 'Scheduled Events', 'event_available', 'text-secondary'],
    ['Network Size', networkSize, '', 'Total Members & Heads', 'group', 'text-tertiary'],
  ]

  useEffect(() => {
    if (!id) {
      return
    }

    localStorage.setItem('committeeId', id)

    const loadCommittee = async () => {
      setLoadingCommittee(true)
      setErrorMessage('')

      try {
        const response = await getCommitteeById(id)
        setCommittee(response)
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Unable to load committee details.')
      } finally {
        setLoadingCommittee(false)
      }
    }

    const fetchPeople = async () => {
      setLoadingMembers(true)
      setLoadingHeads(true)

      try {
        const [membersData, headsData] = await Promise.all([
          getCommitteeMembers(id),
          getCommitteeHeads(id),
        ])

        setMembers(normalizePeople(membersData))
        setHeads(normalizePeople(headsData))
      } catch (err) {
        console.error('Failed to fetch members/heads', err)
      } finally {
        setLoadingMembers(false)
        setLoadingHeads(false)
      }
    }

    const fetchEvents = async () => {
      try {
        setLoadingEvents(true)

        const data = await getEventsByCommittee(id)
        setEvents(Array.isArray(data) ? data : data?.events || data?.data || [])
      } catch (err) {
        console.error('Error fetching events', err)
      } finally {
        setLoadingEvents(false)
      }
    }

    loadCommittee()
    if (id) fetchPeople()
    fetchEvents()
  }, [id])

  const committeeData = useMemo(() => ({
    committee_name: committee?.name || 'Committee Dashboard',
    tagline: committee?.tagline || 'Committee Lead Workspace',
    description: committee?.description || 'Use this dashboard to monitor committee performance, track applicants, and coordinate upcoming events.',
    affiliated_faculty: { name: committee?.facultyName || 'Alex Rivera' },
    start_year: committee?.startYear || '2024',
    tags: Array.isArray(committee?.committeeHeads) && committee.committeeHeads.length > 0 ? ['Heads Listed'] : [],
  }), [committee])

  const nextEvent = useMemo(() => {
    if (!events || events.length === 0) return null

    const now = new Date()

    return events
      .filter(e => new Date(e.event_date) >= now)
      .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))[0]
  }, [events])

  const handleOpenEvent = () => {
    if (!nextEvent?.id) return

    navigate(`/events/${nextEvent.id}/registrations`)
  }

  const getDisplayData = () => {
    if (activeTab === 'applications') {
      return applications.map(([name, subtitle, status, image]) => ({
        name,
        subtitle,
        image,
        status,
      }))
    }

    if (activeTab === 'members') {
      return members.map(m => ({
        name: getPersonName(m),
        subtitle: m.role_type || 'Member',
        image: getPersonImage(m) || defaultAvatar,
        status: m.status || 'ACTIVE',
        studentId: m.student_id,
      }))
    }

    if (activeTab === 'heads') {
      return heads.map(h => ({
        name: getPersonName(h),
        subtitle: h.role_title || 'Head',
        image: getPersonImage(h) || defaultAvatar,
        status: h.role_type || 'CORE',
        studentId: h.student_id,
      }))
    }

    return []
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <CommitteeSidebar />
      <TopBar
        sidebar="committee"
        placeholder="Search applications..."
        userName={committeeData.affiliated_faculty?.name || 'Committee Lead'}
        userRole={id ? 'Committee Dashboard' : 'Committee Lead'}
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBlnMwMiijKv4SJYQ2_QLTHTAtBMGIIcsK_eIZFsEjO22G7PNZNaEemJvklXWhRzpTu7BbQdL3IS8dKkSEVZXMtLYv0tV_z3EwtyGj86ss0fDXNlY5J9Oe7kwgRs5Q0H1pbzlOMduQGuWiwtoYGWa1QKvqkRdfBRI7hILUxI1FLP05GSkj77_bLGakapEmdHcNzlf7T7Ju6lPSMIux-6N5yEBzkN5K_uc11oPeQV67J4pDbaEU1QrCT2SscFxRQ5LPiwjNDhmv3Acg"
        actions={['notifications', 'settings']}
      />

      <main className="px-4 pb-12 pt-24 lg:ml-64 lg:p-10 lg:pt-24">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,rgba(85,69,206,0.96),rgba(244,114,182,0.88))] p-8 text-white shadow-[0_25px_70px_rgba(85,69,206,0.22)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">
                {id ? `Committee ID ${id}` : 'Committee Portal'}
              </p>
              <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
                {committeeData.committee_name}
              </h1>
              <p className="mt-3 text-lg text-white/90">{committeeData.tagline}</p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80">{committeeData.description}</p>
            </div>

            <div className="grid gap-3 rounded-[28px] bg-white/10 p-5 backdrop-blur-sm">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/70">Faculty Lead</p>
                <p className="mt-2 text-lg font-bold">{committeeData.affiliated_faculty?.name || 'Not assigned'}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Started {committeeData.start_year}
                </span>
                {committeeData.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {loadingCommittee ? (
            <p className="mt-6 text-sm text-white/80">Loading committee dashboard...</p>
          ) : null}

          {errorMessage ? (
            <p className="mt-6 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white">{errorMessage}</p>
          ) : null}
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-3">
          {stats.map(([eyebrow, value, chip, caption, icon, tone]) => (
            <article key={eyebrow} className="relative overflow-hidden rounded-[28px] border border-outline-variant/10 bg-white p-8 editorial-shadow">
              <span className={`block text-[10px] font-bold uppercase tracking-[0.24em] ${tone}`}>{eyebrow}</span>
              <div className="mt-4 flex items-end gap-3">
                <h2 className="font-headline text-5xl font-extrabold">{value}</h2>
                {chip ? <span className="mb-2 rounded-full bg-secondary-container px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">{chip}</span> : null}
              </div>
              <p className="mt-2 text-sm text-on-surface-variant">{caption}</p>
              <MaterialIcon className={`absolute -bottom-2 right-0 text-8xl opacity-10 ${tone}`}>{icon}</MaterialIcon>
            </article>
          ))}
        </section>

        <section className="mt-10 grid gap-10 xl:grid-cols-3">
          <div className="space-y-8 xl:col-span-2">
            <div className="flex items-end justify-between">
              <h2 className="font-headline text-3xl font-bold">Team Overview</h2>
              <button className="text-sm font-semibold text-primary">View all</button>
            </div>

            <div className="mb-6 flex gap-3">
              {['applications', 'members', 'heads'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all ${
                    activeTab === tab
                      ? 'bg-primary text-white'
                      : 'bg-surface-container-low text-on-surface-variant'
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {((activeTab === 'members' && loadingMembers) || (activeTab === 'heads' && loadingHeads)) ? (
                <p>Loading {activeTab}...</p>
              ) : !getDisplayData().length ? (
                <p>No data available</p>
              ) : (
                getDisplayData().map(item => (
                  <article
                    key={`${activeTab}-${item.name}-${item.studentId || item.status}`}
                    onClick={() => {
                      if (activeTab !== 'applications' && item.studentId) {
                        navigate(`/profile/${item.studentId}`)
                      }
                    }}
                    className="cursor-pointer flex items-center justify-between rounded-[24px] border border-transparent bg-white p-6 transition-all hover:translate-x-1 hover:border-primary/10"
                  >
                    <div className="flex items-center gap-5">
                      <img
                        className="h-12 w-12 rounded-full object-cover"
                        src={item.image || defaultAvatar}
                        alt={item.name}
                      />
                      <div>
                        <h3 className="font-bold">{item.name}</h3>
                        <p className="text-xs text-on-surface-variant">{item.subtitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-5">
                      <span className="rounded-full bg-primary-fixed px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-fixed-variant">
                        {item.status}
                      </span>
                      <MaterialIcon className="text-outline">chevron_right</MaterialIcon>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="font-headline text-3xl font-bold">Next Event</h2>
            <article className="ambient-shadow relative flex h-[28rem] flex-col justify-end overflow-hidden rounded-[32px] p-8 text-white">
              <img className="absolute inset-0 h-full w-full object-cover" src={nextEvent?.poster_url || 'https://via.placeholder.com/400'} alt={nextEvent?.event_name || 'No Events'} />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/20 to-transparent" />
              <div className="relative z-10">
                <span className="rounded-full bg-secondary-container/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container">Featured</span>
                <h3 className="font-headline mt-4 text-4xl font-extrabold">
                  {nextEvent?.event_name || 'No Events'}
                </h3>
                <div className="mt-4 flex gap-4 text-sm text-white/80">
                  <span>
                    {nextEvent
                      ? new Date(nextEvent.event_date).toLocaleDateString()
                      : '--'}
                  </span>
                  <span>
                    {nextEvent?.event_time || '--'}
                  </span>
                </div>
                <button
                  onClick={handleOpenEvent}
                  disabled={!nextEvent}
                  className="mt-6 rounded-full bg-white px-4 py-3 text-sm font-bold text-on-surface"
                >
                  Open Event
                </button>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}
