import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, HeartHandshake, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import useAppStore from '../store/useAppStore'
import { authService } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resetSent = searchParams.get('reset') === 'sent'
  const setUser = useAppStore((s) => s.setUser)
  const setDemoSession = useAppStore((s) => s.setDemoSession)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const profile = await authService.signIn(email, password)
      if (profile) {
        setDemoSession(false)
        setUser(profile)
        navigate(profile.role === 'recipient' ? '/browse' : '/donor', { replace: true })
      } else {
        setError('Signed in but profile is missing. Try again shortly.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-app-deep">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 45% at 82% 6%, rgba(183,217,106,0.09) 0%, rgba(5,8,7,0) 55%), radial-gradient(45% 40% at 6% 92%, rgba(16,60,45,0.55) 0%, rgba(5,8,7,0) 60%)',
        }}
      />
      <header className="fixed top-0 w-full z-50 bg-app-deep/85 backdrop-blur-md border-b border-line">
        <div className="h-16 px-4 flex items-center justify-between max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/stickers/cream/01_brand_and_donation/foodbridge_logo.png" alt="FoodBridge logo" className="h-9 w-9 rounded-lg object-contain" />
            <span className="font-display text-xl text-text tracking-tight">FOODBRIDGE</span>
          </Link>
          <Link to="/register" className="text-[11px] font-bold uppercase tracking-widest text-primary-fixed hover:text-text transition-colors">
            Create Account
          </Link>
        </div>
      </header>

      <div className="relative flex-1 pt-16 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-sm space-y-6"
        >
          <div className="text-center space-y-2">
            <img src="/stickers/cream/01_brand_and_donation/foodbridge_logo.png" alt="FoodBridge logo" className="h-16 w-16 mx-auto object-contain" />
            <h1 className="font-display text-3xl text-text tracking-tight">Welcome Back</h1>
            <p className="text-sm text-text-2">Sign in to your FoodBridge portal</p>
          </div>

          {resetSent && (
            <div className="p-3 rounded-xl border border-line bg-elevated text-sm text-text-2">
              Check your email — a password reset link is on its way.
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-danger-soft">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-danger" />
              <p className="text-[13px] text-danger">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-[11px] font-bold mb-1.5 text-text-2 tracking-widest uppercase">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[11px] font-bold mb-1.5 text-text-2 tracking-widest uppercase">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Your password"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full h-12 text-[15px]">
              {loading
                ? <Loader2 className="w-5 h-5 animate-spin" />
                : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
              }
            </button>
          </form>

          <div className="text-center space-y-2">
            <button
              type="button"
              onClick={async () => {
                if (!email) return toast.error('Enter your email above first')
                try {
                  await authService.requestPasswordReset(email)
                  toast.success('Password reset email sent')
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : 'Reset failed')
                }
              }}
              className="text-[13px] text-text-2 hover:text-text transition-colors"
            >
              Forgot your password?
            </button>
            <p className="text-[13px] text-text-2">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-fixed font-semibold">Sign up free</Link>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-text-3">
            <HeartHandshake className="w-3.5 h-3.5" /> Real food, real people, no fake numbers
          </div>
        </motion.div>
      </div>
    </div>
  )
}
