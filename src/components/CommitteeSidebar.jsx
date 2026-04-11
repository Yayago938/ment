import { Link, NavLink } from 'react-router-dom'
import MaterialIcon from './MaterialIcon'

const committeeNav = [
  { to: '/committee-dashboard', icon: 'dashboard', label: 'Dashboard' },
  { to: '/committee/profile', icon: 'person', label: 'Profile' },
  { to: '/events/new', icon: 'event', label: 'Events', filled: true },
]

export default function CommitteeSidebar() {
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
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-on-surface-variant hover:translate-x-1 hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <MaterialIcon filled={isActive && item.filled}>{item.icon}</MaterialIcon>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button className="gradient-pill mt-auto rounded-full px-6 py-4 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02]">
        New Event
      </button>

      <Link to="/committee/profile" className="mt-8 flex items-center gap-3 border-t border-outline-variant/20 pt-6">
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
