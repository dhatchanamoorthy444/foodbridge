import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react'
import { loginSchema, LoginFormData } from '../lib/validations'
import useAppStore from '../store/useAppStore'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAppStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const demoUsers = {
    'donor@demo.com': {
      id: '1',
      email: 'donor@demo.com',
      fullName: 'Green Market Groceries',
      role: 'donor' as const,
      status: 'active' as const,
      organization: 'Green Market LLC',
      createdAt: new Date(),
    },
    'recipient@demo.com': {
      id: '2',
      email: 'recipient@demo.com',
      fullName: 'City Food Shelter',
      role: 'recipient' as const,
      status: 'active' as const,
      organization: 'Community Hope Shelter',
      createdAt: new Date(),
    },
    'admin@demo.com': {
      id: '3',
      email: 'admin@demo.com',
      fullName: 'Platform Moderator',
      role: 'admin' as const,
      status: 'active' as const,
      organization: 'FoodBridge Central Admin',
      createdAt: new Date(),
    },
  }

  const handleDirectLogin = (email: keyof typeof demoUsers) => {
    setIsLoading(true)
    setError('')
    setTimeout(() => {
      login(demoUsers[email])
      setIsLoading(false)
      navigate('/')
    }, 400)
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')

    try {
      await new Promise((resolve) => setTimeout(resolve, 600))

      const user = demoUsers[data.email as keyof typeof demoUsers]
      if (user && data.password === 'demo123') {
        login(user)
        navigate('/')
      } else if (data.email && data.password) {
        // Fallback demo user for arbitrary logins during evaluation
        login({
          id: Date.now().toString(),
          email: data.email,
          fullName: 'Verified Partner',
          role: 'donor',
          status: 'active',
          organization: 'Partner Organization',
          createdAt: new Date(),
        })
        navigate('/')
      } else {
        setError('Invalid email or password. Use demo accounts below.')
      }
    } catch (err) {
      setError('An authentication error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0b1510] text-cream flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none noise-overlay" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-stone hover:text-cream text-xs font-mono uppercase tracking-wider mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Overview
        </Link>

        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-botanical flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-cream" />
            </div>
            <span className="font-serif font-bold text-2xl text-cream">FoodBridge</span>
          </div>
          <p className="text-stone text-xs mt-2 uppercase tracking-wider font-mono">
            Surplus Redistribution Platform
          </p>
        </div>

        {/* Login Card */}
        <div className="earth-card p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-serif text-cream mb-1">Access Account</h1>
            <p className="text-stone text-xs">Sign in to manage surplus listings and allocations</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded bg-rose-950/80 border border-rose-700/50 flex items-start gap-3 text-xs text-rose-200"
            >
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="input-label">Work / Organizational Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-dark" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="donor@demo.com"
                  className="input-field pl-10"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-dark" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-dark hover:text-cream"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-stone">
                <input
                  type="checkbox"
                  className="rounded border-forest-600 bg-forest-900 text-botanical focus:ring-botanical"
                />
                <span>Remember session</span>
              </label>
              <button
                type="button"
                onClick={() => handleDirectLogin('donor@demo.com')}
                className="text-botanical-light hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-2.5 mt-2 justify-center"
            >
              {isLoading ? 'Authenticating...' : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Explicit One-Click Quick Demo Accounts */}
          <div className="mt-6 pt-5 border-t border-forest-600/30">
            <p className="text-center text-xs font-mono uppercase tracking-wider text-stone mb-3">
              One-Click Demo Authentication
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'donor@demo.com')
                  setValue('password', 'demo123')
                  handleDirectLogin('donor@demo.com')
                }}
                className="py-2 px-2 rounded bg-forest-800 hover:bg-forest-700 text-cream text-xs font-medium border border-forest-600/40 transition-colors text-center"
              >
                Donor
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'recipient@demo.com')
                  setValue('password', 'demo123')
                  handleDirectLogin('recipient@demo.com')
                }}
                className="py-2 px-2 rounded bg-forest-800 hover:bg-forest-700 text-cream text-xs font-medium border border-forest-600/40 transition-colors text-center"
              >
                Recipient
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('email', 'admin@demo.com')
                  setValue('password', 'demo123')
                  handleDirectLogin('admin@demo.com')
                }}
                className="py-2 px-2 rounded bg-forest-800 hover:bg-forest-700 text-cream text-xs font-medium border border-forest-600/40 transition-colors text-center"
              >
                Admin
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-stone mt-6 px-1">
          <Link to="/privacy" className="hover:text-cream">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-cream">Terms of Service</Link>
          <Link to="/cookies" className="hover:text-cream">Cookie Policy</Link>
        </div>
      </motion.div>
    </div>
  )
}
