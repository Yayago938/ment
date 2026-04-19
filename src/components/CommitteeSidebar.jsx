import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import MaterialIcon from './MaterialIcon'

export default function CommitteeSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams()
  const storedCommitteeId = localStorage.getItem('committeeId')
  const committeeId = id || storedCommitteeId
  const basePath = committeeId ? `/committee/${committeeId}` : '/committee-dashboard'

  const committeeNav = [
    {
      key: 'dashboard',
      path: basePath,
      icon: 'dashboard',
      label: 'Dashboard',
      filled: true,
      isActive: location.pathname === basePath,
    },
    {
      key: 'applications',
      path: committeeId ? `${basePath}/applications` : '/applications',
      icon: 'description',
      label: 'Applications',
      isActive: committeeId
        ? location.pathname.includes(`${basePath}/applications`) || location.pathname.includes('/committee/interview/')
        : location.pathname.includes('/applications'),
    },
    {
      key: 'events',
      path: committeeId ? `${basePath}/events` : '/committee-dashboard',
      icon: 'event',
      filled: true,
      label: 'Events',
      isActive: committeeId
        ? location.pathname.includes(`${basePath}/events`) || location.pathname === `/committee/${committeeId}/events/new` || location.pathname.startsWith('/events/edit')
        : false,
    },
    {
      key: 'profile',
      path: committeeId ? `/committee/${committeeId}/profile/edit` : '/committee/profile/edit',
      icon: 'person',
      label: 'Committee Profile',
      isActive: committeeId
        ? location.pathname.includes(`/committee/${committeeId}/profile`)
        : location.pathname.includes('/committee/profile'),
    },
  ]

  const profileEditPath = committeeId ? `/committee/${committeeId}/profile/edit` : '/committee/profile/edit'

  return (
    <aside className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around bg-surface border-t border-outline-variant lg:top-0 lg:left-0 lg:h-screen lg:w-64 lg:flex-col lg:justify-start lg:border-t-0 lg:border-r lg:bg-[#f4f3fa] lg:px-6 lg:py-8">
      <div className="mb-12 hidden px-2 lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary-container text-white shadow-lg">
            <MaterialIcon filled>auto_awesome</MaterialIcon>
          </div>
          <div>
            <h1 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface">Mentorlink</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
              Committee Portal
            </p>
          </div>
        </div>
      </div>

      <nav className="flex w-full items-center justify-around lg:flex-col lg:items-start lg:justify-start lg:px-4 lg:py-6 lg:gap-2">
        {committeeNav.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`flex flex-col items-center justify-center text-xs transition-all duration-200 lg:w-full lg:flex-row lg:items-center lg:gap-3 lg:px-4 lg:py-3 lg:text-sm ${
              item.isActive
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:translate-x-1 hover:text-primary'
            }`}
          >
            <MaterialIcon filled={item.isActive && item.filled}>{item.icon}</MaterialIcon>
            <span className="hidden lg:inline">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto hidden space-y-3 lg:block">
        <button
          type="button"
          onClick={() => navigate(committeeId ? `/committee/${committeeId}/create-interview` : '/committee-dashboard')}
          className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          New Interview
        </button>

        <button
          type="button"
          onClick={() => navigate(committeeId ? `/committee/${committeeId}/events/new` : '/committee-dashboard')}
          className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          New Event
        </button>
      </div>

      <Link to={profileEditPath} className="mt-8 hidden items-center gap-3 border-t border-outline-variant/20 pt-6 lg:flex">
        <img
          className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/10"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlnMwMiijKv4SJYQ2_QLTHTAtBMGIIcsK_eIZFsEjO22G7PNZNaEemJvklXWhRzpTu7BbQdL3IS8dKkSEVZXMtLYv0tV_z3EwtyGj86ss0fDXNlY5J9Oe7kwgRs5Q0H1pbzlOMduQGuWiwtoYGWa1QKvqkRdfBRI7hILUxI1FLP05GSkj77_bLGakapEmdHcNzlf7T7Ju6lPSMIux-6N5yEBzkN5K_uc11oPeQV67J4pDbaEU1QrCT2SscFxRQ5LPiwjNDhmv3Acg"
          alt="Alex Rivera"
        />
        <div>
          <p className="text-sm font-bold text-on-surface">Alex Rivera</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
            Committee Lead
          </p>
        </div>
      </Link>
    </aside>
  )
}
