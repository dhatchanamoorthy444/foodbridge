import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Cookie } from 'lucide-react'

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-app text-bone px-6 py-12 md:py-20 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-bone mb-8 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to FoodBridge
      </Link>

      <div className="border-b border-line/60 pb-6 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-panel text-harvest text-xs font-mono uppercase tracking-wider mb-3">
          Transparency & Tracking
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-bone">Cookie Policy</h1>
        <p className="text-muted text-sm mt-2">
          Effective Date: October 24, 2024 · Last Reviewed: October 2024
        </p>
      </div>

      <div className="space-y-8 text-muted leading-relaxed text-sm md:text-base">
        <section className="space-y-3">
          <h2 className="text-2xl font-display text-bone">1. What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device when you visit a website. FoodBridge uses essential session cookies and local storage tokens strictly necessary to maintain your authenticated session and secure role-based access.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-display text-bone">2. Categories of Storage We Use</h2>
          <div className="space-y-4">
            <div className="earth-card p-4">
              <h3 className="text-bone font-semibold mb-1">Essential Cookies & Storage (Mandatory)</h3>
              <p className="text-xs md:text-sm text-muted">
                Required for core platform navigation, authentication tokens (JWT), and security verification. You cannot disable essential cookies while using authenticated workflows.
              </p>
            </div>
            <div className="earth-card p-4">
              <h3 className="text-bone font-semibold mb-1">Functional & Preference Preferences</h3>
              <p className="text-xs md:text-sm text-muted">
                Remembers your interface settings (e.g., sidebar collapsed state, last selected filter views, cookie consent choice).
              </p>
            </div>
            <div className="earth-card p-4">
              <h3 className="text-bone font-semibold mb-1">Advertising & Third-Party Trackers</h3>
              <p className="text-xs md:text-sm text-muted">
                <strong>None.</strong> FoodBridge does not embed cross-site marketing pixels, behavioral advertising networks, or invasive trackers.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-display text-bone">3. Managing Cookie Preferences</h2>
          <p>
            You can modify your browser settings to refuse or delete cookies. However, disabling essential session cookies will prevent you from signing in as a donor, recipient, or administrator.
          </p>
        </section>
      </div>
    </div>
  )
}
