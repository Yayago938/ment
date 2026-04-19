import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'
import MaterialIcon from '../components/MaterialIcon'
import api from '../api/axios'
import interviewApi from '../api/interviewApi'

const filterOptions = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected', 'Closed']

const opportunityApplicationRoutes = studentId => ([
  studentId ? `/events/registration/student/${studentId}` : null,
  '/events/registration/my-applications',
  '/events/my-applications',
  '/events/my-registrations',
]).filter(Boolean)

const activeStatuses = new Set([
  'APPLIED',
  'SUBMITTED',
  'PENDING',
  'REVIEWED',
  'IN REVIEW',
  'IN_REVIEW',
  'REVIEWING',
  'UNDER REVIEW',
  'INTERVIEWING',
  'SHORTLISTED',
])

const shortlistedStatuses = new Set([
  'SHORTLISTED',
  'INTERVIEWING',
])

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
      rawStatus,
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
  const applications = payload?.data?.data || getApplicationsFromPayload(payload)

  return applications.map(application => ({
    id: application?.id || application?._id || application?.application_id || `interview-${application?.interview_id}`,
    source: 'interview',
    title: application?.interviews?.title || 'Interview Application',
    type: 'Interview',
    appliedOn: application?.applied_at || application?.updated_at || application?.created_at || '',
    status: application?.status || 'PENDING',
    rawStatus: application?.status || 'PENDING',
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
    statusLabel = 'Applied'
    statusTone = 'bg-surface-container-high text-on-surface-variant'
  } else if (['REVIEWED', 'IN REVIEW', 'IN_REVIEW', 'REVIEWING', 'UNDER REVIEW'].includes(normalizedStatus)) {
    statusLabel = 'Under Review'
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

const matchesFilter = (application, filter) => {
  if (filter === 'All') {
    return true
  }

  const normalizedStatus = String(application?.status || '').toUpperCase().replace(/_/g, ' ').trim()

  switch (filter) {
    case 'Applied':
      return ['APPLIED', 'SUBMITTED', 'PENDING'].includes(normalizedStatus)
    case 'Under Review':
      return ['REVIEWED', 'IN REVIEW', 'IN_REVIEW', 'REVIEWING', 'UNDER REVIEW'].includes(normalizedStatus)
    case 'Shortlisted':
      return ['SHORTLISTED', 'INTERVIEWING'].includes(normalizedStatus)
    case 'Accepted':
      return normalizedStatus === 'ACCEPTED'
    case 'Rejected':
      return normalizedStatus === 'REJECTED'
    case 'Closed':
      return ['CLOSED', 'WITHDRAWN'].includes(normalizedStatus)
    default:
      return true
  }
}

export default function MyApplications() {
  const navigate = useNavigate()
  const [opportunityApplications, setOpportunityApplications] = useState([])
  const [interviewApplications, setInterviewApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const studentId = localStorage.getItem('studentId')

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true)
      setError('')

      const [opportunityResult, interviewResult] = await Promise.allSettled([
        fetchOpportunityApplications(studentId),
        interviewApi.getMyApplications({ page: 1, limit: 50 }),
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

      if (opportunityResult.status === 'rejected' && interviewResult.status === 'rejected') {
        setError('Failed to load applications.')
      }

      setLoading(false)
    }

    fetchApplications()
  }, [studentId])

  const applications = useMemo(
    () => [...opportunityApplications, ...interviewApplications]
      .sort((left, right) => {
        const leftTime = left?.sortDate ? new Date(left.sortDate).getTime() : 0
        const rightTime = right?.sortDate ? new Date(right.sortDate).getTime() : 0
        return rightTime - leftTime
      }),
    [interviewApplications, opportunityApplications],
  )

  const filtered = useMemo(
    () => applications.filter(application => matchesFilter(application, activeFilter)),
    [activeFilter, applications],
  )

  const tableRows = useMemo(
    () => filtered.map(application => ({
      application,
      row: normalizeTableRow(application),
    })),
    [filtered],
  )

  const activeApplicationsCount = useMemo(
    () => applications.filter(application => activeStatuses.has(
      String(application?.status || '').toUpperCase().replace(/_/g, ' ').trim(),
    )).length,
    [applications],
  )

  const shortlistedCount = useMemo(
    () => applications.filter(application => shortlistedStatuses.has(
      String(application?.status || '').toUpperCase().replace(/_/g, ' ').trim(),
    )).length,
    [applications],
  )

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
        <div className="space-y-12">
          <section className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.15em] text-primary uppercase font-label">Dashboard</span>
              <h1 className="text-5xl font-extrabold tracking-tighter text-on-surface font-headline">My Applications</h1>
              <p className="text-on-surface-variant max-w-md leading-relaxed">
                Track and manage all your submitted applications in one place.
              </p>
            </div>
            <div className="flex gap-4">
              {[
                { icon: 'hourglass_empty', bg: 'bg-primary-fixed', iconColor: 'text-on-primary-fixed-variant', value: String(activeApplicationsCount).padStart(2, '0'), label: 'Active Applications' },
                { icon: 'checklist', bg: 'bg-secondary-fixed', iconColor: 'text-on-secondary-fixed-variant', value: String(applications.length).padStart(2, '0'), label: 'Total Applications' },
                { icon: 'star', bg: 'bg-tertiary-fixed', iconColor: 'text-on-tertiary-fixed-variant', value: String(shortlistedCount).padStart(2, '0'), label: 'Shortlisted' },
              ].map((stat) => (
                <div key={stat.label} className="premium-card premium-glow bg-surface-container-low px-6 py-4 rounded-lg flex items-center gap-4 border border-black/5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md">
                  <div className={`w-10 h-10 ${stat.bg} flex items-center justify-center rounded-full ring-1 ring-black/5 ${stat.iconColor}`}>
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

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-8 space-y-4">
              {loading && (
                <p className="text-sm text-on-surface-variant">Loading applications...</p>
              )}

              {error && (
                <p className="text-sm text-error">{error}</p>
              )}

              {!loading && !error && (
                <div className="premium-card editorial-shadow overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 ease-out">
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
                        {tableRows.length > 0 ? tableRows.map(({ application, row }) => {
                          const [title, type, date, status, nextStep, icon, iconTone, statusTone] = row

                          return (
                          <tr
                            key={application?.id || `${title}-${type}-${date}`}
                            onClick={() => {
                              if (application?.source === 'interview') {
                                navigate(`/applications/${application.id}`)
                              }
                            }}
                            className="border-t border-black/5 transition-colors duration-200 ease-out hover:bg-primary/5"
                          >
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
                        )}) : (
                          <tr className="border-t border-surface-container-low">
                            <td colSpan="5" className="px-8 py-8">
                              <div className="mx-auto flex max-w-md items-start gap-4 rounded-[24px] border border-black/5 bg-surface-container-low/60 p-6 text-left shadow-sm">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary ring-1 ring-black/5">
                                  <MaterialIcon>inbox</MaterialIcon>
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-on-surface">No applications found</p>
                                  <p className="mt-1 text-sm text-on-surface-variant">
                                    Try another filter or check back after applying to new opportunities and interviews.
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <aside className="col-span-12 lg:col-span-4 space-y-6">
              <div className="premium-card premium-glow bg-surface-container-low p-8 rounded-lg space-y-6 border border-black/5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md">
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

              <div className="premium-card premium-glow bg-gradient-to-br from-[#7B6EF6] to-[#5545ce] p-8 rounded-lg text-white shadow-xl border border-white/10 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <span className="material-symbols-outlined">history</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-1 rounded">Latest Update</span>
                </div>
                <h4 className="text-xl font-bold mb-2 font-headline">Recent Activity</h4>
                <p className="text-white/90 text-sm mb-6 leading-relaxed">
                  {applications[0]
                    ? `${applications[0].title} is currently ${getReadableStatus(applications[0].status)}.`
                    : 'Your latest registration updates will appear here.'}
                </p>
                <button className="premium-button premium-glow w-full py-3 bg-white text-primary rounded-full font-bold text-sm shadow-sm transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-lg active:scale-[0.99]">
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
