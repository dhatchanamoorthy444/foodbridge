import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, HeartHandshake, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import useAppStore from '../store/useAppStore'
import { authService } from '../services/api'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const resetSent = searchParams.get('reset') === 'sent'
  const setUser = useAppStore((s) => s.setUser)
  const setDemoSession = useAppStore((s) => s.setDemoSession)
  const configured = isSupabaseConfigured

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
      const profile = await authService.signIn(email.trim(), password)
      if (profile) {
        setDemoSession(false)
        setUser(profile)
        const target = profile.role === 'recipient' ? '/browse' : '/donor'
        navigate(target, { replace: true })
      } else {
        setError('Signed in successfully, but profile record was not retrieved. Please refresh or retry.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090B09] text-white">
      {/* Public Header */}
      <header className="fixed top-0 w-full z-50 bg-[#090B09] border-b border-[#262E26]">
        <div className="h-16 px-4 flex items-center justify-between max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="/stickers/cream/01_brand_and_donation/foodbridge_logo.png"
              alt="FoodBridge logo"
              className="h-9 w-9 rounded-lg object-contain"
            />
            <span className="font-['Anton'] text-xl text-white tracking-tight uppercase">FOODBRIDGE</span>
          </Link>
          <Link
            to="/register"
            className="font-mono text-xs font-bold uppercase tracking-widest text-[#D7EF4A] hover:text-[#E8F5A4] transition-colors"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 pt-16 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm space-y-6"
        >
          <div className="text-center space-y-2">
            <h1 className="font-['Anton'] text-3xl text-white uppercase tracking-tight">Station Sign In</h1>
            <p className="font-mono text-xs text-[#858C84] uppercase tracking-wider">
              Access your FoodBridge operations portal
            </p>
          </div>

          {resetSent && (
            <div className="p-3.5 rounded-xl border border-[#262E26] bg-[#131713] font-mono text-xs text-[#BCD147]">
              Check your inbox — password reset link dispatched.
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#410002] border border-[#FF5449]/40">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#FF5449]" />
              <p className="text-xs text-[#FFDAD6] font-mono">{error}</p>
            </div>
          )}

          {!configured && (
            <div className="p-3.5 rounded-xl border border-[#262E26] bg-[#131713] text-xs text-[#858C84] font-mono">
              Authentication is unconfigured. Set <code className="text-[#D7EF4A]">VITE_SUPABASE_URL</code> and <code className="text-[#D7EF4A]">VITE_SUPABASE_ANON_KEY</code>.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block font-mono text-[10px] font-bold mb-1.5 text-[#858C84] tracking-widest uppercase">
                Station Account Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858C84]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="operator@organization.org"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#131713] border border-[#262E26] text-white text-xs font-mono placeholder-[#858C84] focus:outline-none focus:border-[#D7EF4A]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block font-mono text-[10px] font-bold mb-1.5 text-[#858C84] tracking-widest uppercase">
                Access Key / Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858C84]" />
                <input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#131713] border border-[#262E26] text-white text-xs font-mono placeholder-[#858C84] focus:outline-none focus:border-[#D7EF4A]"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#858C84] hover:text-white"
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !configured}
              className="w-full h-12 rounded-xl bg-[#D7EF4A] text-[#090B09] font-mono text-xs uppercase font-extrabold tracking-wider hover:bg-[#E8F5A4] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Authenticate & Launch</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center space-y-2 pt-2">
            <button
              type="button"
              onClick={async () => {
                if (!configured) return toast.error('Authentication not configured')
                if (!email) return toast.error('Enter your email above first')
                try {
                  await authService.requestPasswordReset(email.trim())
                  toast.success('Password reset email dispatched')
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : 'Reset failed')
                }
              }}
              className="font-mono text-xs text-[#858C84] hover:text-white transition-colors"
            >
              Forgot station password?
            </button>
            <p className="font-mono text-xs text-[#858C84]">
              Need a verified account?{' '}
              <Link to="/register" className="text-[#D7EF4A] font-bold">
                Register station
              </Link>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 font-mono text-[10px] text-[#858C84] pt-4 border-t border-[#262E26]">
            <HeartHandshake className="w-3.5 h-3.5 text-[#D7EF4A]" /> Real food, verified redistribution telemetry
          </div>
        </motion.div>
      </div>
    </div>
  )
}
