import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { icon: 'home', label: 'Home', path: '/student-dashboard' },
  { icon: 'explore', label: 'Explore', path: '/committee-detail', filled: false },
  { icon: 'description', label: 'Applications', path: '/applications', filled: true },
  { icon: 'person', label: 'Profile', path: '/profile' },
]

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#FAF8FF] flex flex-col py-8 px-6 gap-y-2 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary-container rounded-xl flex items-center justify-center text-white shadow-lg">
          <span className="material-symbols-outlined filled-icon">auto_awesome</span>
        </div>
        <div>
          <div className="text-[#1a1b20] font-extrabold text-2xl leading-none font-headline tracking-tighter">MentorLink</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/committee-detail' && location.pathname === '/committee-detail') ||
            (item.path === '/applications' && location.pathname === '/applications')
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 font-headline text-sm transition-all duration-300 ${
                isActive
                  ? 'text-[#5545ce] font-bold bg-[#F4F3FA] rounded-r-full'
                  : 'text-[#474554] hover:text-[#5545ce] hover:translate-x-1'
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={isActive && item.filled ? { fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" } : {}}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
