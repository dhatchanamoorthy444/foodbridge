import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Bell, CheckCheck, LogOut, Settings as SettingsIcon, User as UserIcon } from 'lucide-react'
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
    user?.email.split('@')[0] ||
    'Account'

  const handleLogout = async () => {
    try {
      await authService.signOut()
    } catch {
      /* clearing local state regardless */
    }
    logoutLocal()
    window.location.assign('/')
  }

  return (
    <header className="sticky top-0 z-30 bg-app border-b border-line" ref={rootRef}>
      <div className="h-14 px-3 md:px-4 flex items-center justify-between gap-2">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-text-2 hover:bg-elevated transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo (mobile) */}
        <Link to="/" className="md:hidden flex items-center gap-2">
          <img src="/stickers/cream/01_brand_and_donation/foodbridge_logo.png" alt="FoodBridge logo" className="h-8 w-8 object-contain" />
          <span className="font-display text-lg text-text tracking-tight">FOODBRIDGE</span>
        </Link>

        <div className="hidden md:flex items-center gap-2 min-w-0">
          <span className="font-label-sm text-[11px] uppercase tracking-widest text-text-3">
            {user?.role === 'donor' ? 'Donor workspace' : 'Recipient workspace'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setOpenNotifications((v) => !v); setOpenMenu(false) }}
              className="relative p-2 rounded-lg text-text-2 hover:bg-elevated transition-colors"
              aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
            >
              <Bell className="w-5 h-5" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
              {notificationsQuery.connected && unread === 0 && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-secondary" aria-label="Live" />
              )}
            </button>

            <AnimatePresence>
              {openNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 mt-2 w-[320px] max-h-[420px] overflow-y-auto rounded-xl bg-panel border border-line shadow-popover z-50"
                >
                  <div className="flex items-center justify-between px-3 py-2 border-b border-line">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-text-2">Notifications</p>
                    <button
                      onClick={() => markAllRead.mutate()}
                      disabled={markAllRead.isPending || unread === 0}
                      className="text-[11px] font-semibold text-primary-fixed hover:text-text transition-colors disabled:opacity-40"
                    >
                      Mark all read
                    </button>
                  </div>
                  {notificationsQuery.isLoading ? (
                    <div className="p-4 text-center text-sm text-text-2">Loadingâ€¦</div>
                  ) : items.length === 0 ? (
                    <div className="p-6 text-center">
                      <Bell className="w-6 h-6 mx-auto mb-2 text-text-3" />
                      <p className="text-sm text-text-2">No notifications yet</p>
                      <p className="text-[12px] text-text-3 mt-0.5">Activity on your food will appear here</p>
                    </div>
                  ) : (
                    <ul>
                      {items.slice(0, 20).map((n) => (
                        <li key={n.id} className={`px-3 py-2.5 border-b border-line last:border-b-0 ${!n.read ? 'bg-elevated/60' : ''}`}>
                          <button
                            onClick={() => { if (!n.read) markRead.mutate(n.id) }}
                            className="w-full text-left"
                          >
                            <div className="flex items-start gap-2">
                              <span className={`mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${n.read ? 'bg-line' : 'bg-primary'}`} />
                              <div className="min-w-0">
                                <p className={`text-[13px] leading-snug ${n.read ? 'text-text-2' : 'text-text font-medium'}`}>{n.title}</p>
                                <p className="text-[12px] text-text-3 leading-snug line-clamp-2">{n.message}</p>
                                <p className="text-[10px] text-text-3 mt-0.5">{formatRelativeTime(n.created_at)}</p>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Account menu */}
          <div className="relative">
            <button
              onClick={() => { setOpenMenu((v) => !v); setOpenNotifications(false) }}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-lg hover:bg-elevated transition-colors"
              aria-label="Account menu"
            >
              <span className="h-8 w-8 rounded-full bg-primary-container text-on-primary-container text-[12px] font-bold flex items-center justify-center uppercase">
                {displayName.slice(0, 1)}
              </span>
              <span className="hidden md:block max-w-[140px] truncate text-[13px] font-semibold text-text">{displayName}</span>
            </button>

            <AnimatePresence>
              {openMenu && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.16 }}
                  className="absolute right-0 mt-2 w-52 rounded-xl bg-panel border border-line shadow-popover z-50 overflow-hidden">
                  <div className="px-3 py-2.5 border-b border-line">
                    <p className="text-[13px] font-semibold text-text truncate">{displayName}</p>
                    <p className="text-[11px] text-text-3 truncate">{user?.email}</p>
                  </div>
                  <Link to="/settings" onClick={() => setOpenMenu(false)} className="flex items-center gap-2 px-3 py-2.5 text-[13px] text-text-2 hover:text-text hover:bg-elevated transition-colors">
                    <SettingsIcon className="w-4 h-4" /> Settings
                  </Link>
                  <Link to="/" onClick={() => setOpenMenu(false)} className="flex items-center gap-2 px-3 py-2.5 text-[13px] text-text-2 hover:text-text hover:bg-elevated transition-colors">
                    <UserIcon className="w-4 h-4" /> My workspace
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-danger hover:bg-danger-soft transition-colors border-t border-line">
                    <LogOut className="w-4 h-4" /> Sign out <CheckCheck className="w-0 h-0" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}
