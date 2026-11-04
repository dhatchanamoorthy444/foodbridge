import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  Search,
  Truck,
  LayoutDashboard,
  Settings,
  LogOut,
  Plus,
  HeartHandshake,
  AlarmClock,
  ClipboardList,
  BarChart3,
} from 'lucide-react'
import useAppStore from '../../store/useAppStore'
import { authService } from '../../services/api'
import { cn } from '../../lib/utils'

interface NavItem {
  label: string
  icon: React.ElementType
  path: string
}

const DONOR_LINKS: NavItem[] = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Donations', icon: LayoutDashboard, path: '/donor' },
  { label: 'New Donation', icon: Plus, path: '/donor/new' },
  { label: 'Pickups', icon: Truck, path: '/pickups' },
  { label: 'Emergency Alerts', icon: AlarmClock, path: '/alerts' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

const RECIPIENT_LINKS: NavItem[] = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Browse Donations', icon: Search, path: '/browse' },
  { label: 'My Requests', icon: ClipboardList, path: '/my-requests' },
  { label: 'Emergency Alerts', icon: AlarmClock, path: '/alerts' },
  { label: 'Pickups', icon: Truck, path: '/pickups' },
  { label: 'Settings', icon: Settings, path: '/settings' },
]

export default function Sidebar() {
  const user = useAppStore((s) => s.user)
  const logoutLocal = useAppStore((s) => s.logoutLocal)
  const location = useLocation()
  const navigate = useNavigate()

  const links = user?.role === 'donor' ? DONOR_LINKS : RECIPIENT_LINKS
  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  const handleLogout = async () => {
    try {
      await authService.signOut()
    } catch {
      /* clearing local state regardless */
    }
    logoutLocal()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex flex-col h-full bg-panel border-r border-line">
      {/* Logo */}
      <div className="p-4 border-b border-line">
        <div className="flex items-center gap-3">
          <img
            src="/stickers/cream/01_brand_and_donation/foodbridge_logo.png"
            alt="FoodBridge logo"
            className="h-10 w-10 object-contain"
          />
          <div className="min-w-0">
            <p className="font-display text-lg leading-none text-text tracking-tight">FOODBRIDGE</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-primary-fixed">
              Connect · Donate · Feed
            </p>
          </div>
        </div>
      </div>

      {/* Workspace chip */}
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 rounded-lg bg-elevated px-2.5 py-2">
          <HeartHandshake className="w-4 h-4 text-primary-fixed flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-text-3 font-bold">
              {user?.role === 'donor' ? 'Donor' : 'Recipient'}
            </p>
            <p className="text-[12px] font-semibold text-text truncate">
              {user?.organization?.trim() || user?.full_name || user?.email.split('@')[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto p-3 mt-2 space-y-0.5">
        {links.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-colors',
              isActive(item.path)
                ? 'bg-primary text-on-primary font-semibold shadow-[0_6px_20px_-12px_rgb(var(--fb-primary)/0.6)]'
                : 'text-text-2 hover:text-text hover:bg-elevated'
            )}
          >
            <item.icon className={cn('h-4 w-4', isActive(item.path) ? 'text-on-primary' : 'text-text-3')} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-line">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-text-2 hover:text-danger hover:bg-danger-soft transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
        {user?.role === 'donor' && (
          <div className="mt-2 flex items-center gap-2 text-[10px] text-text-3">
            <BarChart3 className="h-3 w-3" /> Live inventory sync active
          </div>
        )}
      </div>
    </div>
  )
}
