import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import useAppStore from '../../store/useAppStore'
import { authService } from '../../services/api'
import { cn } from '../../lib/utils'

interface NavItem {
  label: string
  icon: string
  path: string
  badge?: string
}

export default function Sidebar() {
  const user = useAppStore((s) => s.user)
  const logoutLocal = useAppStore((s) => s.logoutLocal)
  const location = useLocation()
  const navigate = useNavigate()

  const isDonor = user?.role === 'donor'

  const links: NavItem[] = isDonor
    ? [
        { label: 'Donor Command', icon: 'inventory_2', path: '/donor' },
        { label: 'Log Surplus', icon: 'add_circle', path: '/donor/new' },
        { label: 'Dispatch & Logistics', icon: 'local_shipping', path: '/pickups' },
        { label: 'Emergency Radar', icon: 'crisis_alert', path: '/alerts' },
        { label: 'Station Settings', icon: 'tune', path: '/settings' },
      ]
    : [
        { label: 'Marketplace', icon: 'storefront', path: '/browse' },
        { label: 'My Allocations', icon: 'receipt_long', path: '/my-requests' },
        { label: 'Emergency Alerts', icon: 'crisis_alert', path: '/alerts' },
        { label: 'Pickup Transits', icon: 'local_shipping', path: '/pickups' },
        { label: 'Hub Settings', icon: 'tune', path: '/settings' },
      ]

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
    <aside className="h-full w-full bg-[#090B09] border-r border-[#262E26] flex flex-col justify-between select-none">
      <div className="flex flex-col">
        {/* Brand Banner */}
        <div className="h-20 px-4 border-b border-[#262E26] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#143527] border border-[#262E26] flex items-center justify-center p-1.5 shadow-sm overflow-hidden flex-shrink-0">
            <img
              alt="FoodBridge Logo"
              className="w-full h-full object-contain"
              src="/stickers/cream/01_brand_and_donation/foodbridge_logo.png"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-['Anton'] text-[20px] text-white tracking-wide uppercase">FoodBridge</span>
              <span className="material-symbols-outlined text-[#D7EF4A] text-[16px]">favorite</span>
            </div>
            <span className="font-mono text-[10px] text-[#D7EF4A] tracking-wider uppercase font-semibold">
              {isDonor ? 'OPS COMMAND NODE' : 'BENEFICIARY NETWORK'}
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 p-3">
          {links.map((item) => {
            const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold transition-all',
                  active
                    ? 'bg-[#D7EF4A] text-[#090B09] shadow-md font-extrabold'
                    : 'text-[#B8BDB6] hover:bg-[#131713] hover:text-white'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className={cn('material-symbols-outlined text-[20px]', active ? 'text-[#090B09]' : 'text-[#D7EF4A]')}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#410002] text-[#FF5449]">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>

      {/* Telemetry Footer */}
      <div className="p-3 border-t border-[#262E26] bg-[#070807] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D7EF4A] animate-ping" />
            <span className="font-mono text-[10px] text-[#F6F7F2] uppercase tracking-wider font-semibold">
              TELEMETRY: ONLINE
            </span>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="text-[#858C84] hover:text-[#FF5449] transition-colors p-1"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>

        {/* User identification badge */}
        <div className="p-2.5 rounded-lg bg-[#131713] border border-[#262E26] flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#143527] flex items-center justify-center text-[#D7EF4A] font-bold text-xs uppercase">
            {(user?.organization || user?.full_name || user?.email || 'U')[0]}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-white truncate">
              {user?.organization || user?.full_name || 'Station Operator'}
            </span>
            <span className="font-mono text-[9px] text-[#858C84] truncate uppercase">
              {user?.role} // ID: {user?.id?.slice(0, 8)}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
