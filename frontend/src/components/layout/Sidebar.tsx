import { NavLink, useLocation } from 'react-router-dom'
import {
  Home,
  Search,
  Truck,
  LayoutDashboard,
  Settings,
  LogOut,
  Store,
  Users,
  BarChart3,
  Plus,
  Heart,
} from 'lucide-react'
import useAppStore from '../../store/useAppStore'

const C = {
  primary: '#dfff00', primaryContainer: '#0e5c35',
  secondary: '#2bff88', secondaryFixed: '#6ffbbe', onSecondaryFixed: '#002113',
  surface: '#0a0a0a', surfaceLowest: '#141614',
  surfaceContainerLow: '#1b1e1b', surfaceContainer: '#232723',
  surfaceContainerHigh: '#2e322e',
  onSurface: '#ffffff', onSurfaceVariant: '#9aa39b',
  error: '#ff4d4d', errorContainer: '#3a1414',
}

interface NavItem {
  label: string
  icon: React.ElementType
  path: string
}

const navItems: NavItem[] = [
  { label: 'Home',      icon: Home,            path: '/' },
  { label: 'Explore',   icon: Search,          path: '/matching' },
  { label: 'Pickups',   icon: Truck,           path: '/pickups' },
  { label: 'Inventory', icon: LayoutDashboard, path: '/inventory' },
  { label: 'Analytics', icon: BarChart3,       path: '/analytics' },
  { label: 'Settings',  icon: Settings,        path: '/settings' },
]

function getInitials(name?: string) {
  return name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'
}

export default function Sidebar() {
  const { user, logout } = useAppStore()
  const location = useLocation()

  return (
    <div className="flex flex-col h-full" style={{ background: C.surfaceContainerLow, borderRight: `1px solid ${C.surfaceContainerHigh}` }}>

      {/* Logo */}
      <div className="p-4" style={{ borderBottom: `1px solid ${C.surfaceContainerHigh}` }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: C.primary }}>
            <Heart className="w-4 h-4" style={{ color: C.onSecondaryFixed }} strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <span className="block truncate"
              style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 20, color: C.primary, lineHeight: '26px', letterSpacing: '-0.01em' }}>
              FoodBridge
            </span>
            <span className="block"
              style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 9, fontWeight: 700, color: C.secondary, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Redistribution Portal
            </span>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto pb-2">
        {navItems.map(item => {
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path)
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10,
                transition: 'all 0.12s',
                background: isActive ? C.primaryContainer : 'transparent',
                color: isActive ? 'white' : C.onSurfaceVariant,
                fontFamily: 'Rubik, sans-serif', fontSize: 14, fontWeight: isActive ? 600 : 500,
                textDecoration: 'none',
              }}
            >
              <Icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: C.secondaryFixed }} />
              )}
            </NavLink>
          )
        })}

        {/* New Donation CTA */}
        <div className="pt-3">
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-sm"
            style={{ background: C.primary, color: C.onSecondaryFixed, fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 12, letterSpacing: '0.04em' }}>
            <Plus className="w-4 h-4" />
            New Donation
          </button>
        </div>
      </nav>

      {/* User footer */}
      <div className="p-3" style={{ borderTop: `1px solid ${C.surfaceContainerHigh}` }}>
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl" style={{ background: C.surface }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
            style={{ background: C.primaryContainer, color: C.secondaryFixed, fontFamily: 'Anton, Impact, sans-serif', fontSize: 16 }}>
            {getInitials(user?.fullName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate" style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, fontWeight: 600, color: C.onSurface }}>{user?.fullName || 'User'}</p>
            <p className="flex items-center gap-1"
              style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 9, fontWeight: 700, color: C.secondary, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {user?.role === 'donor'     && <Store    className="w-3 h-3" />}
              {user?.role === 'recipient' && <Users    className="w-3 h-3" />}
              {(user?.role === 'admin' || user?.role === 'volunteer') && <BarChart3 className="w-3 h-3" />}
              {user?.role || 'donor'}
            </p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg transition-colors"
            style={{ color: C.onSurfaceVariant }}
            aria-label="Log out"
            onMouseEnter={e => (e.currentTarget.style.color = C.error)}
            onMouseLeave={e => (e.currentTarget.style.color = C.onSurfaceVariant)}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
