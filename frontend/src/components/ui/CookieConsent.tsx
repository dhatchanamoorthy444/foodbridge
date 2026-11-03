import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Cookie, X } from 'lucide-react'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('foodbridge_cookie_consent')
    if (!consent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('foodbridge_cookie_consent', 'accepted')
    setIsVisible(false)
  }

  const handleReject = () => {
    localStorage.setItem('foodbridge_cookie_consent', 'rejected')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <section
      aria-label="Privacy and cookie notice"
      className="fixed bottom-4 left-4 right-4 z-50 max-w-md rounded-2xl border border-line bg-panel p-5 text-bone shadow-[0_24px_60px_-32px_rgba(0,0,0,0.9)] animate-slide-up md:bottom-6 md:left-6 md:right-auto"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-elevated text-primary-fixed">
          <Cookie className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <h2 className="text-base font-bold text-bone">Privacy &amp; Cookie Notice</h2>
          <p className="text-xs leading-relaxed text-muted">
            We use essential session storage and authentication tokens to operate
            FoodBridge. No invasive marketing trackers are used. Read our{' '}
            <Link
              to="/cookies"
              className="font-semibold text-primary-fixed underline underline-offset-2 hover:text-bone"
            >
              Cookie Policy
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy"
              className="font-semibold text-primary-fixed underline underline-offset-2 hover:text-bone"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleAccept}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-on-primary transition-colors hover:bg-primary-hover focus-ring"
            >
              Accept Essential
            </button>
            <button
              type="button"
              onClick={handleReject}
              className="rounded-lg border border-line bg-elevated px-4 py-2 text-xs font-bold uppercase tracking-wider text-bone transition-colors hover:border-primary-fixed/50 hover:bg-surface-high focus-ring"
            >
              Reject Optional
            </button>
            <Link
              to="/cookies"
              className="px-1 py-2 text-xs font-semibold text-muted underline underline-offset-2 hover:text-bone focus-ring"
            >
              Manage
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-elevated hover:text-bone focus-ring"
          aria-label="Dismiss cookie notice"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
