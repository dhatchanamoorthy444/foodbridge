import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#0b1510] text-cream px-6 py-12 md:py-20 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-stone hover:text-cream mb-8 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to FoodBridge
      </Link>

      <div className="border-b border-forest-600/30 pb-6 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-forest-800 text-botanical-light text-xs font-mono uppercase tracking-wider mb-3">
          Legal Agreement
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-cream">Terms of Service</h1>
        <p className="text-stone text-sm mt-2">
          Effective Date: October 24, 2024 · Version 1.1
        </p>
      </div>

      <div className="space-y-8 text-stone leading-relaxed text-sm md:text-base">
        <section className="earth-card p-4 border-amber-600/40 bg-amber-950/20 text-amber-200 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
          <div className="text-sm">
            <strong>Mandatory Food Safety Notice:</strong> FoodBridge is an algorithmic coordination platform. Automated date boundary indicators and software freshness scoring <em>do not</em> replace human food-safety inspection, sensory checks, or local health authority hygiene standards upon collection.
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-serif text-cream">1. Acceptance of Terms</h2>
          <p>
            By creating an account, submitting surplus food inventory, or requesting surplus allocations on FoodBridge, you agree to comply with and be bound by these Terms of Service. If you do not accept these terms, you may not access or use the service.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-serif text-cream">2. Participant Responsibilities</h2>
          <p>
            The platform supports four roles: Donors, Recipients, Volunteers, and System Administrators.
          </p>
          <ul className="custom-list">
            <li><strong>Donors:</strong> Must accurately declare food categories, temperature storage requirements, and expiry dates. Food items past safe consumption guidelines must be marked accordingly and will be excluded by the allocation engine.</li>
            <li><strong>Recipients & NGOs:</strong> Must verify physical package integrity and temperature safety upon arrival before distributing to end-recipients.</li>
            <li><strong>Fair Allocation:</strong> Attempting to exploit race conditions, forge reservation tokens, or hoover surplus allocations beyond genuine operational capacity is strictly prohibited.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-serif text-cream">3. Allocation & Pickup Confirmations</h2>
          <p>
            Surplus listings are allocated via explainable weighted scoring (Category compatibility 40%, Quantity requirement 25%, Pickup feasibility 20%, Storage condition 15%).
          </p>
          <p>
            Redistributed metrics are logged into official analytics <strong>only after</strong> two-way confirmation of collection. Reservations that lapse beyond the scheduled window are automatically released back to available inventory.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-serif text-cream">4. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, FoodBridge and its contributors disclaim liability for indirect, incidental, or consequential damages resulting from platform downtime or mishandled off-platform food transport.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-serif text-cream">5. Account Termination</h2>
          <p>
            Users may close their account at any time through their settings panel. FoodBridge reserves the right to suspend accounts that repeatedly submit fraudulent listings or fail collection pickups without notice.
          </p>
        </section>
      </div>
    </div>
  )
}
