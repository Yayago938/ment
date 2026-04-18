import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import interviewApi from '../api/interviewApi'

const formatDate = value => {
  if (!value) {
    return 'Pending'
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

const getStatusLabel = status => {
  const normalizedStatus = String(status || '').replace(/_/g, ' ').trim()

  if (!normalizedStatus) {
    return 'Pending'
  }

  return normalizedStatus
    .toLowerCase()
    .replace(/\b\w/g, character => character.toUpperCase())
}

const getTimelineState = status => {
  const normalizedStatus = String(status || '').toUpperCase().replace(/_/g, ' ').trim()

  const states = {
    applied: { done: true, current: false, meta: 'Submitted successfully.', badge: formatDate(null) },
    review: { done: false, current: false, meta: 'Pending completion of current stage.', badge: 'Pending' },
    shortlisted: { done: false, current: false, meta: 'Pending completion of current stage.', badge: 'Pending' },
    final: { done: false, current: false, meta: '', badge: 'Pending' },
  }

  if (['PENDING', 'UNDER REVIEW', 'REVIEWED'].includes(normalizedStatus)) {
    states.review = {
      done: false,
      current: true,
      meta: 'Being evaluated right now.',
      badge: 'Current Stage',
    }
  } else if (['SHORTLISTED', 'INTERVIEWING'].includes(normalizedStatus)) {
    states.review = {
      done: true,
      current: false,
      meta: 'Committee review completed.',
      badge: 'Completed',
    }
    states.shortlisted = {
      done: false,
      current: true,
      meta: 'Being evaluated right now.',
      badge: 'Current Stage',
    }
  } else if (normalizedStatus === 'ACCEPTED') {
    states.review = {
      done: true,
      current: false,
      meta: 'Committee review completed.',
      badge: 'Completed',
    }
    states.shortlisted = {
      done: true,
      current: false,
      meta: 'Interview stage completed.',
      badge: 'Completed',
    }
    states.final = {
      done: true,
      current: false,
      meta: 'Application accepted.',
      badge: 'Accepted',
    }
  } else if (normalizedStatus === 'REJECTED') {
    states.review = {
      done: true,
      current: false,
      meta: 'Committee review completed.',
      badge: 'Completed',
    }
    states.final = {
      done: false,
      current: true,
      meta: 'Application rejected.',
      badge: 'Rejected',
    }
  }

  return states
}

export default function ApplicationTracker() {
  const { applicationId } = useParams()
  const [application, setApplication] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchApplication = async () => {
      if (!applicationId) {
        setError('Application not found.')
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await interviewApi.getApplicationById(applicationId)
        const payload = response?.data?.data || response?.data || null
        setApplication(payload)
      } catch (fetchError) {
        console.error('Failed to load interview application:', fetchError)
        setError(fetchError.response?.data?.message || 'Failed to load application tracker.')
      } finally {
        setLoading(false)
      }
    }

    fetchApplication()
  }, [applicationId])

  const timelineState = useMemo(
    () => getTimelineState(application?.status),
    [application?.status],
  )

  const timelineSteps = useMemo(
    () => [
      ['Applied', formatDate(application?.applied_at), 'Submitted successfully.', timelineState.applied.done, timelineState.applied.current],
      ['Under Review', timelineState.review.badge, timelineState.review.meta, timelineState.review.done, timelineState.review.current],
      ['Shortlisted / Interviewing', timelineState.shortlisted.badge, timelineState.shortlisted.meta, timelineState.shortlisted.done, timelineState.shortlisted.current],
      ['Final Result', timelineState.final.badge, timelineState.final.meta, timelineState.final.done, timelineState.final.current],
    ],
    [application?.applied_at, timelineState],
  )

  if (loading) {
    return <div className="min-h-screen bg-surface font-body text-on-surface">Loading...</div>
  }

  if (error || !application) {
    return <div className="min-h-screen bg-surface font-body text-on-surface">{error || 'Unable to load application.'}</div>
  }

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      <Sidebar />
      <header className="glass-panel sticky top-0 z-40 ml-64 flex items-center justify-between px-8 py-3 shadow-[0_20px_40px_rgba(123,110,246,0.08)]">
        <div className="flex w-96 items-center gap-4 rounded-full bg-surface-container-low px-4 py-2">
          <span className="material-symbols-outlined text-outline">search</span>
          <input className="w-full bg-transparent text-sm outline-none" placeholder="Search your applications..." />
        </div>
      </header>

      <main className="min-h-screen ml-64 p-12">
        <div className="mx-auto max-w-5xl">
          <nav className="mb-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
            <span>Applications</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-primary">{application?.interviews?.title || 'Interview Application'}</span>
          </nav>

          <div className="flex flex-col gap-12 lg:flex-row">
            <div className="flex-1">
              <div className="mb-12">
                <div className="mb-4 flex items-center gap-4">
                  <span className="rounded-full bg-primary-fixed px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-on-primary-fixed-variant">Ongoing Journey</span>
                  <span className="text-sm text-on-surface-variant">Ref: {application?.id}</span>
                </div>
                <h1 className="font-headline text-5xl font-extrabold tracking-tight">Track Your Application</h1>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-on-surface-variant">Your application is currently under review. Track your progress through each stage below.</p>
              </div>

              <div className="relative pl-1">
                <div className="absolute bottom-4 left-[19px] top-4 w-[2px] bg-surface-container-highest" />
                {timelineSteps.map(([title, meta, desc, done, current], idx) => (
                  <div key={title} className={`relative flex gap-8 ${idx < 3 ? 'pb-12' : ''} ${!done && !current ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                    <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${done ? 'bg-primary text-white' : current ? 'border-2 border-primary bg-white ring-4 ring-primary-fixed' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                      {current ? <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" /> : <span className="material-symbols-outlined text-sm">{done ? 'check' : 'visibility'}</span>}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="mb-2 flex items-start justify-between">
                        <h2 className={`font-headline text-2xl font-bold ${current ? 'text-primary' : ''}`}>{title}</h2>
                        <span className={`text-sm ${current ? 'rounded-full bg-secondary-container px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-container' : 'text-on-surface-variant'}`}>{meta}</span>
                      </div>
                      {desc ? <div className={`rounded-[24px] p-6 ${current ? 'border-2 border-primary-fixed bg-white shadow-[0_20px_40px_rgba(123,110,246,0.08)]' : 'bg-surface-container-lowest shadow-sm'}`}><p className="text-sm leading-relaxed text-on-surface-variant">{desc}</p></div> : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="w-full lg:w-80">
              <article className="rounded-[24px] border border-outline-variant/10 bg-white p-6 shadow-sm">
                <h3 className="font-headline font-bold">Application Summary</h3>
                <div className="mt-6 space-y-4 text-sm">
                  {[
                    ['Status', getStatusLabel(application?.status)],
                    ['Applied On', formatDate(application?.applied_at)],
                    ['Application ID', application?.id],
                    ['Last Updated', formatDate(application?.reviewed_at || application?.applied_at)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-on-surface-variant">{label}</span>
                      <span className={`font-semibold ${label === 'Status' ? 'text-primary' : ''}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </article>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
