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
        ? location.pathname.includes(`${basePath}/applications`)
        : location.pathname.includes('/applications'),
    },
    {
      key: 'events',
      path: committeeId ? `${basePath}/events` : '/events/new',
      icon: 'event',
      filled: true,
      label: 'Events',
      isActive: committeeId
        ? location.pathname.includes(`${basePath}/events`) || location.pathname.startsWith('/events/edit') || location.pathname === '/events/new'
        : location.pathname === '/events/new',
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
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col bg-[#f4f3fa] px-6 py-8 lg:flex">
      <div className="mb-12 px-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary-container text-white shadow-lg">
            <MaterialIcon filled>auto_awesome</MaterialIcon>
          </div>
          <div>
            <h1 className="font-headline text-2xl font-extrabold tracking-tight text-on-surface">The Atelier</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
              Committee Portal
            </p>
          </div>
        </div>
      </div>

      <nav className="space-y-2">
        {committeeNav.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => navigate(item.path)}
            className={`flex w-full items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition-all ${
              item.isActive
                ? 'bg-white text-primary shadow-sm'
                : 'text-on-surface-variant hover:translate-x-1 hover:text-primary'
            }`}
          >
            <MaterialIcon filled={item.isActive && item.filled}>{item.icon}</MaterialIcon>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        type="button"
        onClick={() => navigate('/events/new')}
        className="gradient-pill mt-auto rounded-full px-6 py-4 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02]"
      >
        New Event
      </button>

      <Link to={profileEditPath} className="mt-8 flex items-center gap-3 border-t border-outline-variant/20 pt-6">
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
