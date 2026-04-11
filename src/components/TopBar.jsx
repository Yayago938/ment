import { Link } from 'react-router-dom'
import MaterialIcon from './MaterialIcon'

export default function TopBar({
  sidebar = 'student',
  placeholder,
  userName,
  userRole,
  userImage,
  actions = ['notifications'],
  notificationsTo,
  profileTo,
}) {
  const resolvedNotificationsTo = notificationsTo || (sidebar === 'committee' ? '/committee/notifications' : '/notifications')
  const resolvedProfileTo = profileTo || (sidebar === 'committee' ? '/committee/profile' : '/profile')
  const contentOffset = sidebar === 'committee' ? 'lg:ml-64' : 'lg:pl-64'
  const headerOffset = sidebar === 'committee' ? 'lg:left-64 lg:w-[calc(100%-16rem)]' : 'lg:left-0 lg:w-full'

  return (
    <header
      className={`glass-panel fixed top-0 z-40 flex h-20 items-center justify-between px-6 shadow-[0_20px_40px_rgba(123,110,246,0.08)] ${headerOffset} w-full`}
    >
      <div className={`flex flex-1 items-center ${contentOffset}`}>
        <div className="relative w-full max-w-xl">
          <MaterialIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </MaterialIcon>
          <input
            className="w-full rounded-full border-none bg-surface-container-low py-3 pl-12 pr-4 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/20"
            placeholder={placeholder}
            type="text"
          />
        </div>
      </div>

      <div className="hidden items-center gap-5 lg:flex">
        <div className="flex items-center gap-2">
          {actions.map((action) => (
            action === 'notifications' ? (
              <Link
                key={action}
                to={resolvedNotificationsTo}
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-white hover:text-primary"
              >
                <MaterialIcon>{action}</MaterialIcon>
              </Link>
            ) : (
              <button
                key={action}
                className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-white hover:text-primary"
              >
                <MaterialIcon>{action}</MaterialIcon>
              </button>
            )
          ))}
        </div>
        <div className="h-8 w-px bg-outline-variant/30" />
        <Link to={resolvedProfileTo} className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface">{userName}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
              {userRole}
            </p>
          </div>
          <img className="h-10 w-10 rounded-full object-cover ring-2 ring-white" src={userImage} alt={userName} />
        </Link>
      </div>
    </header>
  )
}
