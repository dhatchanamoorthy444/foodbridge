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
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-50 bg-[#16382a] border border-forest-600/50 rounded-xl p-5 shadow-2xl text-cream animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-botanical/20 text-botanical-light">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-serif font-semibold text-base text-cream">Privacy & Cookie Notice</h3>
          <p className="text-xs text-stone leading-relaxed">
            We use essential session storage and authentication tokens to operate FoodBridge. No invasive marketing trackers are used. Read our{' '}
            <Link to="/cookies" className="text-botanical-light underline hover:text-cream">Cookie Policy</Link> and{' '}
            <Link to="/privacy" className="text-botanical-light underline hover:text-cream">Privacy Policy</Link>.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleAccept}
              className="px-4 py-1.5 bg-botanical hover:bg-botanical-light text-cream rounded-lg text-xs font-medium transition-all"
            >
              Accept Essential
            </button>
            <button
              onClick={handleReject}
              className="px-4 py-1.5 bg-forest-800 hover:bg-forest-700 text-stone rounded-lg text-xs font-medium transition-all"
            >
              Reject Optional
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-stone hover:text-cream p-1"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
