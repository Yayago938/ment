import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'
import TopBar from '../components/TopBar'
import MaterialIcon from '../components/MaterialIcon'
import { getCommitteeById } from '../api/committeeApi'
import { getEventsByCommittee } from '../api/eventApi'

const applications = [
  ['Marcus Chen', 'Applied for Visual Lead', 'New', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL9b--ORFPfgorc3Fig7xYN55tVOK91Ow0aEWERsjlwiHj5N8fMiXP5MBP5YLf93ob1ihV1hxfscuGzYnWHihJOuqkN6z53diDqGkTuS2QzuViRP6wExB2JbtApG9n-wP59TLcDiEb2JTcyvAh0_ps0ZmQjyICtLX2vqrPZPaNctuCGc5pjImroNfd0A4bnNIMDzIo6Jg5sB9iCeYi53DpnXSLCp9N8l3c9_5SHc0H7ij_7Il5eYiKW-OC_c07MmAA8No4hAcyJ3g', 'bg-primary-fixed text-on-primary-fixed-variant'],
  ['Elena Soros', 'Applied for UX Research Mentor', 'Reviewing', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFhCHSDagrZXCdbGSFEUbvHHc8Qp7BnsFqW0XtYrQ9gNeoYWC8DqD_9Tp7eZZ-2MfkoFOb7yIMGMA486uU_FC6Eg_7dMQ5z23dcmxdgujiNJotYEA2AuMNfngrZqzs315QT4-kf0A_e-6BnbtJW_fnfsKN-jT1o_jhoGut2iLNN9Dg3AOPXR72ZghQbwK00jqvVZxLXZl9u7B9cf_Ujz__j6hQGrtWv0K-Y194i5kQ-oMROUCWmvowgWR00sFdGX-Oxv5HfcsjoUg', 'bg-surface-container-high text-outline'],
  ['Jordan Hayes', 'Applied for Brand Ambassador', 'New', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgjsRj2mhnkefo3PQCbHBzxfph4MQBVPNHkGq7G1RhXsEBcqNIpvIuLZzgKGHgeDeyGYjd2GFpayE9L8fc-2TL52Lwwx_TXPr4cZO6zBHIW-m_hS1k9BDL-7UIDw2iWvh6W-tqYmIdoTj7ZzIA6YPg-WEyCWv8AohCvJkxnDS_3lZDkbJbalpbXeejgk70EaWBSpoytKA3EoKPVFBXn5k6Ov-45VLFr3VN50IZ_7J3E3FrfW8B8ZO21RM2pUKHlAPThzSmobHftvI', 'bg-primary-fixed text-on-primary-fixed-variant'],
]

export default function CommitteeDashboard() {
  const { id } = useParams()
  const [committee, setCommittee] = useState(null)
  const [activeTab, setActiveTab] = useState('members')
  const [members, setMembers] = useState([])
  const [heads, setHeads] = useState([])
  const [events, setEvents] = useState([])
  const [loadingCommittee, setLoadingCommittee] = useState(Boolean(id))
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [loadingHeads, setLoadingHeads] = useState(false)
  const [loadingEvents, setLoadingEvents] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const token = localStorage.getItem('token')
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
    const token = localStorage.getItem('token')

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

    const fetchMembers = async () => {
      try {
        setLoadingMembers(true)
        const res = await fetch('https://mentorlink-backend-nhah.onrender.com/committee/getAllCommitteeMembers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ committeeId: id }),
        })
        const data = await res.json()
        setMembers(Array.isArray(data) ? data : data?.members || data?.data || [])
      } catch (err) {
        console.error('Error fetching members', err)
      } finally {
        setLoadingMembers(false)
      }
    }

    const fetchHeads = async () => {
      try {
        setLoadingHeads(true)
        const res = await fetch('https://mentorlink-backend-nhah.onrender.com/committee/getAllCommitteeHeads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ committeeId: id }),
        })
        const data = await res.json()
        setHeads(Array.isArray(data) ? data : data?.heads || data?.data || [])
      } catch (err) {
        console.error('Error fetching heads', err)
      } finally {
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
    fetchMembers()
    fetchHeads()
    fetchEvents()
  }, [id])

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return

    try {
      await fetch('https://mentorlink-backend-nhah.onrender.com/committee/deleteMemberFromCommittee', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          committeeId: id,
          memberId: memberId,
        }),
      })

      setMembers(prev => prev.filter(m => m.student_id !== memberId))
    } catch (err) {
      console.error('Failed to delete member', err)
    }
  }

  const handleDeleteHead = async (headId) => {
    if (!window.confirm('Are you sure you want to delete this head?')) return

    try {
      await fetch('https://mentorlink-backend-nhah.onrender.com/committee/deleteHeadFromCommittee', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          committeeId: id,
          headId: headId,
        }),
      })

      setHeads(prev => prev.filter(h => h.student_id !== headId))
    } catch (err) {
      console.error('Failed to delete head', err)
    }
  }

  const committeeData = useMemo(() => ({
    committee_name: committee?.name || 'Committee Dashboard',
    tagline: committee?.tagline || 'Committee Lead Workspace',
    description: committee?.description || 'Use this dashboard to monitor committee performance, track applicants, and coordinate upcoming events.',
    affiliated_faculty: { name: committee?.facultyName || 'Alex Rivera' },
    start_year: committee?.startYear || '2024',
    tags: Array.isArray(committee?.committeeHeads) && committee.committeeHeads.length > 0 ? ['Heads Listed'] : [],
  }), [committee])

  const nextEvent = useMemo(() => {
    if (!events.length) return null

    const sorted = [...events].sort(
      (a, b) => new Date(a.event_date) - new Date(b.event_date)
    )

    const now = new Date()

    return sorted.find(event => new Date(event.event_date) >= now) || sorted[0]
  }, [events])

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
              <h2 className="font-headline text-3xl font-bold">Recent Applications</h2>
              <button className="text-sm font-semibold text-primary">View all</button>
            </div>

            <div className="space-y-4">
              {applications.map(([name, role, status, image, statusTone]) => (
                <article key={name} className="flex items-center justify-between rounded-[24px] border border-transparent bg-white p-6 transition-all hover:translate-x-1 hover:border-primary/10">
                  <div className="flex items-center gap-5">
                    <img className="h-12 w-12 rounded-full object-cover" src={image} alt={name} />
                    <div>
                      <h3 className="font-bold">{name}</h3>
                      <p className="text-xs text-on-surface-variant">{role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] ${statusTone}`}>{status}</span>
                    <MaterialIcon className="text-outline">chevron_right</MaterialIcon>
                  </div>
                </article>
              ))}
            </div>

            <article className="rounded-[28px] border border-outline-variant/10 bg-surface-container-low p-8">
              <div className="mb-6 flex items-center gap-4">
                <button
                  onClick={() => setActiveTab('members')}
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    activeTab === 'members' ? 'bg-primary text-white' : 'bg-white text-primary'
                  }`}
                >
                  Members
                </button>

                <button
                  onClick={() => setActiveTab('heads')}
                  className={`px-4 py-2 rounded-full text-sm font-bold ${
                    activeTab === 'heads' ? 'bg-primary text-white' : 'bg-white text-primary'
                  }`}
                >
                  Heads
                </button>
              </div>

              {activeTab === 'members' && (
                <div className="space-y-4">
                  {loadingMembers ? (
                    <p>Loading members...</p>
                  ) : members.length === 0 ? (
                    <p>No members found</p>
                  ) : (
                    members.map(member => (
                      <div key={member.id || member._id || member.student_id} className="flex justify-between items-center rounded-xl bg-white p-4 shadow-sm">
                        <div>
                          <p className="font-bold">{member.student_id}</p>
                          <p className="text-xs text-gray-500">{member.role_type}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteMember(member.student_id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'heads' && (
                <div className="space-y-4">
                  {loadingHeads ? (
                    <p>Loading heads...</p>
                  ) : heads.length === 0 ? (
                    <p>No heads found</p>
                  ) : (
                    heads.map(head => (
                      <div key={head.id || head._id || head.student_id} className="flex justify-between items-center rounded-xl bg-white p-4 shadow-sm">
                        <div>
                          <p className="font-bold">{head.student_id}</p>
                          <p className="text-xs text-gray-500">{head.role_title} ({head.role_type})</p>
                        </div>
                        <button
                          onClick={() => handleDeleteHead(head.student_id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </article>
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
                <button className="mt-6 rounded-full bg-white px-4 py-3 text-sm font-bold text-on-surface">Open Event</button>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}
