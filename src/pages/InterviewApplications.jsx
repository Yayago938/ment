import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'
import TopBar from '../components/TopBar'
import { getInterviewApplications } from '../api/interviewApi'

const getApplicantName = applicant =>
  applicant?.name ||
  applicant?.student_name ||
  applicant?.student?.name ||
  applicant?.full_name ||
  'Unnamed Applicant'

const getApplicantEmail = applicant =>
  applicant?.email ||
  applicant?.student_email ||
  applicant?.student?.email ||
  'No email provided'

const getApplicantAnswers = applicant => {
  if (Array.isArray(applicant?.answers)) {
    return applicant.answers
  }

  if (Array.isArray(applicant?.response)) {
    return applicant.response
  }

  if (Array.isArray(applicant?.responses)) {
    return applicant.responses
  }

  return []
}

export default function InterviewApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { id } = useParams()
  const committeeId = localStorage.getItem('committeeId')

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await getInterviewApplications(id)
        setApplications(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error(err)
        setError('Failed to load interview applications')
        setApplications([])
      } finally {
        setLoading(false)
      }
    }

    if (!id) {
      setError('Interview ID not found')
      setLoading(false)
      return
    }

    fetchApplications()
  }, [id])

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <CommitteeSidebar />
      <TopBar
        sidebar="committee"
        placeholder="Search applications..."
        userName="Committee Lead"
        userRole="Interview Applications"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBlnMwMiijKv4SJYQ2_QLTHTAtBMGIIcsK_eIZFsEjO22G7PNZNaEemJvklXWhRzpTu7BbQdL3IS8dKkSEVZXMtLYv0tV_z3EwtyGj86ss0fDXNlY5J9Oe7kwgRs5Q0H1pbzlOMduQGuWiwtoYGWa1QKvqkRdfBRI7hILUxI1FLP05GSkj77_bLGakapEmdHcNzlf7T7Ju6lPSMIux-6N5yEBzkN5K_uc11oPeQV67J4pDbaEU1QrCT2SscFxRQ5LPiwjNDhmv3Acg"
        actions={['notifications']}
      />

      <main className="px-4 pb-12 pt-24 lg:ml-64 lg:p-10 lg:pt-24">
        <section className="rounded-[32px] bg-[linear-gradient(135deg,rgba(85,69,206,0.96),rgba(244,114,182,0.88))] p-8 text-white shadow-[0_25px_70px_rgba(85,69,206,0.22)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">
                Interview Applications
              </p>
              <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-tight lg:text-5xl">
                Review Every Applicant
              </h1>
              <p className="mt-3 text-lg text-white/90">
                Browse submitted applications and inspect each candidate's responses in one place.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/committee/applications')}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-bold text-on-surface transition-transform hover:scale-[1.02]"
            >
              Back to Interviews
            </button>
          </div>
        </section>

        {loading ? (
          <section className="mt-8 rounded-[28px] bg-white p-8 shadow-sm">
            <p className="text-sm text-on-surface-variant">Loading applications...</p>
          </section>
        ) : null}

        {!loading && error ? (
          <section className="mt-8 rounded-[28px] bg-rose-50 p-8 shadow-sm">
            <p className="text-sm font-medium text-rose-600">{error}</p>
          </section>
        ) : null}

        {!loading && !error && applications.length === 0 ? (
          <section className="mt-8 rounded-[28px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-on-surface">No applications yet</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              This interview does not have any applications at the moment.
            </p>
          </section>
        ) : null}

        {!loading && !error && applications.length > 0 ? (
          <section className="mt-8 grid gap-4">
            {applications.map((applicant, index) => (
              <div
                key={applicant?.id || applicant?._id || applicant?.application_id || index}
                className="rounded-xl bg-surface-container-low p-5 shadow-sm"
              >
                <p className="font-bold">{getApplicantName(applicant)}</p>
                <p className="text-sm text-on-surface-variant">{getApplicantEmail(applicant)}</p>

                {getApplicantAnswers(applicant).length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {getApplicantAnswers(applicant).map((answer, answerIndex) => (
                      <div
                        key={answer?.id || answer?.question_id || answerIndex}
                        className="rounded-xl bg-white p-4"
                      >
                        <p className="text-sm font-semibold text-on-surface">
                          {answer?.question || answer?.question_text || `Question ${answerIndex + 1}`}
                        </p>
                        <p className="mt-1 text-sm text-on-surface-variant">
                          {answer?.answer || answer?.response || answer?.value || 'No answer provided'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </section>
        ) : null}
      </main>
    </div>
  )
}
