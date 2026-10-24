import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Utensils,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import useAppStore from '../../store/useAppStore'
import { UserRole } from '../../types'
import { Dynamic3DScene } from '../animations/Dynamic3DScene'

interface NavItem {
  label: string
  icon: React.ElementType
  path: string
  roles: UserRole[]
  badge?: number
  scene: 'dashboard' | 'inventory' | 'matching' | 'pickups' | 'analytics'
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
    roles: ['donor', 'recipient', 'admin', 'volunteer'],
    badge: 3,
    scene: 'dashboard',
  },
  {
    label: 'Inventory',
    icon: Package,
    path: '/inventory',
    roles: ['donor', 'admin'],
    badge: 5,
    scene: 'inventory',
  },
  {
    label: 'Matching',
    icon: Users,
    path: '/matching',
    roles: ['recipient', 'admin'],
    badge: 2,
    scene: 'matching',
  },
  {
    label: 'Pickups',
    icon: Truck,
    path: '/pickups',
    roles: ['donor', 'recipient', 'volunteer', 'admin'],
    badge: 1,
    scene: 'pickups',
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    roles: ['admin'],
    scene: 'analytics',
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    roles: ['donor', 'recipient', 'admin', 'volunteer'],
    scene: 'dashboard', // Fallback
  },
]

export default function Sidebar() {
  const { user, logout } = useAppStore()
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeScene, setActiveScene] = useState<NavItem['scene']>('dashboard')

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  )

  return (
    <div className="flex flex-col h-full bg-[#0b1510]">
      {/* Interactive 3D Preview Area */}
      <div className="h-40 border-b border-forest-600/30 overflow-hidden relative">
        <Dynamic3DScene sceneType={activeScene} />
      </div>

      {/* Logo */}
      <div className="p-4 border-b border-forest-600/30">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-botanical flex items-center justify-center">
            <Utensils className="w-5 h-5 text-cream" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg text-cream">FoodBridge</span>
            <span className="text-[10px] text-stone uppercase tracking-widest font-mono">Resilience System</span>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setActiveScene(item.scene)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group',
                isActive
                  ? 'bg-botanical/20 text-cream border border-botanical/40'
                  : 'text-stone hover:text-cream hover:bg-forest-800/40'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'text-botanical-light')} />
              <span className="flex-1 font-medium">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-forest-900 text-stone rounded-full">
                  {item.badge}
                </span>
              )}
              <div className="absolute inset-0 rounded-lg bg-botanical/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </NavLink>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-forest-600/30">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-stone hover:text-cream hover:bg-forest-800/40 transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-botanical flex items-center justify-center text-cream font-semibold text-xs border border-forest-600/40">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-cream truncate">
              {user?.fullName || 'User'}
            </p>
            <p className="text-[10px] text-stone uppercase tracking-wider">{user?.role || 'Guest'}</p>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 space-y-1"
          >
            <NavLink
              to="/settings"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-stone hover:text-cream hover:bg-forest-800/40 transition-all duration-200"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </NavLink>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-950/30 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
