import { useNavigate, Link } from 'react-router-dom'
import {
  Heart,
  ShieldCheck,
  Users,
  Scale,
  UtensilsCrossed,
  Zap,
  Store,
  HandHeart,
  Bike,
  ArrowRight,
} from 'lucide-react'

const NEON = '#dfff00'
const BLACK = '#0a0a0a'
const CARD = '#121412'
const OUTLINE = 'rgba(255,255,255,0.2)'
const MUTED = 'rgba(255,255,255,0.65)'
const FAINT = 'rgba(255,255,255,0.45)'

const IMPACT = [
  { label: 'Freshness', value: 'First', unit: '', sub: 'Expiry-first listings', Icon: ShieldCheck },
  { label: 'Zero Cost', value: 'Always', unit: '', sub: 'Donations stay free', Icon: Scale },
  { label: 'Realtime', value: 'Live', unit: '', sub: 'Listing updates as they happen', Icon: Users },
  { label: 'Privacy', value: 'Built-in', unit: '', sub: 'Contacts stay hidden until accepted', Icon: UtensilsCrossed },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ background: BLACK, color: '#ffffff' }}>
      {/* ══════════════ HEADER ══════════════ */}
      <header className="fixed top-0 w-full z-50" style={{ background: BLACK, borderBottom: `1px solid ${OUTLINE}` }}>
        <div className="h-[72px] px-5 md:px-8 lg:px-10 flex items-center justify-between max-w-[1400px] mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: NEON }}>
              <Heart className="w-5 h-5" style={{ color: BLACK }} strokeWidth={2.6} />
            </div>
            <div className="flex flex-col leading-none">
              <span style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 24, color: '#ffffff', letterSpacing: '0.02em' }}>
                FOODBRIDGE
              </span>
              <span
                style={{
                  fontFamily: 'Be Vietnam Pro, sans-serif',
                  fontSize: 10,
                  fontWeight: 700,
                  color: NEON,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  marginTop: 3,
                }}
              >
                Surplus Resilience
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-5">
            <Link
              to="/login"
              className="hidden sm:flex items-center transition-colors hover:opacity-80"
              style={{
                color: '#ffffff',
                fontFamily: 'Be Vietnam Pro, sans-serif',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="flex items-center gap-2 h-12 px-6 rounded-lg transition-all active:scale-95"
              style={{
                background: NEON,
                color: BLACK,
                fontFamily: 'Be Vietnam Pro, sans-serif',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Launch Platform <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════ FULL-SCREEN HERO ══════════════ */}
      <section className="relative min-h-screen pt-[72px] flex flex-col justify-center overflow-hidden" style={{ background: BLACK }}>
        <div className="max-w-[1400px] mx-auto w-full px-5 md:px-8 lg:px-10 py-10 lg:py-14 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center flex-1">
          {/* ─── Left column ─── */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full"
                style={{ background: NEON, color: BLACK }}
              >
                <Zap className="w-3.5 h-3.5" fill="currentColor" />
                <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Next-Gen Food Rescue
                </span>
              </span>
              <span
                className="inline-flex items-center px-4 py-1.5 rounded-full border"
                style={{ borderColor: OUTLINE, color: MUTED }}
              >
                <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Est. 2026 · Zero Waste
                </span>
              </span>
            </div>

            <h1
              className="leading-[0.9] tracking-tight"
              style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 'clamp(52px, 8vw, 100px)', color: '#ffffff', textTransform: 'uppercase' }}
            >
              Rescue Food.
              <br />
              <span style={{ color: NEON }}>Feed People.</span>
            </h1>

            <p className="max-w-lg" style={{ fontFamily: 'Rubik, sans-serif', fontSize: 17, lineHeight: '28px', color: MUTED }}>
              FoodBridge connects surplus food with the people who need it most.
              Real-time expiry monitoring, smart allocation and zero-waste logistics —
              all in one loud, fast platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => navigate('/register')}
                className="group relative h-14 px-7 rounded-lg flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] overflow-hidden"
                style={{ background: NEON, color: BLACK }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Get Started Now
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="h-14 px-7 rounded-lg flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] border"
                style={{ borderColor: OUTLINE, color: '#ffffff', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
              >
                Sign In
              </button>
            </div>
          </div>

          {/* ─── Right column — big food image card ─── */}
          <div className="relative hidden lg:block">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                border: `3px solid ${NEON}`,
                boxShadow: `14px 14px 0 0 ${NEON}`,
              }}
            >
              <span
                className="absolute top-5 left-5 z-10 px-4 py-1.5 rounded-full"
                style={{ background: NEON, color: BLACK, fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}
              >
                Real Food · Real Rescue
              </span>
              <img
                src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=1000&q=80"
                alt="Traditional South Indian banana-leaf meal ready for rescue redistribution"
                className="w-full h-[520px] object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 45%, transparent 70%)' }}
              />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 32, lineHeight: '38px', color: '#ffffff', textTransform: 'uppercase' }}>
                  One Plate =<br />
                  <span style={{ color: NEON }}>One Child's Lunch.</span>
                </h3>
                <p className="mt-2" style={{ fontFamily: 'Rubik, sans-serif', fontSize: 14, lineHeight: '22px', color: MUTED, maxWidth: 360 }}>
                  Every rescued meal on FoodBridge is a breakfast or lunch that reaches a child instead of a bin.
                </p>
              </div>
              <span
                className="absolute -bottom-4 right-8 px-4 py-2 rounded-full"
                style={{ background: NEON, color: BLACK, fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
              >
                No Waste. No Hunger.
              </span>
            </div>
          </div>

          {/* Mobile image */}
          <div className="lg:hidden px-5 pb-8 -mt-4">
            <div className="relative rounded-2xl overflow-hidden" style={{ border: `2px solid ${NEON}`, boxShadow: `8px 8px 0 0 ${NEON}` }}>
              <img
                src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80"
                alt="Traditional South Indian banana-leaf meal"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 60%)' }} />
              <div className="absolute bottom-4 left-5 right-5">
                <h3 style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 24, color: '#ffffff', textTransform: 'uppercase' }}>
                  One Plate ={' '}
                  <span style={{ color: NEON }}>One Child's Lunch.</span>
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ IMPACT STATS ══════════════ */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 py-16">
        <div className="flex flex-col gap-2 mb-8">
          <h2 style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', color: '#ffffff', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
            How We Work
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {IMPACT.map((s) => (
            <div key={s.label} className="rounded-xl p-6 flex flex-col gap-2" style={{ background: CARD, border: `1px solid ${OUTLINE}` }}>
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 11, fontWeight: 700, color: FAINT, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {s.label}
                </span>
                <s.Icon className="w-5 h-5" style={{ color: NEON }} />
              </div>
              <span className="tabular-nums" style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 40, lineHeight: '44px', color: '#ffffff' }}>
                {s.value}
                {s.unit && (
                  <span style={{ fontFamily: 'Rubik, sans-serif', fontSize: 16, fontWeight: 400, color: FAINT, marginLeft: 4 }}>{s.unit}</span>
                )}
              </span>
              <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 12, fontWeight: 600, color: NEON }}>{s.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="py-16" style={{ background: CARD }}>
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10">
          <div className="flex flex-col gap-2 mb-10">
            <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 11, fontWeight: 700, color: NEON, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Three Simple Steps
            </span>
            <h2 style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 'clamp(32px, 4vw, 48px)', color: '#ffffff', textTransform: 'uppercase' }}>
              How FoodBridge Works
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { step: '01', title: 'Donors Post Surplus', desc: 'Bakeries, markets and farms log surplus batches with expiry windows in under 30 seconds.', Icon: Store },
              { step: '02', title: 'Smart Matching', desc: 'The engine ranks nearby pantries by urgency, capacity and cold-chain fit — no wasted trips.', Icon: HandHeart },
              { step: '03', title: 'Volunteers Deliver', desc: 'Last-mile couriers pick up with OTP-verified handovers and live route tracking.', Icon: Bike },
            ].map((s) => (
              <div key={s.step} className="rounded-xl p-7 flex flex-col gap-3" style={{ background: BLACK, border: `1px solid ${OUTLINE}` }}>
                <div className="flex items-center justify-between">
                  <span style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 32, color: 'transparent', WebkitTextStroke: `1.5px ${NEON}` }}>
                    {s.step}
                  </span>
                  <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'rgba(223,255,0,0.1)' }}>
                    <s.Icon className="w-5 h-5" style={{ color: NEON }} />
                  </div>
                </div>
                <h3 style={{ fontFamily: 'Rubik, sans-serif', fontSize: 19, fontWeight: 600, color: '#ffffff' }}>{s.title}</h3>
                <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 14, lineHeight: '22px', color: MUTED }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ COMMUNITY STORY ══════════════ */}
      <section className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 py-16">
        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          <div className="relative rounded-xl overflow-hidden min-h-[300px]">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&q=80"
              alt="Volunteers packing rescued food for community distribution"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.9) 0%, transparent 60%)' }} />
            <div className="absolute bottom-6 left-6 right-6">
              <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 11, fontWeight: 700, color: NEON, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Safe Handover
              </span>
              <h3 className="mt-1.5" style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 28, lineHeight: '34px', color: '#ffffff', textTransform: 'uppercase' }}>
                From Bakery Shelf to Breakfast Table
              </h3>
            </div>
          </div>
          <div className="rounded-xl p-8 flex flex-col justify-center gap-5" style={{ background: CARD, border: `1px solid ${OUTLINE}` }}>
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 19, lineHeight: '32px', color: '#ffffff' }}>
              Surplus food is logged with expiry windows, recipients request what their community
              actually needs, and donors approve the requests they can fulfil. Every step in the
              FoodBridge flow is timestamped and traceable.
            </p>
            <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 12, fontWeight: 700, color: NEON, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Built for verified food businesses &amp; community organisations
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════ CTA BAND ══════════════ */}
      <section style={{ background: NEON }}>
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h2 style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 'clamp(28px, 4vw, 48px)', color: BLACK, textTransform: 'uppercase', lineHeight: 1.05 }}>
              Ready to Bridge the Gap?
            </h2>
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 16, color: 'rgba(10,10,10,0.7)', maxWidth: 440 }}>
              Join as a donor, NGO or volunteer. Setup takes under two minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/register"
              className="h-13 px-7 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
              style={{ background: BLACK, color: NEON, fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
            >
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="h-13 px-7 rounded-lg flex items-center justify-center gap-2 border transition-all active:scale-95"
              style={{ borderColor: 'rgba(10,10,10,0.3)', color: BLACK, fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="py-12" style={{ background: BLACK }}>
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3">
            <img
              src="/stickers/01_brand_and_donation/foodbridge_logo.png"
              alt="FoodBridge"
              className="w-9 h-9 object-contain"
            />
            <div className="flex flex-col">
              <span style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 18, color: '#ffffff' }}>FoodBridge</span>
              <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 11, fontWeight: 600, color: FAINT }}>
                Verified donors · Verified recipients · Zero-cost surplus rescue
              </span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-5">
            {[
              ['Privacy', '/privacy'],
              ['Terms', '/terms'],
              ['Cookies', '/cookies'],
              ['Refund', '/refund'],
            ].map(([label, path]) => (
              <Link
                key={path}
                to={path}
                style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 12, fontWeight: 700, color: NEON, letterSpacing: '0.04em', textTransform: 'uppercase' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
