import { Link, NavLink } from 'react-router-dom'
import MaterialIcon from './MaterialIcon'

const studentNav = [
  { to: '/student-dashboard', icon: 'home', label: 'Home' },
  { to: '/explore', icon: 'explore', label: 'Explore' },
  { to: '/applications', icon: 'description', label: 'Applications' },
  { to: '/profile', icon: 'person', label: 'Profile' },
]

export default function StudentSidebar() {
  const userName = localStorage.getItem('userName') || 'Student'

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

      <Link to="/profile" className="mt-8 flex items-center gap-3 border-t border-outline-variant/20 pt-6">
        <img
          className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/10"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpnlTjpqYIsCoZ5khwkRrFm8_emkxZGSfsWQtl_6IdianwZU7Za24L8fsTlufqaghErqy1IKVItEGcwE4v5qH6_FQW84epxB0e5AsMJVot1T2rOPtXrH--WUv3MH8k5y6QcDf-L_01oVI6aSLzglmGpr6WYngyOJycmJbFB80AfRa6Y2rBj0qsHZO96vrnNhNrwmw-mDxvN6Np0pn119Ewhv132eUndE6nkNQB6djZUgap2v_dR42L4s-ZkengTiC0pCSn9AqB8_4"
          alt={userName}
        />
        <div>
          <p className="text-sm font-bold text-on-surface">{userName}</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
            Student
          </p>
        </div>
      </Link>
    </aside>
  )
}
