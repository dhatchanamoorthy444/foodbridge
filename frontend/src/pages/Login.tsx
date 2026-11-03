import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'
import useAppStore from '../store/useAppStore'

const C = {
  primary: '#dfff00',
  primaryContainer: '#0e5c35',
  secondary: '#2bff88',
  secondaryFixed: '#6ffbbe',
  onSecondaryFixed: '#002113',
  surface: '#0a0a0a',
  error: '#ff4d4d',
  errorContainer: '#3a1414',
  onErrorContainer: '#ff9d9d',
}

const DEMO_USERS = {
  'donor@demo.com':     { id: '1', email: 'donor@demo.com',     fullName: 'Alex Chen',    role: 'donor'     as const, status: 'active' as const, organization: 'Green Leaf Bakery & Supermarket',  createdAt: new Date() },
  'recipient@demo.com': { id: '2', email: 'recipient@demo.com', fullName: 'Maria Santos', role: 'recipient' as const, status: 'active' as const, organization: 'Hope Community Kitchen',           createdAt: new Date() },
  'admin@demo.com':     { id: '3', email: 'admin@demo.com',     fullName: 'Admin User',   role: 'admin'     as const, status: 'active' as const, organization: 'FoodBridge Central Authority',     createdAt: new Date() },
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAppStore()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const user = DEMO_USERS[email as keyof typeof DEMO_USERS]
    if (user && password.length >= 4) {
      login(user)
      navigate('/')
    } else {
      setError('Invalid credentials. Use a demo account below.')
    }
    setLoading(false)
  }

  const handleQuickLogin = (key: keyof typeof DEMO_USERS) => {
    setLoading(true)
    setTimeout(() => { login(DEMO_USERS[key]); navigate('/') }, 500)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: C.surface }}>

      {/* Header */}
      <header className="fixed top-0 w-full z-50" style={{ background: C.surface, borderBottom: '1px solid rgba(111,251,190,0.12)' }}>
        <div className="h-16 px-4 flex items-center justify-between max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.secondaryFixed }}>
              <Heart className="w-4 h-4" style={{ color: C.onSecondaryFixed }} strokeWidth={2.6} />
            </div>
            <div className="flex flex-col leading-none">
              <span style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 20, color: '#ffffff', letterSpacing: '0.02em' }}>FOODBRIDGE</span>
              <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 8, fontWeight: 700, color: C.secondaryFixed, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Surplus Resilience</span>
            </div>
          </Link>
          <Link to="/register"
            style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 11, fontWeight: 700, color: C.secondaryFixed, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Create Account
          </Link>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 pt-16 flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="w-full max-w-sm space-y-6">

          {/* Brand mark */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg"
              style={{ background: C.secondaryFixed }}>
              <Heart className="w-8 h-8" style={{ color: C.onSecondaryFixed }} strokeWidth={2.5} />
            </div>
            <h1 style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 32, color: '#ffffff', letterSpacing: '0.02em', textTransform: 'uppercase' }}>Welcome Back</h1>
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 14, color: 'rgba(215,230,217,0.75)' }}>Sign in to your FoodBridge portal</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: C.errorContainer }}>
              <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: C.onErrorContainer }} />
              <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, color: C.onErrorContainer }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', color: 'rgba(215,230,217,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(215,230,217,0.5)' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  className="w-full h-12 pl-10 pr-4 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(111,251,190,0.2)', color: '#ffffff', fontFamily: 'Rubik, sans-serif' }} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ fontFamily: 'Be Vietnam Pro, sans-serif', color: 'rgba(215,230,217,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(215,230,217,0.5)' }} />
                <input type={showPwd ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="Your password"
                  className="w-full h-12 pl-10 pr-10 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(111,251,190,0.2)', color: '#ffffff', fontFamily: 'Rubik, sans-serif' }} />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'rgba(215,230,217,0.5)' }}>
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 shadow-lg"
              style={{ background: C.primary, color: C.onSecondaryFixed, fontFamily: 'Rubik, sans-serif', fontSize: 15, fontWeight: 600 }}>
              {loading
                ? <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(111,251,190,0.15)' }} />
            <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 700, color: 'rgba(215,230,217,0.45)', letterSpacing: '0.1em' }}>DEMO ACCESS</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(111,251,190,0.15)' }} />
          </div>

          {/* Quick login */}
          <div className="space-y-2">
            {[
              { key: 'donor@demo.com'     as const, label: 'Donor',        desc: 'Green Leaf Bakery & Supermarket', emoji: '🌱' },
              { key: 'recipient@demo.com' as const, label: 'Recipient NGO', desc: 'Hope Community Kitchen',          emoji: '🏠' },
              { key: 'admin@demo.com'     as const, label: 'Admin',         desc: 'FoodBridge Central Authority',    emoji: '⚙️' },
            ].map(({ key, label, desc, emoji }) => (
              <button key={key} onClick={() => handleQuickLogin(key)} disabled={loading}
                className="w-full flex items-center gap-3 p-3 rounded-xl transition-all active:scale-[0.98] text-left"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(111,251,190,0.15)' }}>
                <span className="text-xl">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, fontWeight: 600, color: C.secondaryFixed }}>{label}</p>
                  <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 11, color: 'rgba(215,230,217,0.55)' }}>{desc}</p>
                </div>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: C.secondaryFixed, color: C.onSecondaryFixed, fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.06em' }}>
                  <ShieldCheck className="w-3 h-3" /> DEMO
                </span>
              </button>
            ))}
          </div>

          <p className="text-center" style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, color: 'rgba(215,230,217,0.55)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: C.secondaryFixed, fontWeight: 600 }}>Sign up free</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
