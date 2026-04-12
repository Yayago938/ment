import React, { useEffect, useState } from 'react'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'
import { deleteEventRegistration, getEventRegistrations } from '../api/eventRegistrationApi'
import { useToast } from '../components/ToastProvider'

const EVENT_ID = '8a35bc6b-6f2c-4b3e-a3f2-3c717553071b'

const filterOptions = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected', 'Closed']

const getStatusStyle = status => {
  switch (status) {
    case 'Applied':
      return 'bg-surface-container-low text-on-surface-variant'
    case 'Under Review':
      return 'bg-surface-container-high text-on-surface-variant'
    case 'Shortlisted':
      return 'bg-primary-fixed text-on-primary-fixed-variant'
    case 'Accepted':
      return 'bg-secondary-fixed text-on-secondary-fixed-variant'
    case 'Rejected':
    case 'Closed':
      return 'bg-error-container text-on-error-container'
    default:
      return 'bg-surface-container-low text-on-surface-variant'
  }
}

const mapRegistrationToApplication = registration => {
  const status = registration.status || 'Applied'

  return {
    id: registration._id || registration.id,
    title: registration.event?.title || registration.event?.name || 'Registered Event',
    org: registration.event?.committee?.name || registration.event?.organization || 'MentorLink Event',
    date: registration.createdAt
      ? `Applied ${new Date(registration.createdAt).toLocaleDateString()}`
      : 'Applied recently',
    status,
    statusStyle: getStatusStyle(status),
    icon: 'description',
  }
}

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const { showToast } = useToast()

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await getEventRegistrations(EVENT_ID)
        console.log('Event registrations response:', response)

        const raw = response.data?.data || response.data?.registrations || response.data || []
        const registrations = Array.isArray(raw) ? raw : []
        const mappedApplications = registrations.map(mapRegistrationToApplication)

        setApplications(mappedApplications)
      } catch (fetchError) {
        console.error('Failed to fetch registrations:', fetchError)
        setError(fetchError.response?.data?.message || 'Failed to load applications.')
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [])

  const handleDelete = async registrationId => {
    const confirmed = window.confirm('Are you sure you want to delete this application?')

    if (!confirmed) {
      return
    }

    try {
      await deleteEventRegistration(registrationId)
      setApplications(prev => prev.filter(app => app.id !== registrationId))
    } catch (deleteError) {
      showToast(deleteError.response?.data?.message || 'Something went wrong')
    }
  }

  const filtered = activeFilter === 'All'
    ? applications
    : applications.filter(app => app.status === activeFilter)

  const activeApplicationsCount = applications.filter(app =>
    !['Rejected', 'Closed'].includes(app.status)
  ).length
  const shortlistedCount = applications.filter(app => app.status === 'Shortlisted').length

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <StudentSidebar />
      <TopBar
        sidebar="student"
        placeholder="Search applications by title or status..."
        userName="Alex Chen"
        userRole="Design Fellow"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuDEwLKAATFnd_z7zz4LsxU0IUQhpzoY_Umlo1vEl1wmGVX7MxTi6PgEWfIo_CF35aOYDxT6SgiY35jr9bm_cKlPr1CZGkUf1DaNuaEHcERVfq8HqTFB-Q9fy9sTvYUsoDA1AzC1MoOE1Y749QdYaggJhhmCk9km2Nr9_9PVinwnOPBCWYP78Gcpgvntqp2hFEshBW7_BDJ_6ttsw4VOcrSnvg2rC6GO3JIVTSJ9MQnomX3Pf-Vx0gCdIbt1us_m3JT-mjF86XZQqug"
      />

      <main className="px-4 pb-12 pt-24 lg:ml-64 lg:px-8 lg:pt-28">
        {/* Content Area */}
        <div className="space-y-12">
          {/* Header Section */}
          <section className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.15em] text-primary uppercase font-label">Dashboard</span>
              <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface font-headline">My Applications</h1>
              <p className="text-on-surface-variant max-w-md leading-relaxed">
                Track and manage all your submitted applications in one place.
              </p>
            </div>
            {/* Stats */}
            <div className="flex gap-4">
              {[
                { icon: 'hourglass_empty', bg: 'bg-primary-fixed', iconColor: 'text-on-primary-fixed-variant', value: String(activeApplicationsCount).padStart(2, '0'), label: 'Active Applications' },
                { icon: 'checklist', bg: 'bg-secondary-fixed', iconColor: 'text-on-secondary-fixed-variant', value: String(applications.length).padStart(2, '0'), label: 'Total Applications' },
                { icon: 'star', bg: 'bg-tertiary-fixed', iconColor: 'text-on-tertiary-fixed-variant', value: String(shortlistedCount).padStart(2, '0'), label: 'Shortlisted' },
              ].map((stat) => (
                <div key={stat.label} className="bg-surface-container-low px-6 py-4 rounded-lg flex items-center gap-4">
                  <div className={`w-10 h-10 ${stat.bg} flex items-center justify-center rounded-full ${stat.iconColor}`}>
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold leading-none font-headline">{stat.value}</p>
                    <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider whitespace-nowrap">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Application List (span 8) */}
            <div className="col-span-12 lg:col-span-8 space-y-4">
              {loading && (
                <p className="text-sm text-on-surface-variant">Loading applications...</p>
              )}

              {error && (
                <p className="text-sm text-error">{error}</p>
              )}

              {!loading && !error && filtered.map((app) => (
                <div
                  key={app.id}
                  className={`group bg-surface-container-lowest p-6 rounded-lg transition-all hover:translate-x-1 hover:shadow-ambient flex items-center justify-between ${app.faded ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-16 h-16 bg-surface-container-low rounded-2xl flex items-center justify-center text-primary overflow-hidden ${app.faded ? 'grayscale' : ''}`}>
                      {app.img ? (
                        <img alt={app.imgAlt} className="w-full h-full object-cover" src={app.img} />
                      ) : (
                        <span className="material-symbols-outlined text-4xl">{app.icon}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-headline">{app.title}</h3>
                      <p className="text-sm text-on-surface-variant flex items-center gap-2">
                        {app.org}
                        <span className="w-1 h-1 bg-outline-variant rounded-full inline-block"></span>
                        {app.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${app.statusStyle}`}>
                      {app.status}
                    </span>
                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-2 rounded-full hover:bg-surface-container-low text-outline transition-colors"
                    >
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                </div>
              ))}

              {!loading && !error && filtered.length === 0 && (
                <p className="text-sm text-on-surface-variant">No applications found.</p>
              )}
            </div>

            {/* Sidebar (span 4) */}
            <aside className="col-span-12 lg:col-span-4 space-y-6">
              {/* Filter Card */}
              <div className="bg-surface-container-low p-8 rounded-lg space-y-6">
                <h4 className="font-bold font-headline text-lg">Filter Applications</h4>
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((f) => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                        activeFilter === f
                          ? 'bg-primary text-white'
                          : 'bg-surface-container-lowest text-on-surface-variant hover:bg-white border border-outline-variant/10'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <hr className="border-outline-variant/20" />
                <h4 className="font-bold font-headline text-lg">Application Overview</h4>
                <div className="p-4 bg-primary-fixed/30 rounded-2xl border border-primary/5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="material-symbols-outlined text-primary">info</span>
                    <p className="text-xs font-bold text-primary uppercase tracking-wide">Update Summary</p>
                  </div>
                  <p className="text-sm leading-relaxed text-on-primary-fixed-variant">
                    You currently have <span className="font-bold text-primary">{activeApplicationsCount} active</span> applications and {shortlistedCount} shortlisted.
                  </p>
                </div>
              </div>

              {/* Recent Activity Card */}
              <div className="bg-gradient-to-br from-[#7B6EF6] to-[#5545ce] p-8 rounded-lg text-white shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <span className="material-symbols-outlined">history</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-1 rounded">Latest Update</span>
                </div>
                <h4 className="text-xl font-bold mb-2 font-headline">Recent Activity</h4>
                <p className="text-white/90 text-sm mb-6 leading-relaxed">
                  {applications[0]
                    ? `${applications[0].title} is currently ${applications[0].status}.`
                    : 'Your latest registration updates will appear here.'}
                </p>
                <button className="w-full py-3 bg-white text-primary rounded-full font-bold text-sm hover:shadow-lg transition-shadow">
                  View Details
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
