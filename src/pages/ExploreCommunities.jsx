import { Link } from 'react-router-dom'
import StudentSidebar from '../components/StudentSidebar'
import TopBar from '../components/TopBar'

const spotlight = [
  { title: 'The Coding Collective', tag: 'Tech', members: '1.2k members', blurb: 'Deep dives into full-stack development and creative engineering practices.', icon: 'code', tone: 'text-primary bg-primary-fixed' },
  { title: 'Visual Atelier', tag: 'Arts', members: '840 members', blurb: 'Exploring digital minimalism and editorial design for the next generation.', icon: 'palette', tone: 'text-secondary bg-secondary-fixed' },
  { title: 'Venture Society', tag: 'Business', members: '2.1k members', blurb: 'Nurturing high-impact student startups through mentorship and equity workshops.', icon: 'auto_graph', tone: 'text-tertiary bg-tertiary-fixed' },
]

const events = [
  ['OCT', '24', 'Global Tech Symposium', 'The premier gathering of student innovators.', '/events/portfolio-review', 'text-primary'],
  ['NOV', '02', 'Acoustic Garden Sessions', 'An evening of unplugged performances under the willow trees.', '/events/portfolio-review', 'text-secondary'],
  ['NOV', '15', 'Founders Breakfast', 'Connect with alumni who launched successful startups.', '/opportunities/product-design-internship', 'text-tertiary'],
]

export default function ExploreCommunities() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <StudentSidebar />
      <TopBar
        sidebar="student"
        placeholder="Search clubs, events, or opportunities..."
        userName="Alex Rivera"
        userRole="Explorer"
        userImage="https://lh3.googleusercontent.com/aida-public/AB6AXuAXEzv0MUdACBK9NpPCAu8RPH2XPkUoYnnWppFwBaKbDB9w6C_ygcGKRfdZVbtXh_2d7mwQN1bDR5-6oQOkSIyfzBfQKPkzzFIZOIWeMp3Hj2HrTl_69kS7XMNNkvpVR9OAbSJ9xHJrM6exwiyVMyRmm3SPMaMBM-jF7q_DQf6ECsSLhGkeoi_1YvUi6e-uosg658-8mT7ejjRwcOhUtspu5iHWUtZN19V0dWtjPrl5AS1R3tIJzVx9kCHHCbTyYB8EjxwYhYVeXac"
      />

      <main className="px-4 pb-12 pt-24 lg:ml-64 lg:px-8 lg:pt-28">
        <div className="mx-auto flex max-w-[1440px] gap-8">
          <aside className="sticky top-28 hidden h-fit w-72 shrink-0 rounded-[28px] bg-surface-container-low p-8 lg:block">
            <h2 className="font-headline text-xl font-bold">Refine Search</h2>
            <div className="mt-8 space-y-8 text-sm">
              <div>
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">Category</p>
                <div className="space-y-3">
                  {['Technology', 'Business & Law', 'Arts & Culture'].map((item, idx) => (
                    <label key={item} className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked={idx === 1} className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-primary/20" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-16">
            <header className="relative overflow-hidden rounded-[32px] border border-outline-variant/10 bg-white p-12 shadow-[0_20px_40px_rgba(123,110,246,0.04)]">
              <div className="relative z-10 max-w-2xl">
                <h1 className="font-headline text-5xl font-extrabold tracking-tight">Discover Clubs & Communities</h1>
                <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">Join student communities, workshops, and campus events. Find your tribe in our curated ecosystem of excellence.</p>
              </div>
              <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary-fixed/30 blur-3xl" />
            </header>

            <section>
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Curation</span>
                <h2 className="font-headline mt-2 text-3xl font-bold">Spotlight Communities</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                {spotlight.map((club) => (
                  <Link
                    key={club.title}
                    to="/committee-detail"
                    className="block rounded-[24px] border border-outline-variant/10 bg-white p-8 transition-all hover:shadow-xl"
                  >
                    <div className="mb-6 flex items-start justify-between">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${club.tone}`}>
                        <span className="material-symbols-outlined scale-125">{club.icon}</span>
                      </div>
                      <span className="rounded-full bg-surface-container-low px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">{club.tag}</span>
                    </div>
                    <h3 className="font-headline text-xl font-bold">{club.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{club.blurb}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-outline-variant/10 pt-6">
                      <span className="text-xs font-bold text-on-surface-variant">{club.members}</span>
                      <span className="material-symbols-outlined text-outline-variant">arrow_forward</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-headline mb-8 text-3xl font-bold">Upcoming Events</h2>
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {events.map(([month, day, title, desc, to, tone]) => (
                  <article key={title} className="overflow-hidden rounded-[24px] border border-outline-variant/10 bg-white">
                    <div className="relative h-56 bg-surface-container-low">
                      <div className="absolute left-4 top-4 rounded-xl bg-white/90 px-3 py-1.5 text-center shadow-lg">
                        <span className="block text-xs font-bold leading-none">{month}</span>
                        <span className={`text-lg font-extrabold leading-none ${tone}`}>{day}</span>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="font-headline text-xl font-bold">{title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{desc}</p>
                      <Link to={to} className={`mt-8 inline-flex items-center gap-2 text-sm font-bold ${tone}`}>
                        View Details
                        <span className="material-symbols-outlined">arrow_right_alt</span>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
