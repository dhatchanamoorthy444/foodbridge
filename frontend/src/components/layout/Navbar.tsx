import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import useAppStore from '../../store/useAppStore'
import { authService } from '../../services/api'
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../../hooks/useAppData'
import { formatRelativeTime } from '../../lib/utils'

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const user = useAppStore((s) => s.user)
  const logoutLocal = useAppStore((s) => s.logoutLocal)
  const [openNotifications, setOpenNotifications] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const notificationsQuery = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenNotifications(false)
        setOpenMenu(false)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const unread = notificationsQuery.data?.unread ?? 0
  const items = notificationsQuery.data?.data ?? []

  const displayName =
    user?.organization?.trim() ||
    user?.full_name ||
    user?.email?.split('@')[0] ||
    'Station Ops'

  const handleLogout = async () => {
    try {
      await authService.signOut()
    } catch {
      /* clear locally */
    }
    logoutLocal()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#090B09] border-b border-[#262E26] px-4 md:px-8 flex items-center justify-between" ref={rootRef}>
      {/* Left: Mobile Trigger & Telemetry indicator */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-[#B8BDB6] hover:bg-[#1C221C] transition-colors"
          aria-label="Toggle navigation"
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-[#D7EF4A] uppercase px-2.5 py-1 rounded bg-[#0D231A] border border-[#262E26] font-bold">
            RESILIENCE OPS
          </span>
          <div className="hidden sm:flex items-center gap-2">
            <span className="font-mono text-[11px] text-[#858C84] uppercase">TELEMETRY SYNC:</span>
            <span className="font-mono text-[11px] text-[#D7EF4A] font-bold">REAL-TIME ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions & Notifications */}
      <div className="flex items-center gap-3">
        {user?.role === 'donor' && (
          <Link
            to="/donor/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D7EF4A] text-[#090B09] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#E8F5A4] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>LOG BATCH</span>
          </Link>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setOpenNotifications((v) => !v)
              setOpenMenu(false)
            }}
            className="relative p-2.5 rounded-lg text-[#B8BDB6] hover:bg-[#1C221C] hover:text-white transition-colors"
            aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unread > 0 && (
              <span className="absolute 1.5 top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-[#FF5449] text-white text-[9px] font-bold flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          <AnimatePresence>
            {openNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 md:w-96 rounded-xl border border-[#262E26] bg-[#131713] shadow-2xl p-3 z-50"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#262E26]">
                  <div className="flex items-center gap-2">
                    <span className="font-['Anton'] text-sm uppercase text-white tracking-wide">Radar Alerts</span>
                    <span className="font-mono text-[10px] text-[#D7EF4A] font-bold">{unread} pending</span>
                  </div>
                  {unread > 0 && (
                    <button
                      onClick={() => markAllRead.mutate()}
                      className="font-mono text-[10px] uppercase text-[#B8BDB6] hover:text-[#D7EF4A] transition-colors"
                    >
                      Acknowledge all
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto space-y-1.5">
                  {items.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#858C84] uppercase font-mono">
                      All dispatch queues clear
                    </div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => !item.read && markRead.mutate(item.id)}
                        className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
                          item.read
                            ? 'bg-[#0E120E] border-[#262E26] text-[#858C84]'
                            : 'bg-[#1C221C] border-[#D7EF4A]/30 text-white'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold leading-tight">{item.title}</p>
                          <span className="font-mono text-[9px] text-[#858C84] whitespace-nowrap">
                            {formatRelativeTime(item.created_at)}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#B8BDB6] mt-1">{item.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setOpenMenu((v) => !v)
              setOpenNotifications(false)
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#1C221C] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#D7EF4A] text-[#090B09] flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {displayName[0]}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">{displayName}</span>
              <span className="font-mono text-[9px] text-[#D7EF4A] uppercase">{user?.role}</span>
            </div>
          </button>

          <AnimatePresence>
            {openMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 rounded-xl border border-[#262E26] bg-[#131713] shadow-2xl p-1.5 z-50"
              >
                <div className="px-3 py-2 border-b border-[#262E26]">
                  <p className="text-xs font-bold text-white truncate">{displayName}</p>
                  <p className="font-mono text-[9px] text-[#858C84] truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setOpenMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#B8BDB6] hover:text-white hover:bg-[#1C221C] rounded-lg transition-colors uppercase tracking-wider font-mono"
                  >
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                    Station Config
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-[#FF5449] hover:bg-[#410002] rounded-lg transition-colors uppercase tracking-wider font-mono text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Disconnect
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
