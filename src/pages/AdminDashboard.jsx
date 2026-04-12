import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateCommitteeForm from '../components/CreateCommitteeForm'
import { getAllCommittees } from '../api/committeeApi'

const committeeGradients = [
  'from-sky-600 via-cyan-500 to-emerald-400',
  'from-fuchsia-600 via-rose-500 to-orange-300',
  'from-violet-700 via-indigo-500 to-sky-400',
  'from-amber-500 via-orange-500 to-rose-500',
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [committees, setCommittees] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const loadCommittees = useCallback(async () => {
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('token')

    console.log('Current role:', role)
    console.log('Token:', token)

    if (role !== 'admin') {
      navigate('/login')
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      const data = await getAllCommittees()
      console.log('Committees API response:', data)
      setCommittees(data)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to load committees.')
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    loadCommittees()
  }, [loadCommittees])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.14),_transparent_32%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_46%,#f8fafc_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[36px] bg-slate-950 px-8 py-10 text-white shadow-[0_30px_80px_rgba(15,23,42,0.25)] lg:px-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-cyan-300">MentorLink Admin</p>
              <h1 className="mt-4 font-headline text-4xl font-extrabold tracking-tight sm:text-5xl">Manage every committee from one command center.</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
                Review active committees, create new ones, and jump directly into each committee dashboard for day-to-day operations.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={loadCommittees}
                className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Refresh List
              </button>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 transition hover:scale-[1.01]"
              >
                Create Committee
              </button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-headline text-3xl font-extrabold text-slate-900">All Committees</h2>
              <p className="mt-2 text-sm text-slate-500">{committees.length} committees available for administration.</p>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-[28px] border border-rose-100 bg-rose-50 px-5 py-4 text-sm text-rose-600">
              {errorMessage}
            </div>
          ) : null}

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map(item => (
                <div key={item} className="h-64 animate-pulse rounded-[28px] bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.08)]" />
              ))}
            </div>
          ) : null}

          {!isLoading && committees.length === 0 ? (
            <div className="rounded-[32px] border border-dashed border-slate-300 bg-white/70 px-8 py-16 text-center shadow-[0_18px_60px_rgba(15,23,42,0.05)]">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-400">No committees yet</p>
              <h3 className="mt-3 font-headline text-3xl font-extrabold text-slate-900">Start by creating the first committee.</h3>
              <p className="mt-3 text-sm text-slate-500">Once a committee is added, it will appear here and can be opened from its dashboard card.</p>
            </div>
          ) : null}

          {!isLoading && committees.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {committees.map((committee, index) => {
                const committeeId = committee.id || committee._id

                return (
                  <button
                    type="button"
                    key={committeeId || `${committee.committee_name}-${index}`}
                    onClick={() => committeeId && navigate(`/committee/${committeeId}`)}
                    className="group overflow-hidden rounded-[30px] bg-white text-left shadow-[0_22px_70px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 disabled:cursor-not-allowed"
                    disabled={!committeeId}
                  >
                    <div className={`h-40 bg-gradient-to-br ${committeeGradients[index % committeeGradients.length]} p-6 text-white`}>
                      <div className="flex h-full flex-col justify-between">
                        <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white/90">
                          {committee.start_year || 'New Committee'}
                        </span>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">Faculty Lead</p>
                          <p className="mt-2 text-lg font-bold">{committee.affiliated_faculty?.name || 'Faculty assignment pending'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-headline text-2xl font-extrabold text-slate-900">{committee.committee_name || 'Untitled Committee'}</h3>
                          <p className="mt-2 text-sm font-medium text-primary">{committee.tagline || 'No tagline available'}</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-300 transition group-hover:translate-x-1 group-hover:text-primary">arrow_forward</span>
                      </div>

                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-500">
                        {committee.description || 'No description provided yet.'}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {(committee.tags || []).slice(0, 3).map(tag => (
                          <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          ) : null}
        </section>
      </div>

      {showForm ? (
        <CreateCommitteeForm
          onClose={() => setShowForm(false)}
          onSuccess={loadCommittees}
        />
      ) : null}
    </div>
  )
}
