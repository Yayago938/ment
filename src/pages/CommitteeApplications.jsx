import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'
import {
  deleteInterview,
  getInterviewsByCommittee,
} from '../api/interviewApi'

const getInterviewId = interview => interview?.id || interview?._id

const formatDate = value => {
  if (!value) {
    return 'Date unavailable'
  }

  const parsedDate = new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return value
  }

  return parsedDate.toLocaleDateString()
}

export default function CommitteeApplications() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { id } = useParams()
  const committeeId = id || localStorage.getItem('committeeId')

  useEffect(() => {
    const fetchInterviews = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getInterviewsByCommittee(committeeId)
        setInterviews(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setError('Failed to load interviews')
        setInterviews([])
      } finally {
        setLoading(false)
      }
    }

    if (!committeeId) {
      setError('Committee ID not found. Please log in again.')
      setLoading(false)
      return
    }

    localStorage.setItem('committeeId', committeeId)
    fetchInterviews()
  }, [committeeId])

  const handleDelete = async interviewId => {
    if (!interviewId) {
      return
    }

    if (!window.confirm('Are you sure you want to delete this interview?')) {
      return
    }

    try {
      await deleteInterview(interviewId)
      setInterviews(prev => prev.filter(interview => getInterviewId(interview) !== interviewId))
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <CommitteeSidebar />

      <main className="ml-0 min-h-screen flex-1 px-4 pb-20 pt-24 sm:px-6 md:px-8 lg:ml-64 lg:pb-0 lg:p-10 lg:pt-24">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,rgba(85,69,206,0.96),rgba(244,114,182,0.88))] p-8 text-white shadow-[0_25px_70px_rgba(85,69,206,0.22)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">
                Committee Interviews
              </p>
              <h1 className="mt-4 break-words font-headline text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                Manage Every Interview You've Created
              </h1>
              <p className="mt-3 text-lg text-white/90">
                Review active interview rounds, inspect applications, and jump into editing when the process changes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate(committeeId ? `/committee/${committeeId}/create-interview` : '/committee-dashboard')}
              className="inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-on-surface transition-transform hover:scale-[1.02] sm:w-auto"
            >
              Create New Interview
            </button>
          </div>
        </section>

        {loading ? (
          <section className="mt-8 rounded-[28px] bg-white p-8 shadow-sm">
            <p className="text-sm text-on-surface-variant">Loading interviews...</p>
          </section>
        ) : null}

        {!loading && error ? (
          <section className="mt-8 rounded-[28px] bg-rose-50 p-8 shadow-sm">
            <p className="text-sm font-medium text-rose-600">{error}</p>
          </section>
        ) : null}

        {!loading && !error && interviews.length === 0 ? (
          <section className="mt-8 rounded-[28px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-on-surface">No interviews created</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              Your committee has not created any interviews yet.
            </p>
          </section>
        ) : null}

        {!loading && !error && interviews.length > 0 ? (
          <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {interviews.map(interview => (
              <article
                key={getInterviewId(interview)}
                className="overflow-hidden rounded-[28px] bg-white p-6 shadow-md transition-transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="line-clamp-2 break-words text-xl font-bold text-on-surface">{interview.title}</h3>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                    Interview
                  </span>
                </div>

                <p className="mt-3 break-words text-sm leading-relaxed text-on-surface-variant">
                  {interview.description || 'No description available.'}
                </p>

                <p className="mt-4 text-xs text-on-surface-variant">
                  Created: {formatDate(interview.created_at || interview.createdAt)}
                </p>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => navigate(`/committee/interview/${getInterviewId(interview)}/applications`)}
                    className="w-full font-semibold text-primary sm:w-auto"
                  >
                    View Applications
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/committee/interview/edit/${getInterviewId(interview)}`)}
                    className="w-full font-semibold text-blue-500 sm:w-auto"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(getInterviewId(interview))}
                    className="w-full font-semibold text-red-500 sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : null}
      </main>
    </div>
  )
}
