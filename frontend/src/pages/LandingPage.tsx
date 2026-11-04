import { useNavigate, Link } from 'react-router-dom'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Store,
  AlarmClock,
  ClipboardCheck,
  Truck,
  Snowflake,
  BellRing,
  ArrowLeftRight,
  Leaf,
  ScanSearch,
  Hourglass,
  Flame,
} from 'lucide-react'
import HeroCanvas from '../components/animations/HeroCanvas'

/* â”€â”€ Scratch palette constants for the few inline gradients â”€â”€ */

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
      show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? undefined : 'hidden'}
      whileInView={reduced ? undefined : 'show'}
      viewport={{ once: true, margin: '-70px' }}
      variants={reduced ? undefined : revealVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionHeading({
  kicker,
  title,
  tone = 'dark',
}: {
  kicker: string
  title: React.ReactNode
  tone?: 'dark' | 'panel'
}) {
  return (
    <Reveal className="flex flex-col gap-3">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-line bg-elevated px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-fixed">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {kicker}
      </span>
      <h2 className={`max-w-2xl text-[clamp(28px,4.4vw,44px)] font-semibold leading-[1.08] tracking-[-0.02em] ${tone === 'panel' ? 'text-text' : 'text-text'}`}>
        {title}
      </h2>
    </Reveal>
  )
}

const NAV_LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#expiry', label: 'Expiry watch' },
  { href: '#alerts', label: 'Emergency alerts' },
  { href: '#impact', label: 'Impact' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const reduced = useReducedMotion()

  return (
    <div className="min-h-screen bg-app-deep text-text">
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â• NAVIGATION â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <header className="fixed top-0 z-50 w-full border-b border-line/70 bg-app-deep/85 backdrop-blur-md">
        <nav className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-5 md:px-8 lg:px-10">
          <Link to="/" className="flex items-center gap-3" aria-label="FoodBridge home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-[0_6px_24px_-10px_rgba(217,255,69,0.5)]">
              <img src="/stickers/01_brand_and_donation/foodbridge_logo.png" alt="" className="h-6 w-6 object-contain" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[20px] font-bold tracking-tight text-text">FOODBRIDGE</span>
              <span className="font-label-sm text-[9px] uppercase tracking-[0.22em] text-primary-fixed">
                Good Food · Better Future
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13px] font-semibold text-text-2 transition-colors hover:text-text"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="hidden rounded-lg px-3.5 py-2 text-[13px] font-semibold text-text-2 transition-colors hover:bg-elevated hover:text-text sm:block"
            >
              Sign in
            </Link>
            <Link to="/register" className="btn-primary h-10 rounded-lg px-4">
              Start Redistributing
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â• HERO â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="relative overflow-hidden pt-[68px]">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 55% at 78% 18%, rgba(183,217,106,0.09) 0%, rgba(5,8,7,0) 55%), radial-gradient(50% 45% at 8% 88%, rgba(16,60,45,0.65) 0%, rgba(5,8,7,0) 60%)',
            }}
          />
          <div className="relative mx-auto grid max-w-[1440px] items-center gap-10 px-5 pb-12 pt-12 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-10 lg:pb-16 lg:pt-20">
            <div className="flex flex-col items-start gap-6">
              <motion.span
                initial={reduced ? undefined : { opacity: 0, y: 12 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-elevated px-4 py-1.5"
              >
                <Leaf className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-2">
                  Smart food expiry monitoring &amp; surplus redistribution
                </span>
              </motion.span>

              <motion.h1
                initial={reduced ? undefined : { opacity: 0, y: 18 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.06 }}
                className="font-display text-[clamp(52px,7.4vw,96px)] font-bold leading-[0.95] tracking-[-0.03em]"
              >
                <span className="block text-text">GOOD FOOD.</span>
                <span className="neon-text neon-glow block">BETTER FUTURE.</span>
              </motion.h1>

              <motion.p
                initial={reduced ? undefined : { opacity: 0, y: 16 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="max-w-xl text-[16px] leading-[1.65] text-text-2"
              >
                Turn surplus into opportunity. Track food freshness, connect communities
                and make every donation count â€” restaurants, hotels, grocers and markets
                feed NGOs, shelters and community kitchens on one bridge.
              </motion.p>

              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                animate={reduced ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.18 }}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Link to="/register" className="btn-primary rounded-xl px-7 py-3.5 text-[15px]">
                  Start Redistributing
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#how" className="btn-secondary rounded-xl px-7 py-3.5 text-[15px]">
                  Explore FoodBridge
                  <ArrowRight className="h-4 w-4 rotate-90" />
                </a>
              </motion.div>

              <motion.ul
                initial={reduced ? undefined : { opacity: 0 }}
                animate={reduced ? undefined : { opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.26 }}
                className="mt-1 flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-medium text-text-3"
              >
                {[
                  { Icon: ScanSearch, label: 'Expiry-first listings' },
                  { Icon: AlarmClock, label: 'Emergency broadcasts' },
                  { Icon: ClipboardCheck, label: 'Verified handovers' },
                ].map(({ Icon, label }) => (
                  <li key={label} className="flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-primary-fixed" /> {label}
                  </li>
                ))}
              </motion.ul>
            </div>

            {/* 3D food ecosystem */}
            <motion.div
              initial={reduced ? undefined : { opacity: 0, scale: 0.96 }}
              animate={reduced ? undefined : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <HeroCanvas />
              <div className="pointer-events-none absolute left-4 top-6 rounded-full border border-line bg-app-deep/80 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary-fixed backdrop-blur-sm sm:left-6">
                Fresh inventory · Live
              </div>
              <div className="pointer-events-none absolute bottom-6 right-4 rounded-full border border-line bg-app-deep/80 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-text-2 backdrop-blur-sm sm:right-6">
                Expiring soon · Reserve
              </div>
            </motion.div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â• HOW IT WORKS â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section id="how" className="bg-app py-16 lg:py-24">
          <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-10">
            <SectionHeading
              kicker="Three steps"
              title={
                <>
                  From surplus shelf to{' '}
                  <span className="neon-text">served plate</span>.
                </>
              }
            />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {[
                {
                  step: '01',
                  Icon: Store,
                  title: 'Donors publish surplus',
                  desc: 'Restaurants, hotels, supermarkets and bakeries list surplus batches with expiry windows, storage needs and allergen details in seconds.',
                },
                {
                  step: '02',
                  Icon: ArrowLeftRight,
                  title: 'Requests meet stock atomically',
                  desc: 'Recipients request what their community needs. Approval creates an allocation in a PostgreSQL transaction â€” stock can never be double-claimed.',
                },
                {
                  step: '03',
                  Icon: Truck,
                  title: 'Pickups complete the loop',
                  desc: 'Scheduled pickups, live status transitions and completed handovers feed notifications and dashboards for both sides in real time.',
                },
              ].map((s, i) => (
                <Reveal key={s.step} className={i === 1 ? 'md:mt-6' : i === 2 ? 'md:mt-12' : ''}>
                  <div className="h-full rounded-2xl border border-line bg-panel p-7">
                    <div className="flex items-start justify-between">
                      <span className="font-display text-[34px] font-bold leading-none text-transparent" style={{ WebkitTextStroke: `1.4px ${'rgb(var(--fb-primary-fixed))'}` }}>
                        {s.step}
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-elevated text-primary-fixed">
                        <s.Icon className="h-5 w-5" />
                      </span>
                    </div>
                    <h3 className="mt-5 text-[18px] font-semibold text-text">{s.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-[1.65] text-text-2">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â• EXPIRY MONITORING â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section id="expiry" className="bg-app-deep py-16 lg:py-24">
          <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 md:px-8 lg:grid-cols-2 lg:gap-14 lg:px-10">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl border border-line">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1000&q=80"
                  alt="Volunteers packing rescued food into crates"
                  className="photo-natural h-[420px] w-full object-cover"
                  loading="lazy"
                />
                <div className="image-scrim absolute inset-0" />
                <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-center gap-2">
                  <span className="chip-fresh">Fresh 32h</span>
                  <span className="chip-expiring">Expiring &lt;24h</span>
                  <span className="chip-critical">Critical</span>
                </div>
              </div>
            </Reveal>

            <div className="flex flex-col gap-7">
              <SectionHeading
                kicker="Expiry watch"
                title={<>Every batch carries a clock â€” and FoodBridge reads it.</>}
              />
              <Reveal className="flex flex-col gap-4">
                <ul className="custom-list text-[14px] leading-[1.6]">
                  <li>
                    <span className="text-text">Three-tier freshness:</span> listings are
                    classified fresh, expiring or critical from the moment they are published,
                    so urgent stock is claimed first.
                  </li>
                  <li>
                    <span className="text-text">Expiry is business logic:</span> expired
                    batches are never newly allocated â€” approval and emergency offers both
                    fail closed, enforced server-side.
                  </li>
                  <li>
                    <span className="text-text">Cold-chain context:</span> storage
                    requirement, temperature category and allergen information travel with
                    every listing.
                  </li>
                </ul>
              </Reveal>
              <Reveal>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { Icon: ShieldCheck, label: 'Fresh green' },
                    { Icon: Hourglass, label: 'Expiring amber' },
                    { Icon: Flame, label: 'Critical red' },
                  ].map(({ Icon, label }) => (
                    <div key={label} className="rounded-xl border border-line bg-panel p-3.5 text-center">
                      <Icon className="mx-auto h-4 w-4 text-primary-fixed" />
                      <p className="mt-1.5 text-[11px] font-semibold text-text-2">{label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â• EMERGENCY ALERTS â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section id="alerts" className="bg-app py-16 lg:py-24">
          <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-5 md:px-8 lg:grid-cols-2 lg:gap-14 lg:px-10">
            <div className="order-2 flex flex-col gap-7 lg:order-1">
              <SectionHeading
                kicker="Emergency alerts"
                title={<>When hunger is urgent, the whole donor network hears it.</>}
              />
              <Reveal className="flex flex-col gap-4">
                <ul className="custom-list text-[14px] leading-[1.6]">
                  <li>
                    <span className="text-text">Recipients broadcast needs:</span> approved
                    recipients publish urgent food requirements with quantity, people to
                    feed and a required-by deadline.
                  </li>
                  <li>
                    <span className="text-text">Donors respond in one tap:</span> offers
                    link straight to existing donations, and alerts close automatically once
                    the required quantity is fulfilled.
                  </li>
                  <li>
                    <span className="text-text">Private stays private:</span> contact
                    numbers and exact addresses are never shown publicly â€” they unlock only
                    when an offer is accepted.
                  </li>
                </ul>
              </Reveal>
              <Reveal>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { Icon: BellRing, label: 'Broadcast' },
                    { Icon: HeartHandshake, label: 'Respond' },
                    { Icon: ClipboardCheck, label: 'Accept' },
                  ].map(({ Icon, label }) => (
                    <div key={label} className="rounded-xl border border-line bg-panel p-3.5 text-center">
                      <Icon className="mx-auto h-4 w-4 text-primary-fixed" />
                      <p className="mt-1.5 text-[11px] font-semibold text-text-2">{label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            <Reveal className="order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-2xl border border-line">
                <img
                  src="https://images.unsplash.com/photo-1593134257782-e89567b7718a?w=1000&q=80"
                  alt="Community kitchen serving hot meals"
                  className="photo-natural h-[420px] w-full object-cover"
                  loading="lazy"
                />
                <div className="image-scrim absolute inset-0" />
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-danger px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                    <AlarmClock className="h-3 w-3" /> Live alert channel
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â• IMPACT & SUSTAINABILITY â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section id="impact" className="bg-app-deep py-16 lg:py-24">
          <div className="mx-auto max-w-[1440px] px-5 md:px-8 lg:px-10">
            <SectionHeading
              kicker="Impact"
              title={<>Built on promise, not padding: no invented numbers, ever.</>}
            />
            <Reveal>
              <p className="mt-4 max-w-2xl text-[14px] leading-[1.7] text-text-2">
                FoodBridge never fabricates impact statistics. Every number inside the
                dashboards is measured live from your own account â€” donations listed,
                requests approved, pickups completed. What we can promise below is the
                architecture behind each promise.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  Icon: ShieldCheck,
                  title: 'Privacy by design',
                  desc: 'Roles, ownership checks and Row Level Security keep every record in the right hands.',
                },
                {
                  Icon: ArrowLeftRight,
                  title: 'Atomic allocation',
                  desc: 'Row-locked PostgreSQL transactions make double-claiming impossible.',
                },
                {
                  Icon: BellRing,
                  title: 'Realtime everywhere',
                  desc: 'Supabase channels push listings, alerts and pickups the moment they change.',
                },
                {
                  Icon: Snowflake,
                  title: 'Cold-chain aware',
                  desc: 'Storage and temperature data travel with every batch from shelf to shelter.',
                },
              ].map(({ Icon, title, desc }) => (
                <Reveal key={title}>
                  <div className="h-full rounded-2xl border border-line bg-panel p-6">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-elevated text-primary-fixed">
                      <Icon className="h-4.5 w-4.5" />
                    </span>
                    <h3 className="mt-4 text-[15px] font-semibold text-text">{title}</h3>
                    <p className="mt-1.5 text-[12.5px] leading-[1.6] text-text-2">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â• COMMUNITY BAND â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="bg-app py-16 lg:py-20">
          <div className="mx-auto grid max-w-[1440px] items-stretch gap-6 px-5 md:px-8 lg:grid-cols-[1.4fr_1fr] lg:px-10">
            <Reveal>
              <div className="relative flex h-full flex-col gap-6 rounded-2xl border border-line bg-panel p-8">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-elevated px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary-fixed">
                  <HeartHandshake className="h-3.5 w-3.5" /> Verified network
                </span>
                <p className="text-[clamp(20px,2.6vw,30px)] font-semibold leading-[1.3] text-text">
                  Donors publish what expires. Recipients claim what they need.
                  <span className="neon-text"> FoodBridge bridges the rest.</span>
                </p>
                <ul className="custom-list text-[13.5px]">
                  <li>Food businesses: restaurants, hotels, supermarkets, bakeries, caterers</li>
                  <li>Recipients: NGOs, orphanages, shelters, old-age homes, community kitchens</li>
                  <li>Households: individual families with a verified beneficiary count</li>
                </ul>
                <div className="mt-auto flex flex-col gap-3 sm:flex-row">
                  <Link to="/register" className="btn-primary rounded-xl px-6 py-3">
                    Register as a donor
                  </Link>
                  <Link to="/register" className="btn-secondary rounded-xl px-6 py-3">
                    Register as a recipient
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="relative h-full min-h-[280px] overflow-hidden rounded-2xl border border-line">
                <img
                  src="https://images.unsplash.com/photo-1574202692919-f19a0b9dd704?w=1000&q=80"
                  alt="Fresh market produce ready for redistribution"
                  className="photo-natural absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="image-scrim absolute inset-0" />
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary-fixed">
                    Nothing wasted
                  </span>
                  <p className="mt-1 text-[17px] font-semibold text-text">
                    Natural food, natural colours â€” the rescue is the only tint.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â• CTA BAND â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        <section className="bg-primary text-[#050807]">
          <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-6 px-5 py-14 md:flex-row md:items-center md:px-8 lg:px-10">
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-[clamp(26px,4vw,44px)] font-bold leading-[1.05] tracking-[-0.02em]">
                Ready to bridge the gap?
              </h2>
              <p className="max-w-md text-[15px] font-medium text-[#050807]/75">
                Join as a donor business or community recipient. Setup takes under two
                minutes.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-app-deep px-7 text-[14px] font-bold text-primary transition-transform active:scale-[0.98]"
              >
                Create free account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-[#050807]/30 px-7 text-[14px] font-bold text-app-deep"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â• FOOTER â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <footer className="bg-app-deep py-12">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-5 md:px-8 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <img src="/stickers/01_brand_and_donation/foodbridge_logo.png" alt="" className="h-6 w-6 object-contain" />
              </span>
              <div>
                <p className="font-display text-[17px] font-bold text-text">FOODBRIDGE</p>
                <p className="text-[11px] font-semibold text-text-3">
                  Verified donors · Verified recipients · Zero-cost surplus rescue
                </p>
              </div>
            </div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
              {[
                ['Privacy', '/privacy'],
                ['Terms', '/terms'],
                ['Cookies', '/cookies'],
                ['Refund', '/refund'],
              ].map(([label, path]) => (
                <Link
                  key={path}
                  to={path}
                  className="text-[12px] font-bold uppercase tracking-[0.08em] text-text-3 transition-colors hover:text-primary-fixed"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex flex-col items-start justify-between gap-3 border-t border-line pt-6 text-[11px] text-text-3 md:flex-row md:items-center">
            <p>Â© {new Date().getFullYear()} FoodBridge â€” Smart Food Expiry Monitoring &amp; Surplus Redistribution.</p>
            <p className="font-semibold text-primary-fixed">Good Food. Better Future.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
