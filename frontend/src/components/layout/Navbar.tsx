import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  CheckCircle2,
  Heart,
  Search,
  Tag,
  Truck,
  X,
  AlertTriangle,
  ShieldAlert,
  Menu,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useAppStore from '../../store/useAppStore'
import { formatRelativeTime } from '../../lib/utils'
import { Notification } from '../../types'

const C = {
  primary: '#dfff00', primaryContainer: '#0e5c35',
  secondary: '#2bff88', secondaryFixed: '#6ffbbe', onSecondaryFixed: '#002113',
  surface: '#0a0a0a', surfaceLowest: '#141614',
  surfaceContainerLow: '#1b1e1b', surfaceContainer: '#232723',
  surfaceContainerHigh: '#2e322e',
  onSurface: '#ffffff', onSurfaceVariant: '#9aa39b',
  error: '#ff4d4d',
}

function getNotificationIcon(type: Notification['type']) {
  const icons: Record<string, React.ElementType> = {
    expiry_warning: AlertTriangle,
    match_found: Tag,
    pickup_scheduled: Truck,
    pickup_confirmed: CheckCircle2,
    system_alert: ShieldAlert,
    welcome: Heart,
  }
  const Icon = icons[type] || Bell
  return <Icon className="h-4 w-4" style={{ color: C.secondary }} strokeWidth={2.4} />
}

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useAppStore()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.notif-dropdown')) setIsNotifOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <header
      className="h-16 sticky top-0 z-30 flex items-center justify-between px-4 backdrop-blur-xl"
      style={{
        background: 'rgba(10,10,10,0.88)',
        boxShadow: '0 1px 8px rgba(0,0,0,0.04)',
        borderBottom: `1px solid ${C.surfaceContainerHigh}`,
      }}
    >
      {/* Left: mobile menu + search */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
          style={{ color: C.onSurfaceVariant }}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand on mobile when sidebar is hidden */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: C.primary }}>
            <Heart className="w-3.5 h-3.5" style={{ color: C.onSecondaryFixed }} strokeWidth={2.6} />
          </div>
          <span style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 18, color: C.primary, letterSpacing: '-0.01em' }}>FoodBridge</span>
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs ml-2 hidden sm:block">
          {isSearchOpen ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.onSurfaceVariant }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search surplus, farms, kitchens..."
                autoFocus
                className="w-full h-9 pl-10 pr-10 rounded-xl text-sm outline-none"
                style={{ background: C.surfaceContainerLow, border: `1px solid ${C.surfaceContainerHigh}`, color: C.onSurface, fontFamily: 'Rubik, sans-serif' }}
              />
              <button onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: C.onSurfaceVariant }}>
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 h-9 px-3 rounded-xl transition-colors"
              style={{ background: C.surfaceContainerLow, color: C.onSurfaceVariant, fontFamily: 'Rubik, sans-serif', fontSize: 13 }}
              aria-label="Search">
              <Search className="w-4 h-4" />
              <span className="hidden md:block">Search…</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-2 flex-shrink-0">

        {/* Notifications */}
        <div className="notif-dropdown relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative w-10 h-10 flex items-center justify-center rounded-xl transition-all active:scale-95"
            style={{ color: C.onSurfaceVariant }}
            aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[1rem] px-1 items-center justify-center rounded-full font-bold text-[9px] shadow"
                style={{ background: C.error, color: 'white', fontFamily: 'Be Vietnam Pro, sans-serif' }}>
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 rounded-2xl overflow-hidden shadow-xl z-50"
                style={{ background: C.surfaceLowest, border: `1px solid ${C.surfaceContainerHigh}` }}
              >
                <div className="px-4 py-3 flex items-center justify-between"
                  style={{ borderBottom: `1px solid ${C.surfaceContainerHigh}` }}>
                  <h3 style={{ fontFamily: 'Rubik, sans-serif', fontSize: 14, fontWeight: 700, color: C.onSurface }}>Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllNotificationsRead}
                      style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 11, fontWeight: 700, color: C.secondary, letterSpacing: '0.04em' }}>
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center" style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, color: C.onSurfaceVariant }}>
                      No notifications
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        className="p-4 cursor-pointer transition-colors"
                        style={{
                          borderBottom: `1px solid ${C.surfaceContainerHigh}`,
                          background: notif.read ? 'transparent' : C.surfaceContainerLow,
                        }}
                        onClick={() => markNotificationRead(notif.id)}
                      >
                        <div className="flex gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                            style={{ background: C.surfaceContainer, border: `1px solid ${C.surfaceContainerHigh}` }}>
                            {getNotificationIcon(notif.type)}
                          </span>
                          <div>
                            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, color: C.onSurface }}>{notif.message}</p>
                            <p style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, color: C.onSurfaceVariant, marginTop: 2 }}>
                              {formatRelativeTime(notif.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile avatar */}
        <Link
          to="/settings"
          className="flex items-center gap-2.5 pl-3"
          style={{ borderLeft: `1px solid ${C.surfaceContainerHigh}` }}
        >
          <div className="text-right hidden sm:block">
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, fontWeight: 600, color: C.onSurface }}>{user?.fullName}</p>
            <p style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 9, fontWeight: 700, color: C.secondary, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shadow-sm"
            style={{ background: C.primaryContainer, color: C.secondaryFixed, fontFamily: 'Anton, Impact, sans-serif', fontSize: 15 }}>
            {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
          </div>
        </Link>
      </div>
    </header>
  )
}
