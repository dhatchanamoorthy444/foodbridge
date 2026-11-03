import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Mail, Lock, Eye, EyeOff, User, Building2, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import useAppStore from '../store/useAppStore'

const C = {
  primary: '#dfff00', primaryContainer: '#0e5c35',
  secondary: '#2bff88', secondaryFixed: '#6ffbbe', onSecondaryFixed: '#002113',
  surface: '#0a0a0a', surfaceLowest: '#141614',
  surfaceContainerLow: '#1b1e1b', surfaceContainer: '#232723',
  surfaceContainerHigh: '#2e322e',
  onSurface: '#ffffff', onSurfaceVariant: '#9aa39b',
  error: '#ff4d4d', errorContainer: '#3a1414', onErrorContainer: '#ff9d9d',
}

type Role = 'donor' | 'recipient' | 'volunteer' | 'admin'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAppStore()
  const [form, setForm] = useState({ fullName: '', email: '', organization: '', role: 'donor' as Role, password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setSuccess(true)
    setTimeout(() => {
      login({
        id: Date.now().toString(),
        email: form.email,
        fullName: form.fullName,
        role: form.role,
        status: 'active',
        organization: form.organization,
        createdAt: new Date(),
      })
      navigate('/')
    }, 1500)
    setLoading(false)
  }

  const roles = [
    { id: 'donor', label: 'Donor', emoji: '🌱' },
    { id: 'recipient', label: 'NGO / Recipient', emoji: '🏠' },
    { id: 'admin', label: 'Admin', emoji: '⚙️' },
    { id: 'volunteer', label: 'Volunteer', emoji: '🤝' },
  ] as const

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.surface }}>

      {/* Header */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-xl"
        style={{ background: 'rgba(10,10,10,0.85)', boxShadow: '0 1px 8px rgba(0,0,0,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="h-16 px-4 flex items-center justify-between max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.primary }}>
              <Heart className="w-4 h-4" style={{ color: C.onSecondaryFixed }} strokeWidth={2.6} />
            </div>
            <div className="flex flex-col leading-none">
              <span style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 20, color: C.primary, letterSpacing: '0.02em' }}>FoodBridge</span>
              <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 8, fontWeight: 700, color: C.secondary, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Surplus Resilience</span>
            </div>
          </Link>
          <Link to="/login"
            className="h-10 px-5 rounded-lg text-sm font-semibold transition-all active:scale-95"
            style={{ background: C.primary, color: '#0a0a0a', fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Sign In
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 pt-16 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="w-full max-w-sm space-y-6">

          {/* Brand */}
          <div className="text-center space-y-1">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-md"
              style={{ background: C.primary }}>
              <Heart className="w-7 h-7" style={{ color: C.onSecondaryFixed }} strokeWidth={2.5} />
            </div>
            <h1 style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 28, color: C.primary, letterSpacing: '0.02em' }}>Join FoodBridge</h1>
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 14, color: C.onSurfaceVariant }}>Create your account to start rescuing food</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: C.errorContainer }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: C.onErrorContainer }} />
              <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, color: C.onErrorContainer }}>{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#232723' }}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: C.secondary }} />
              <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, color: C.secondary }}>Account created! Redirecting...</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role selection */}
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', color: C.onSurface, letterSpacing: '0.04em' }}>I am a</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map(r => (
                  <button key={r.id} type="button" onClick={() => setForm(f => ({ ...f, role: r.id as Role }))}
                    className="py-2.5 rounded-xl text-center transition-all active:scale-95"
                    style={{ background: form.role === r.id ? C.primaryContainer : C.surfaceLowest,
                      color: form.role === r.id ? '#ffffff' : C.onSurfaceVariant,
                      fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.04em' }}>
                    <div>{r.emoji}</div>
                    <div className="mt-0.5 text-[10px]">{r.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            {
              [
                { key: 'fullName', label: 'Full Name', placeholder: 'Your name', Icon: User },
                { key: 'email', label: 'Email Address', placeholder: 'you@example.com', Icon: Mail },
                { key: 'organization', label: 'Organisation / Hub Name', placeholder: 'e.g. Green Leaf Bakery', Icon: Building2 },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', color: C.onSurface, letterSpacing: '0.04em' }}>{f.label}</label>
                  <div className="relative">
                    <f.Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.onSurfaceVariant }} />
                    <input type={f.key === 'email' ? 'email' : 'text'} required value={(form as any)[f.key]} onChange={set(f.key)} placeholder={f.placeholder}
                      className="w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none"
                      style={{ background: C.surfaceLowest, border: `1px solid ${C.surfaceContainerHigh}`, color: C.onSurface, fontFamily: 'Rubik, sans-serif' }} />
                  </div>
                </div>
              ))
            }

            {/* Password fields */}
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', color: C.onSurface, letterSpacing: '0.04em' }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.onSurfaceVariant }} />
                <input type={showPwd ? 'text' : 'password'} required value={form.password} onChange={set('password')} placeholder="Min. 6 characters"
                  className="w-full h-11 pl-10 pr-10 rounded-xl text-sm outline-none"
                  style={{ background: C.surfaceLowest, border: `1px solid ${C.surfaceContainerHigh}`, color: C.onSurface, fontFamily: 'Rubik, sans-serif' }} />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: C.onSurfaceVariant }}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', color: C.onSurface, letterSpacing: '0.04em' }}>Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.onSurfaceVariant }} />
                <input type="password" required value={form.confirm} onChange={set('confirm')} placeholder="Repeat password"
                  className="w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none"
                  style={{ background: C.surfaceLowest, border: `1px solid ${C.surfaceContainerHigh}`, color: C.onSurface, fontFamily: 'Rubik, sans-serif' }} />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded" style={{ accentColor: C.primary }} />
              <label style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: C.onSurfaceVariant, lineHeight: '18px' }}>
                I agree to the{' '}
                <Link to="/terms" style={{ color: C.secondary, fontWeight: 600 }}>Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" style={{ color: C.secondary, fontWeight: 600 }}>Privacy Policy</Link>
              </label>
            </div>

            <button type="submit" disabled={loading || success}
              className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md disabled:opacity-60"
              style={{ background: C.primary, color: '#0a0a0a', fontFamily: 'Rubik, sans-serif', fontSize: 15 }}>
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : success
                  ? <><CheckCircle2 className="w-5 h-5" /> Account Created!</>
                  : 'Create Account'}
            </button>
          </form>

          <p className="text-center" style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, color: C.onSurfaceVariant }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: C.secondary, fontWeight: 600 }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
