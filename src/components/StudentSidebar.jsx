import { NavLink } from 'react-router-dom'
import MaterialIcon from './MaterialIcon'

const studentNav = [
  { to: '/student-dashboard', icon: 'home', label: 'Home' },
  { to: '/explore', icon: 'explore', label: 'Explore' },
  { to: '/applications', icon: 'description', label: 'Applications' },
  { to: '/profile', icon: 'person', label: 'Profile' },
]

export default function StudentSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-white/40 bg-[#faf8ff] px-6 py-8 lg:flex">
      <div className="mb-12">
        <h1 className="font-headline text-2xl font-extrabold tracking-tight text-primary">MentorLink</h1>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
          Student Portal
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {studentNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-white hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <MaterialIcon filled={isActive}>{item.icon}</MaterialIcon>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
