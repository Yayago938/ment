import { Link } from 'react-router-dom'
import CommitteeSidebar from '../components/CommitteeSidebar'
import TopBar from '../components/TopBar'

const highlights = [
  ['Members', '1,240'],
  ['Events Hosted', '18'],
  ['Active Mentors', '54'],
]

export default function CommitteeProfile() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <CommitteeSidebar />
      <TopBar
        sidebar="committee"
        placeholder="Search committee records..."
        userName="Alex Rivera"
        userRole="Committee Lead"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuBlnMwMiijKv4SJYQ2_QLTHTAtBMGIIcsK_eIZFsEjO22G7PNZNaEemJvklXWhRzpTu7BbQdL3IS8dKkSEVZXMtLYv0tV_z3EwtyGj86ss0fDXNlY5J9Oe7kwgRs5Q0H1pbzlOMduQGuWiwtoYGWa1QKvqkRdfBRI7hILUxI1FLP05GSkj77_bLGakapEmdHcNzlf7T7Ju6lPSMIux-6N5yEBzkN5K_uc11oPeQV67J4pDbaEU1QrCT2SscFxRQ5LPiwjNDhmv3Acg"
        actions={['notifications']}
      />

      <main className="px-4 pb-16 pt-24 lg:ml-64 lg:px-10 lg:pt-28">
        <section className="mx-auto max-w-5xl rounded-[32px] bg-white p-8 shadow-[0_20px_40px_rgba(123,110,246,0.08)] lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-primary to-secondary-container text-white">
                <span className="material-symbols-outlined text-4xl">palette</span>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Committee Profile</p>
                <h1 className="font-headline mt-2 text-4xl font-extrabold">The Creative Guild</h1>
                <p className="mt-2 text-on-surface-variant">Elite community for design, storytelling, and digital craft.</p>
              </div>
            </div>
            <Link to="/committee/profile/edit" className="rounded-full border border-outline-variant px-6 py-3 text-sm font-bold text-primary">
              Edit
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {highlights.map(([label, value]) => (
              <article key={label} className="rounded-[24px] border border-outline-variant/10 bg-surface-container-low p-6 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">{label}</p>
                <p className="font-headline mt-3 text-3xl font-extrabold">{value}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[24px] border border-outline-variant/10 bg-surface-container-lowest p-6">
              <h2 className="font-headline text-2xl font-bold">About the Guild</h2>
              <p className="mt-3 text-sm text-on-surface-variant">
                We curate mentorship experiences, host portfolio nights, and connect student creators with industry experts.
                Our mission is to elevate campus talent through hands-on leadership and collaborative projects.
              </p>
            </div>
            <div className="rounded-[24px] border border-outline-variant/10 bg-surface-container-lowest p-6">
              <h2 className="font-headline text-2xl font-bold">Leadership Focus</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {['Design Systems', 'Community Mentorship', 'Events', 'Brand Studio'].map((tag) => (
                  <span key={tag} className="rounded-full bg-primary-fixed/30 px-4 py-2 text-xs font-semibold text-on-primary-fixed-variant">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
