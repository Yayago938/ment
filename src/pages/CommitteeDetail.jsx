import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import FloatingBackButton from '../components/FloatingBackButton'
import Sidebar from '../components/Sidebar'
import { getCommitteeById } from '../api/committeeApi'

const fallbackBanner = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfnGtLMRfhqnyOuutWG0qd6Ox1FOHb9ZPviibiH2nOHsLxlDXcv4k_J340UnOF2sys4iifzuyJxp0xaTKqO2bWBqkqSq-l0mBmsH_cBzxcYdb4gWyiz906wXAYn9i87vy8viFJmMQGtgm8pgpZgXCBnuc4OlhfREyyU2D6jKrwKaYHWZ889nDsMNkj6jHkmNt2U5Uk0HKPszqSKFFgU6R0ujWz4gJuMhsl7NbKvc1DfGcuh643RFL0lGuOP4H6HoJnSns-93-EMWc'
const buildAvatarFallback = name => {
  const initial = (name || 'S')[0]?.toUpperCase() || 'S'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="40" fill="#e8e2ff"/><text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-family="Inter, sans-serif" font-size="28" font-weight="700" fill="#5545ce">${initial}</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const normalizeHead = (head, index) => ({
  id: head?.id || head?._id || `head-${index}`,
  name: head?.name || head?.fullName || 'Committee Head',
  role: head?.role || head?.position || head?.designation || 'Committee Head',
})

export default function CommitteeDetail() {
  const { id } = useParams()
  const location = useLocation()
  const committeeId = id || location.state?.committeeId || null
  const [committee, setCommittee] = useState(null)

  useEffect(() => {
    if (!committeeId) {
      return
    }

    const loadCommitteeDetails = async () => {
      try {
        const response = await getCommitteeById(committeeId)
        setCommittee(response)
      } catch (error) {
        console.error('Failed to load committee details:', error)
      }
    }

    loadCommitteeDetails()
  }, [committeeId])

  const committeeMeta = useMemo(() => ({
    title: committee?.name || 'Committee',
    tagline: committee?.tagline || '',
    description: committee?.description || 'No description available yet.',
    facultyName: committee?.facultyName || '',
    startYear: committee?.startYear || null,
    committeeHeads: Array.isArray(committee?.committeeHeads) ? committee.committeeHeads.map(normalizeHead) : [],
  }), [committee])
  const viewerName = localStorage.getItem('userName') || 'Student'
  const viewerImage = localStorage.getItem('userImage') || localStorage.getItem('profileImage') || buildAvatarFallback(viewerName)

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Sidebar />
      <FloatingBackButton fallbackTo="/explore" className="top-20 lg:top-24" />

      <header className="fixed top-0 left-64 right-0 z-40 glass-header flex justify-between items-center px-8 py-3 shadow-ambient">
        <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full w-96">
          <span className="material-symbols-outlined text-outline">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-full font-body outline-none"
            placeholder="Search the atelier..."
            type="text"
          />
        </div>
        <div className="flex items-center gap-6">
          <Link to="/notifications" className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">mail</span>
          </Link>
          <Link to="/profile" className="flex items-center gap-3 pl-6 border-l border-outline-variant/20">
            <div className="text-right">
              <p className="text-sm font-bold text-on-surface font-headline">{viewerName}</p>
              <p className="text-[10px] uppercase tracking-widest text-outline font-label">Student</p>
            </div>
            <img
              alt={viewerName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
              src={viewerImage}
            />
          </Link>
        </div>
      </header>

      <main className="ml-64 pt-[73px] p-8 bg-surface">
        <section className="relative h-[450px] rounded-xl overflow-hidden mb-12 shadow-xl">
          <img
            className="w-full h-full object-cover"
            alt={committeeMeta.title}
            src={fallbackBanner}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-12 left-12 flex items-end gap-8">
            <div className="w-32 h-32 bg-white p-2 rounded-lg shadow-2xl rotate-[-2deg]">
              <div className="w-full h-full ethereal-gradient rounded flex items-center justify-center text-white">
                <span className="material-symbols-outlined filled-icon" style={{ fontSize: '48px' }}>palette</span>
              </div>
            </div>
            <div className="text-white pb-2">
              {committeeMeta.tagline ? (
                <span className="bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 inline-block">
                  {committeeMeta.tagline}
                </span>
              ) : null}
              <h1 className="text-5xl font-extrabold tracking-tighter mb-2 font-headline">{committeeMeta.title}</h1>
              <div className="flex items-center gap-4 text-sm font-medium opacity-90 flex-wrap">
                {committeeMeta.facultyName ? (
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">school</span> {committeeMeta.facultyName}</span>
                ) : null}
                {committeeMeta.startYear ? (
                  <>
                    {committeeMeta.facultyName ? <span className="w-1 h-1 bg-white/40 rounded-full"></span> : null}
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">history</span> Since {committeeMeta.startYear}</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 font-headline">
                <span className="w-8 h-[2px] bg-primary inline-block"></span> About the Guild
              </h2>
              <div className="bg-surface-container-lowest p-10 rounded-lg shadow-[0_20px_40px_rgba(123,110,246,0.05)] border border-outline-variant/10">
                <p className="text-lg text-on-surface-variant leading-relaxed mb-6 font-body">
                  {committeeMeta.description}
                </p>
                {committeeMeta.facultyName || committeeMeta.startYear ? (
                  <div className="flex flex-wrap gap-2">
                    {committeeMeta.facultyName ? (
                      <span className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        Faculty: {committeeMeta.facultyName}
                      </span>
                    ) : null}
                    {committeeMeta.startYear ? (
                      <span className="bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                        Since {committeeMeta.startYear}
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl font-bold font-headline">Core Leadership</h2>
                <a className="text-primary text-sm font-bold flex items-center gap-1 hover:underline" href="#">
                  View Leadership Team <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
              {committeeMeta.committeeHeads.length > 0 ? (
                <div className="grid grid-cols-2 gap-6">
                  {committeeMeta.committeeHeads.map(head => (
                    <div key={head.id} className="bg-white p-6 rounded-lg shadow-sm border border-outline-variant/5 flex gap-5 hover:-translate-y-1 transition-transform">
                      <div className="w-24 h-24 rounded-lg object-cover flex-shrink-0 bg-primary-fixed" />
                      <div>
                        <h3 className="font-bold text-lg font-headline">{head.name}</h3>
                        <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">{head.role}</p>
                        <p className="text-sm text-on-surface-variant">Committee leadership information is available for this club.</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-outline-variant/5 text-sm text-on-surface-variant">
                  No committee heads listed yet.
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6 font-headline">Community Members</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-outline-variant/5 text-sm text-on-surface-variant">
                Member details are not available from the current backend response yet.
              </div>
            </section>
          </div>

          <div className="col-span-4 space-y-8">
            <section className="bg-surface-container-low p-8 rounded-lg">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary">work</span>
                <h2 className="text-xl font-bold font-headline">Open Opportunities</h2>
              </div>
              <div className="bg-white p-5 rounded-lg border border-outline-variant/5 text-sm text-on-surface-variant">
                Opportunity data is not connected for this committee yet.
              </div>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm border border-outline-variant/10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold font-headline">Community Snapshot</h2>
                <span className="text-[10px] font-bold text-secondary uppercase bg-secondary-container px-2 py-1 rounded">Live Data</span>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-fixed text-primary rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs font-bold">HD</span>
                    <span className="text-lg font-extrabold leading-tight">{committeeMeta.committeeHeads.length}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Committee Heads</h4>
                    <p className="text-xs text-on-surface-variant">
                      {committeeMeta.committeeHeads.length > 0 ? 'Leadership information loaded from backend.' : 'No committee heads listed yet.'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-surface-container text-on-surface-variant rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs font-bold">FY</span>
                    <span className="text-lg font-extrabold leading-tight">{committeeMeta.startYear || '--'}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Founded</h4>
                    <p className="text-xs text-on-surface-variant">{committeeMeta.startYear ? `Established in ${committeeMeta.startYear}.` : 'Start year not listed yet.'}</p>
                  </div>
                </div>
              </div>
              <Link
                to="/applications"
                className="w-full mt-8 py-3 bg-primary text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
              >
                <span className="material-symbols-outlined text-sm">calendar_month</span> Register for Events
              </Link>
            </section>

            <section className="bg-gradient-to-br from-primary to-primary-container p-8 rounded-lg text-white shadow-ambient-lg">
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded">Applications Open</span>
              </div>
              <h3 className="text-xl font-bold font-headline mb-2">Join {committeeMeta.title}</h3>
              <p className="text-white/80 text-sm mb-6 leading-relaxed">Applications for the current cohort are open. Spots are limited.</p>
              <Link
                to="/applications"
                className="w-full py-3 bg-white text-primary rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
              >
                Apply Now
              </Link>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
