import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import useEmergencyStore from '../../store/useEmergencyStore'
import useAppStore from '../../store/useAppStore'

export function EmergencyFoodToast() {
  const navigate = useNavigate()
  const notifications = useEmergencyStore((s) => s.notifications)
  const markNotificationRead = useEmergencyStore((s) => s.markNotificationRead)
  const user = useAppStore((s) => s.user)
  const isRecipient = user?.role === 'recipient'

  useEffect(() => {
    // Only show toast for recipients (acceptors)
    if (!isRecipient) return

    // Find unread emergency notifications
    const unreadEmergency = notifications.filter(
      (n) => !n.read && n.type === 'emergency_food'
    )

    // Show toast for the most recent unread notification
    if (unreadEmergency.length > 0) {
      const latest = unreadEmergency[0]

      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-[#410002] border-2 border-[#FF5449] shadow-2xl rounded-xl pointer-events-auto flex items-start gap-3 p-4`}
          >
            <div className="flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-[#FFDAD6] animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFDAD6]">
                  🚨 Emergency Food Alert
                </span>
              </div>
              <p className="text-sm font-bold text-white leading-tight mb-1">
                {latest.foodName}
              </p>
              <p className="text-xs text-[#FFDAD6] leading-tight mb-2">
                {latest.quantity} {latest.unit} from {latest.donorName}
                {latest.expiresAt && (
                  <span className="ml-1">
                    • Expires soon!
                  </span>
                )}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    markNotificationRead(latest.id)
                    navigate('/pickups')
                    toast.dismiss(t.id)
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#D7EF4A] text-[#090B09] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#E8F5A4] transition-all"
                >
                  View in Pickups →
                </button>
                <button
                  onClick={() => {
                    markNotificationRead(latest.id)
                    toast.dismiss(t.id)
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#262E26] text-[#B8BDB6] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#1C221C] transition-all"
                >
                  Dismiss
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                markNotificationRead(latest.id)
                toast.dismiss(t.id)
              }}
              className="flex-shrink-0 text-[#858C84] hover:text-[#FFDAD6] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        ),
        {
          duration: 10000, // 10 seconds
          position: 'top-center',
          id: `emergency-${latest.id}`, // Prevent duplicates
        }
      )
    }
  }, [notifications, isRecipient, navigate, markNotificationRead])

  return null
}
