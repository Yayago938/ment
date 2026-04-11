import React from 'react'

export default function TopNav({ userName = 'Alex Mercer', userRole = 'Curator', userImg, placeholder = 'Search the atelier...' }) {
  return (
    <header className="w-full sticky top-0 z-40 glass-header flex justify-between items-center px-8 py-3 shadow-ambient">
      <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-full w-96">
        <span className="material-symbols-outlined text-outline">search</span>
        <input
          className="bg-transparent border-none focus:ring-0 text-sm w-full font-body outline-none"
          placeholder={placeholder}
          type="text"
        />
      </div>
      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">mail</span>
          </button>
        </div>
        <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/20">
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface font-headline">{userName}</p>
            <p className="text-[10px] uppercase tracking-widest text-outline font-label">{userRole}</p>
          </div>
          {userImg ? (
            <img
              alt="User profile"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
              src={userImg}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center ring-2 ring-primary/20">
              <span className="material-symbols-outlined text-primary">person</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
