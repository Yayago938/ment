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
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-black/5 bg-[#faf8ff] px-6 py-8 shadow-[8px_0_30px_rgba(123,110,246,0.04)] lg:flex">
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
              `premium-nav-item ${isActive ? 'premium-nav-active' : ''} group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ease-out ${
                isActive
                  ? 'border-primary/10 bg-white text-primary shadow-[0_10px_24px_rgba(123,110,246,0.10)]'
                  : 'border-transparent text-on-surface-variant hover:border-black/5 hover:bg-white/90 hover:text-primary hover:shadow-sm hover:-translate-y-0.5'
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
