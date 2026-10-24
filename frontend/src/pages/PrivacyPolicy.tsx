import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0b1510] text-cream px-6 py-12 md:py-20 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-stone hover:text-cream mb-8 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to FoodBridge
      </Link>

      <div className="border-b border-forest-600/30 pb-6 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-forest-800 text-botanical-light text-xs font-mono uppercase tracking-wider mb-3">
          Compliance & Transparency
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-cream">Privacy Policy</h1>
        <p className="text-stone text-sm mt-2">
          Effective Date: October 24, 2024 · Last Reviewed: October 2024
        </p>
      </div>

      <div className="space-y-8 text-stone leading-relaxed text-sm md:text-base">
        <section className="space-y-3">
          <h2 className="text-2xl font-serif text-cream">1. Introduction & Organizational Disclosure</h2>
          <p>
            FoodBridge is an educational and community-driven initiative dedicated to surplus food redistribution and food expiry monitoring. This Privacy Policy details our practices concerning the collection, storage, use, and protection of personal and organizational information.
          </p>
          <p className="text-xs text-stone-dark italic">
            Notice: FoodBridge operates as an open platform project. Provisions herein should be reviewed by a qualified legal professional prior to deployment in commercial jurisdictions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-serif text-cream">2. Data Minimization & Information Collected</h2>
          <p>
            We strictly adhere to privacy-by-design and data minimization principles. We collect only the data strictly necessary to facilitate surplus food logistics:
          </p>
          <ul className="custom-list">
            <li><strong>Account Credentials:</strong> Full name, organizational email address, and hashed authentication credentials. Passwords are never stored in plaintext.</li>
            <li><strong>Organization Profile:</strong> Organization name, role designation (Donor, Recipient, Volunteer, Administrator), and city-level operational area. We do not track continuous or precise GPS locations.</li>
            <li><strong>Surplus Listing Data:</strong> Food category, quantity, declared storage conditions, and expiry timestamp.</li>
            <li><strong>Pickup Coordinates & Verification:</strong> Scheduled handover windows and pickup confirmation tokens.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-serif text-cream">3. Purpose and Legal Basis of Processing</h2>
          <p>We process information under the following lawful grounds:</p>
          <ul className="custom-list">
            <li><strong>Contractual & Operational Necessity:</strong> Facilitating matching between surplus food donors and eligible recipient organizations.</li>
            <li><strong>Safety & Compliance:</strong> Ensuring expired or safety-flagged food items are prevented from redistribution.</li>
            <li><strong>Legitimate Interests:</strong> Aggregating non-identifiable metrics (kilograms preserved, carbon offset estimates) to document environmental impact.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-serif text-cream">4. Third-Party Services & Infrastructure</h2>
          <p>
            We do not sell, rent, or monetize your data. The external service integrations used by FoodBridge include:
          </p>
          <div className="earth-card p-4 space-y-2 text-xs md:text-sm">
            <p><strong>Database & Auth:</strong> Supabase (PostgreSQL with Row Level Security enforced).</p>
            <p><strong>Hosting Infrastructure:</strong> Vercel (Frontend edge delivery) and Render (Authoritative backend API).</p>
            <p><strong>Analytics:</strong> First-party event counters only. No invasive third-party ad trackers or cross-site tracking pixels are embedded.</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-serif text-cream">5. Retention Periods & Data Deletion Rights</h2>
          <p>
            Users have the right to request deletion of their account and all associated personal information at any time via the user settings panel or by direct request to our privacy team.
          </p>
          <p>
            Upon receipt of an authenticated deletion request, personal identifying data is permanently erased or irreversibly anonymized within 30 days, except where audit logs are required by applicable food safety recordkeeping requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-serif text-cream">6. Contact & Data Protection Inquiries</h2>
          <p>
            For data protection inquiries, access requests, or regulatory questions, reach our project team at:
          </p>
          <div className="earth-card p-4 text-cream font-mono text-sm">
            Email: privacy@foodbridge.network<br />
            Support: support@foodbridge.network
          </div>
        </section>
      </div>
    </div>
  )
}
