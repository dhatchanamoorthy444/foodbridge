import React, { useState, useEffect } from 'react'
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
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 bg-panel border-2 border-line rounded-[10px] p-5 shadow-[8px_8px_0_0_rgb(var(--fb-accent))] text-bone animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-[10px] border-2 border-harvest bg-harvest/10 text-harvest">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-base text-bone">Privacy & Cookie Notice</h3>
          <p className="text-xs text-muted leading-relaxed">
            We use essential session storage and authentication tokens to operate FoodBridge. No invasive marketing trackers are used. Read our{' '}
            <Link to="/cookies" className="text-harvest underline hover:text-accent-soft">Cookie Policy</Link> and{' '}
            <Link to="/privacy" className="text-harvest underline hover:text-accent-soft">Privacy Policy</Link>.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 bg-harvest hover:bg-accent-soft text-app-deep rounded-[10px] text-xs font-bold uppercase tracking-wider transition-all"
            >
              Accept Essential
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-1.5 bg-app-deep hover:bg-elevated text-muted rounded-[10px] text-xs font-bold uppercase tracking-wider border-2 border-line transition-all"
            >
              Reject Optional
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-muted hover:text-bone p-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
