import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Info } from 'lucide-react'

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-app text-bone px-6 py-12 md:py-20 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-bone mb-8 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to FoodBridge
      </Link>

      <div className="border-b border-line/60 pb-6 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-panel text-harvest text-xs font-mono uppercase tracking-wider mb-3">
          Transactional Terms
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-bone">Refund &amp; Cancellation Policy</h1>
        <p className="text-muted text-sm mt-2">
          Effective Date: October 24, 2024 &middot; Version 1.0
        </p>
      </div>

      <div className="space-y-8 text-muted leading-relaxed text-sm md:text-base">
        <section className="earth-card p-4 border-sky-600/40 bg-sky-950/20 text-sky-200 flex items-start gap-3">
          <Info className="w-5 h-5 flex-shrink-0 text-sky-400 mt-0.5" />
          <div className="text-sm">
            <strong>Scope notice:</strong> FoodBridge is a non-commercial, community surplus redistribution platform. No payments, subscriptions, or financial transactions are processed through the platform at this time. This policy is provided for completeness and applies to any future paid features.
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-display text-bone">1. No Fees for Core Service</h2>
          <p>
            FoodBridge does not charge donors, recipients, or volunteers for listing, requesting, or collecting surplus food. There are no subscription tiers, listing fees, or commission charges. Because no payment is collected, no refund of platform fees is applicable.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-display text-bone">2. Cancellation of Listings</h2>
          <p>
            Donors may cancel or edit an active surplus listing at any time before a pickup has been confirmed by a volunteer. Once a pickup is in transit, the donor should contact the volunteer directly through the platform to coordinate.
          </p>
          <ul className="custom-list">
            <li>Cancelling before a pickup is confirmed has no penalty.</li>
            <li>Cancelling after a volunteer has been dispatched is discouraged and may affect donor reliability metrics.</li>
            <li>Repeated no-show cancellations may result in listing restrictions after review.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-display text-bone">3. Cancellation of Requests</h2>
          <p>
            Recipient organizations may cancel a surplus request at any time before collection. If a pickup is already scheduled, cancelling will release the allocated quantity back into available inventory for other recipients.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-display text-bone">4. Future Paid Features</h2>
          <p>
            If FoodBridge introduces any paid features in the future, this policy will be updated before those features go live. Any paid feature will include clear pricing, a free tier or trial where possible, and a documented refund window of at least 14 days from the date of purchase.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-display text-bone">5. Contact</h2>
          <p>
            For questions about this policy or to request a cancellation confirmation, contact:
          </p>
          <div className="earth-card p-4 text-bone font-mono text-sm">
            Reach the team through the sign-in page or your account settings in-app.
          </div>
        </section>
      </div>
    </div>
  )
}

