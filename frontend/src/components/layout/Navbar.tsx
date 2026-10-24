import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Bell,
  Search,
  HelpCircle,
  Menu,
  X,
  Check,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import useAppStore from '../../store/useAppStore'
import { cn, formatRelativeTime } from '../../lib/utils'
import { Notification } from '../../types'

export default function Navbar() {
  const { user, notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useAppStore()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.notification-dropdown')) {
        setIsNotifOpen(false)
      }
      if (!target.closest('.search-container')) {
        setIsSearchOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const getNotificationIcon = (type: Notification['type']) => {
    const icons = {
      expiry_warning: '🕐',
      match_found: '🎯',
      pickup_scheduled: '🚚',
      pickup_confirmed: '✅',
      system_alert: '🔔',
      welcome: '👋',
    }
    return icons[type] || '📢'
  }

  return (
    <header className="h-16 bg-[#0b1510]/80 backdrop-blur-md border-b border-forest-600/30 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="search-container relative flex-1 max-w-md">
        <AnimatePresence mode="wait">
          {isSearchOpen ? (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inventory, recipients, pickups..."
                className="w-full bg-[#12241b] border border-forest-600/40 rounded-lg pl-10 pr-10 py-2 text-cream placeholder-stone-dark focus:outline-none focus:ring-2 focus:ring-botanical"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-forest-800 rounded text-stone hover:text-cream"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-stone hover:text-cream rounded-lg hover:bg-forest-800/40 transition-colors"
            >
              <Search className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Help */}
        <Link to="/settings" className="p-2 text-stone hover:text-cream rounded-lg hover:bg-forest-800/40 transition-colors">
          <HelpCircle className="w-5 h-5" />
        </Link>

        {/* Notifications */}
        <div className="notification-dropdown relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 text-stone hover:text-cream rounded-lg hover:bg-forest-800/40 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-botanical rounded-full" />
            )}
          </button>

          <AnimatePresence>
            {isNotifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 bg-[#0f291e] border border-forest-600/40 rounded-xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-forest-600/30 flex items-center justify-between">
                  <h3 className="font-semibold text-cream">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllNotificationsRead} className="text-xs text-botanical-light hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-stone text-sm">No notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          "p-4 border-b border-forest-600/20 hover:bg-forest-800/20 transition-colors cursor-pointer",
                          !notif.read && "bg-forest-900/30"
                        )}
                        onClick={() => markNotificationRead(notif.id)}
                      >
                        <div className="flex gap-3">
                          <span className="text-xl">{getNotificationIcon(notif.type)}</span>
                          <div>
                            <p className="text-sm text-cream">{notif.message}</p>
                            <p className="text-xs text-stone mt-1">{formatRelativeTime(notif.createdAt)}</p>
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

        {/* User profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-forest-600/30">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-cream">{user?.fullName}</p>
            <p className="text-xs text-stone capitalize">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-botanical flex items-center justify-center text-cream font-medium text-sm border border-forest-600/40">
            {user?.fullName?.split(' ').map(n => n[0]).join('')}
          </div>
        </div>
      </div>
    </header>
  )
}
