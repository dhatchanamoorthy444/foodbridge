import { Link } from 'react-router-dom'
import {
  Heart,
  ShieldCheck,
  Users,
  Scale,
  UtensilsCrossed,
  ArrowRight,
} from 'lucide-react'
import useAppStore from '../store/useAppStore'

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
  const user = useAppStore((s) => s.user)
  const dashboardLink = user?.role === 'recipient' ? '/browse' : '/donor'

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
            {user ? (
              <Link
                to={dashboardLink}
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
                Open Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </header>

      {/* ══════════════ FULL-SCREEN HERO ══════════════ */}
      <section className="relative min-h-screen pt-[72px] flex flex-col justify-center overflow-hidden" style={{ background: BLACK }}>
        <div className="max-w-[1400px] mx-auto w-full px-5 md:px-8 lg:px-10 py-10 lg:py-14 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center flex-1">
          {/* Left column */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className="px-3 py-1 rounded-full border text-[11px] font-bold tracking-widest uppercase flex items-center gap-1.5"
                style={{ borderColor: NEON, color: NEON, background: 'rgba(223,255,0,0.08)' }}
              >
                <span className="w-2 h-2 rounded-full animate-ping" style={{ background: NEON }} />
                Real-Time Surplus Dispatch
              </span>
            </div>

            <h1
              className="text-[clamp(44px,7vw,84px)] font-normal leading-[0.95] tracking-tight"
              style={{ fontFamily: 'Anton, Impact, sans-serif', color: '#ffffff' }}
            >
              DON'T LET GOOD FOOD GO TO WASTE.
            </h1>

            <p
              className="text-[17px] md:text-[19px] leading-relaxed max-w-[560px]"
              style={{ fontFamily: 'Rubik, sans-serif', color: MUTED }}
            >
              Commercial kitchens, banquets, and hotels log surplus in 30 seconds. Local shelters and NGOs receive instant priority dispatch before expiry.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to={user ? dashboardLink : '/register'}
                className="h-14 px-8 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
                style={{
                  background: NEON,
                  color: BLACK,
                  fontFamily: 'Be Vietnam Pro, sans-serif',
                  fontSize: 14,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                {user ? 'Go To Your Dashboard' : 'Start Rescuing Surplus'} <ArrowRight className="w-4 h-4" />
              </Link>
              {!user && (
                <Link
                  to="/login"
                  className="h-14 px-8 rounded-xl flex items-center justify-center gap-2 border transition-all active:scale-95"
                  style={{
                    borderColor: OUTLINE,
                    color: '#ffffff',
                    fontFamily: 'Be Vietnam Pro, sans-serif',
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                >
                  Station Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Right column: Realistic Food Visual */}
          <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: OUTLINE, background: CARD }}>
            <div className="aspect-[4/3] w-full overflow-hidden relative">
              <img
                src="/images/meal-thali.jpg"
                alt="Fresh wholesome food ready for donation"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.3) 50%, transparent 100%)',
                }}
              />
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#D7EF4A] uppercase font-bold tracking-wider">
                    VERIFIED SURPLUS DISPATCH
                  </span>
                  <p className="font-['Anton'] text-xl uppercase text-white mt-0.5">
                    Hygienic Commercial Quality Food
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-[#263300] border border-[#BCD147]/40 text-[#D7EF4A] font-mono text-[10px] font-bold uppercase">
                  ZERO WASTE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ IMPACT STATS ══════════════ */}
      <section className="py-16 border-t" style={{ borderColor: OUTLINE, background: BLACK }}>
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 lg:px-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {IMPACT.map((item) => (
            <div key={item.label} className="p-6 rounded-2xl border" style={{ borderColor: OUTLINE, background: CARD }}>
              <item.Icon className="w-6 h-6 mb-3" style={{ color: NEON }} />
              <div style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 32, color: '#ffffff' }}>
                {item.value} {item.unit}
              </div>
              <div style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 13, fontWeight: 700, color: NEON, marginTop: 4 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: MUTED, marginTop: 2 }}>
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="py-12 border-t" style={{ borderColor: OUTLINE, background: BLACK }}>
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
