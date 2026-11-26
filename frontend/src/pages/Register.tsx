import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, Loader2, Building2, MapPin, Phone, User, Users, Home } from 'lucide-react'
import useAppStore from '../store/useAppStore'
import { authService, SignUpPayload } from '../services/api'
import { isSupabaseConfigured } from '../lib/supabase'
import { DONOR_ACCOUNT_TYPES, RECIPIENT_ACCOUNT_TYPES } from '../types/api'

type Role = 'donor' | 'recipient'

interface FormState {
  role: Role
  fullName: string
  organization: string
  email: string
  password: string
  confirm: string
  phone: string
  account_type: string
  address: string
  city: string
  postal_code: string
  beneficiary_count: string
}

const STEPS = ['Role', 'Identity', 'Contact', 'Review'] as const

export default function Register() {
  const navigate = useNavigate()
  const setUser = useAppStore((s) => s.setUser)
  const configured = isSupabaseConfigured

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>({
    role: 'donor',
    fullName: '',
    organization: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
    account_type: 'restaurant',
    address: '',
    city: '',
    postal_code: '',
    beneficiary_count: '',
  })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [needsConfirm, setNeedsConfirm] = useState(false)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const accountTypes = useMemo(() => {
    return form.role === 'donor' ? DONOR_ACCOUNT_TYPES : RECIPIENT_ACCOUNT_TYPES
  }, [form.role])

  const validateStep = (s: number): string | null => {
    if (s === 1) {
      if (!form.fullName.trim()) return 'Name is required'
      if (!form.email.trim() || !form.email.includes('@')) return 'A valid email is required'
      if (form.password.length < 6) return 'Password must be at least 6 characters'
      if (form.password !== form.confirm) return 'Passwords do not match'
    } else if (s === 2) {
      if (!form.phone.trim()) return 'Phone number is required'
      if (!form.address.trim()) return 'Address is required'
      if (!form.city.trim()) return 'City is required'
    }
    return null
  }

  const next = () => {
    const err = validateStep(step)
    if (err) {
      setError(err)
      return
    }
    setError('')
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const prev = () => {
    setError('')
    setStep((s) => Math.max(s - 1, 0))
  }

  const handleTypeSwitch = (role: Role) => {
    setForm((f) => ({
      ...f,
      role,
      account_type: role === 'donor' ? 'restaurant' : 'ngo',
    }))
  }

  const submit = async () => {
    setError('')
    setLoading(true)
    try {
      const payload: SignUpPayload = {
        email: form.email.trim(),
        password: form.password,
        role: form.role,
        full_name: form.fullName.trim(),
        organization: form.organization.trim() || '',
        phone: form.phone.trim(),
        account_type: form.account_type,
        address: form.address.trim(),
        city: form.city.trim(),
        postal_code: form.postal_code.trim(),
        beneficiary_count:
          form.role === 'recipient' && form.beneficiary_count
            ? Number(form.beneficiary_count)
            : null,
      }
      const result = await authService.signUp(payload)
      if (result.needsEmailConfirm) {
        setNeedsConfirm(true)
      } else if (result.profile) {
        setUser(result.profile)
        const target = result.profile.role === 'recipient' ? '/browse' : '/donor'
        navigate(target, { replace: true })
      } else {
        setNeedsConfirm(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  if (needsConfirm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090B09] px-4 text-white">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center space-y-4 bg-[#131713] border border-[#262E26] rounded-2xl p-8"
        >
          <Mail className="w-12 h-12 mx-auto text-[#D7EF4A]" />
          <h1 className="font-['Anton'] text-2xl uppercase tracking-wide">Confirm your station email</h1>
          <p className="text-xs text-[#B8BDB6] font-mono leading-relaxed">
            We sent a verification link to <span className="text-[#D7EF4A] font-bold">{form.email}</span>. Click the link in the message to activate your account, then sign in.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D7EF4A] text-[#090B09] font-mono text-xs font-bold uppercase tracking-wider"
          >
            Go to Station Sign In <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#090B09] text-white">
      {/* Header */}
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
            to="/login"
            className="font-mono text-xs font-bold uppercase tracking-widest text-[#D7EF4A] hover:text-[#E8F5A4] transition-colors"
          >
            Sign In
          </Link>
        </div>
      </header>

      <div className="flex-1 pt-20 flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-5"
        >
          <div className="text-center space-y-1">
            <h1 className="font-['Anton'] text-3xl uppercase tracking-tight">Register Node</h1>
            <p className="font-mono text-xs text-[#858C84] uppercase">Join the FoodBridge Surplus Rescue Network</p>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center justify-between gap-1 p-1 bg-[#131713] border border-[#262E26] rounded-xl font-mono text-[10px] uppercase">
            {STEPS.map((s, idx) => (
              <div
                key={s}
                className={`flex-1 text-center py-1.5 rounded-lg transition-colors font-bold ${
                  step === idx
                    ? 'bg-[#D7EF4A] text-[#090B09]'
                    : step > idx
                    ? 'text-[#BCD147]'
                    : 'text-[#858C84]'
                }`}
              >
                {idx + 1}. {s}
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#410002] border border-[#FF5449]/40 font-mono text-xs text-[#FFDAD6]">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#FF5449]" />
              <p>{error}</p>
            </div>
          )}

          {!configured && (
            <div className="p-3.5 rounded-xl border border-[#262E26] bg-[#131713] text-xs text-[#858C84] font-mono">
              Authentication is unconfigured. Set <code className="text-[#D7EF4A]">VITE_SUPABASE_URL</code> / <code className="text-[#D7EF4A]">VITE_SUPABASE_ANON_KEY</code>.
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 0: Role Selection */}
            {step === 0 && (
              <motion.div
                key="s0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <div className="space-y-2">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#858C84]">
                    Select Your Node Role
                  </label>
                  <div className="grid grid-cols-1 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleTypeSwitch('donor')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        form.role === 'donor'
                          ? 'border-[#D7EF4A] bg-[#143527]'
                          : 'border-[#262E26] bg-[#131713] hover:border-[#858C84]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#090B09] flex items-center justify-center text-[#D7EF4A]">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-['Anton'] text-lg uppercase text-white">Donor Purveyor</div>
                          <p className="text-xs text-[#858C84]">Hotels, restaurants, bakeries, banquets, and supermarkets donating surplus food.</p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTypeSwitch('recipient')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        form.role === 'recipient'
                          ? 'border-[#D7EF4A] bg-[#143527]'
                          : 'border-[#262E26] bg-[#131713] hover:border-[#858C84]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#090B09] flex items-center justify-center text-[#D7EF4A]">
                          <Home className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-['Anton'] text-lg uppercase text-white">Recipient Organization / NGO</div>
                          <p className="text-xs text-[#858C84]">Shelters, community soup kitchens, orphanages, and verified NGOs receiving surplus.</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block font-mono text-[10px] font-bold uppercase tracking-wider text-[#858C84] mb-1.5">
                    Organization Type
                  </label>
                  <select
                    value={form.account_type}
                    onChange={(e) => set('account_type', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#131713] border border-[#262E26] text-white text-xs font-mono uppercase"
                  >
                    {accountTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Step 1: Identity & Credentials */}
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3 font-mono text-xs"
              >
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#858C84] mb-1">Full Operator Name</label>
                  <input
                    value={form.fullName}
                    onChange={(e) => set('fullName', e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#131713] border border-[#262E26] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#858C84] mb-1">Organization / Business Name</label>
                  <input
                    value={form.organization}
                    onChange={(e) => set('organization', e.target.value)}
                    placeholder="e.g. Grand Chola Banquets or Hope Shelter"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#131713] border border-[#262E26] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#858C84] mb-1">Work Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="ops@organization.org"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#131713] border border-[#262E26] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#858C84] mb-1">Password</label>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#131713] border border-[#262E26] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#858C84] mb-1">Confirm Password</label>
                  <input
                    type={showPwd ? 'text' : 'password'}
                    value={form.confirm}
                    onChange={(e) => set('confirm', e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#131713] border border-[#262E26] text-white"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Contact & Location */}
            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3 font-mono text-xs"
              >
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#858C84] mb-1">Direct Phone Number</label>
                  <input
                    value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    placeholder="+91 98400 12345"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#131713] border border-[#262E26] text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-[#858C84] mb-1">Street Address</label>
                  <input
                    value={form.address}
                    onChange={(e) => set('address', e.target.value)}
                    placeholder="Dock / Gate / Building Street"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#131713] border border-[#262E26] text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#858C84] mb-1">City</label>
                    <input
                      value={form.city}
                      onChange={(e) => set('city', e.target.value)}
                      placeholder="Chennai"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#131713] border border-[#262E26] text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#858C84] mb-1">Postal Code</label>
                    <input
                      value={form.postal_code}
                      onChange={(e) => set('postal_code', e.target.value)}
                      placeholder="600001"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#131713] border border-[#262E26] text-white"
                    />
                  </div>
                </div>
                {form.role === 'recipient' && (
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-[#858C84] mb-1">Average Daily Beneficiaries</label>
                    <input
                      type="number"
                      value={form.beneficiary_count}
                      onChange={(e) => set('beneficiary_count', e.target.value)}
                      placeholder="e.g. 150"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#131713] border border-[#262E26] text-white"
                    />
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <motion.div
                key="s3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3 font-mono text-xs bg-[#131713] border border-[#262E26] rounded-xl p-4"
              >
                <div className="flex justify-between border-b border-[#262E26] pb-2">
                  <span className="text-[#858C84] uppercase">Role:</span>
                  <span className="font-bold text-[#D7EF4A] uppercase">{form.role}</span>
                </div>
                <div className="flex justify-between border-b border-[#262E26] pb-2">
                  <span className="text-[#858C84] uppercase">Organization:</span>
                  <span className="text-white font-bold">{form.organization || form.fullName}</span>
                </div>
                <div className="flex justify-between border-b border-[#262E26] pb-2">
                  <span className="text-[#858C84] uppercase">Email:</span>
                  <span className="text-white">{form.email}</span>
                </div>
                <div className="flex justify-between border-b border-[#262E26] pb-2">
                  <span className="text-[#858C84] uppercase">Contact:</span>
                  <span className="text-white">{form.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#858C84] uppercase">Location:</span>
                  <span className="text-white">{form.city} ({form.postal_code || 'N/A'})</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            {step > 0 && (
              <button
                type="button"
                onClick={prev}
                className="px-4 py-3 rounded-xl bg-[#1C221C] border border-[#262E26] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#252B25] flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={next}
                className="flex-1 py-3 rounded-xl bg-[#D7EF4A] text-[#090B09] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#E8F5A4] flex items-center justify-center gap-1.5"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={loading || !configured}
                className="flex-1 py-3 rounded-xl bg-[#D7EF4A] text-[#090B09] font-mono text-xs font-extrabold uppercase tracking-wider hover:bg-[#E8F5A4] flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Commit Registration</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
