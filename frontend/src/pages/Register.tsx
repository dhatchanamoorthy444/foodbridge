import { useMemo, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, Loader2, Building2, MapPin, Phone, User, Users, Home } from 'lucide-react'
import useAppStore from '../store/useAppStore'
import { authService, SignUpPayload } from '../services/api'
import { DONOR_ACCOUNT_TYPES, RECIPIENT_ACCOUNT_TYPES, UNIT_LABELS } from '../types/api'

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

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }))

  const accountTypes = useMemo(
    () => (form.role === 'donor' ? DONOR_ACCOUNT_TYPES : RECIPIENT_ACCOUNT_TYPES),
    [form.role]
  )

  const passwordChecks = useMemo(
    () => ({
      length: form.password.length >= 8,
      mixed: /[A-Za-z]/.test(form.password) && /[0-9]/.test(form.password),
      match: form.password !== '' && form.password === form.confirm,
    }),
    [form.password, form.confirm]
  )

  const canAdvance = (s: number): boolean => {
    switch (s) {
      case 0:
        return !!form.role
      case 1:
        return (
          (form.role === 'donor' ? form.organization.trim().length >= 2 : form.fullName.trim().length >= 2) &&
          form.email.includes('@') &&
          passwordChecks.length &&
          passwordChecks.match &&
          passwordChecks.mixed
        )
      case 2:
        return form.phone.trim().length >= 6 && !!form.account_type && form.city.trim().length >= 2
      default:
        return true
    }
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
        navigate(result.profile.role === 'recipient' ? '/browse' : '/donor', { replace: true })
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
      <div className="min-h-screen flex items-center justify-center bg-app px-4">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center space-y-4 bg-panel border border-line rounded-2xl p-8">
          <Mail className="w-10 h-10 mx-auto text-primary-fixed" />
          <h1 className="font-display text-2xl text-text">Confirm your email</h1>
          <p className="text-sm text-text-2">
            We sent a verification link to <span className="text-text font-semibold">{form.email}</span>. Click the link to activate your FoodBridge account, then sign in.
          </p>
          <Link to="/login" className="btn-primary inline-flex w-full justify-center">Go to sign in</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-app">
      <header className="fixed top-0 w-full z-50 bg-app border-b border-line">
        <div className="h-16 px-4 flex items-center justify-between max-w-6xl mx-auto">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/stickers/cream/01_brand_and_donation/foodbridge_logo.png" alt="FoodBridge logo" className="h-9 w-9 rounded-lg object-contain" />
            <span className="font-display text-xl text-text tracking-tight">FOODBRIDGE</span>
          </Link>
          <Link to="/login" className="text-[11px] font-bold uppercase tracking-widest text-primary-fixed hover:text-text transition-colors">Sign In</Link>
        </div>
      </header>

      <div className="flex-1 pt-16 flex items-center justify-center px-4 py-10">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-5">
          <div className="text-center space-y-1">
            <h1 className="font-display text-3xl text-text tracking-tight">Join FoodBridge</h1>
            <p className="text-sm text-text-2">Four quick steps to start rescuing food</p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-1">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1">
                <div className={`h-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-elevated'}`} />
                <p className={`mt-1 text-[10px] font-bold uppercase tracking-widest ${i <= step ? 'text-primary-fixed' : 'text-text-3'}`}>{label}</p>
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-danger-soft">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-danger" />
              <p className="text-[13px] text-danger">{error}</p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                {(
                  [
                    { id: 'donor' as Role, title: 'I have food to give', desc: 'Restaurant, hotel, grocery, bakery or food business', icon: Building2 },
                    { id: 'recipient' as Role, title: 'I need food for people', desc: 'NGO, shelter, orphanage, community kitchen, household', icon: Home },
                  ]
                ).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleTypeSwitch(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${form.role === opt.id ? 'border-primary bg-primary-container' : 'border-line bg-panel hover:border-line'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${form.role === opt.id ? 'bg-primary text-on-primary' : 'bg-elevated text-text-2'}`}>
                        <opt.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-text">{opt.title}</p>
                        <p className="text-[12px] text-text-2">{opt.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold mb-1.5 text-text-2 tracking-widest uppercase">
                    {form.role === 'donor' ? 'Business / organization name' : 'Full name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                    {form.role === 'donor' ? (
                      <input value={form.organization} onChange={(e) => set('organization', e.target.value)} placeholder="e.g. Green Leaf Bakery" className="input-field pl-10" />
                    ) : (
                      <input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="e.g. Maria Santos" className="input-field pl-10" />
                    )}
                  </div>
                  {form.role === 'recipient' && (
                    <input value={form.organization} onChange={(e) => set('organization', e.target.value)} placeholder="Organization (optional — NGO name)" className="input-field mt-2" />
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-1.5 text-text-2 tracking-widest uppercase">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                    <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" className="input-field pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-1.5 text-text-2 tracking-widest uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                    <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={(e) => set('password', e.target.value)} className="input-field pl-10 pr-10" />
                    <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3" aria-label={showPwd ? 'Hide password' : 'Show password'}>
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px]">
                    <Check ok={passwordChecks.length} label="8+ characters" />
                    <Check ok={passwordChecks.mixed} label="letters & numbers" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-1.5 text-text-2 tracking-widest uppercase">Confirm password</label>
                  <input type={showPwd ? 'text' : 'password'} value={form.confirm} onChange={(e) => set('confirm', e.target.value)} className="input-field" />
                  {!passwordChecks.match && form.confirm !== '' && (
                    <p className="mt-1 text-[11px] text-danger">Passwords do not match</p>
                  )}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold mb-1.5 text-text-2 tracking-widest uppercase">
                    {form.role === 'donor' ? 'Business type' : 'Recipient type'}
                  </label>
                  <select value={form.account_type} onChange={(e) => set('account_type', e.target.value)} className="input-field">
                    {accountTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-1.5 text-text-2 tracking-widest uppercase">Contact phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                    <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 ..." className="input-field pl-10" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold mb-1.5 text-text-2 tracking-widest uppercase">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                    <input value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Street / area" className="input-field pl-10" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold mb-1.5 text-text-2 tracking-widest uppercase">City</label>
                    <input value={form.city} onChange={(e) => set('city', e.target.value)} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold mb-1.5 text-text-2 tracking-widest uppercase">Postal code</label>
                    <input value={form.postal_code} onChange={(e) => set('postal_code', e.target.value)} className="input-field" />
                  </div>
                </div>
                {form.role === 'recipient' && (
                  <div>
                    <label className="block text-[11px] font-bold mb-1.5 text-text-2 tracking-widest uppercase">People you serve (approx.)</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-3" />
                      <input type="number" min={1} value={form.beneficiary_count} onChange={(e) => set('beneficiary_count', e.target.value)} className="input-field pl-10" />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3 bg-panel border border-line rounded-xl p-4">
                <div className="flex items-center gap-2 p-3 rounded-lg bg-elevated text-[12px] text-text-2">
                  <AlertCircle className="w-4 h-4 text-primary-fixed flex-shrink-0" />
                  Our team reviews recipient accounts before donation contact sharing becomes visible.
                </div>
                <SummaryRow label="Role" value={form.role === 'donor' ? 'Donor' : 'Recipient'} />
                <SummaryRow label="Name / Org" value={form.fullName || form.organization || '—'} />
                <SummaryRow label="Email" value={form.email} />
                <SummaryRow label="Phone" value={form.phone} />
                <SummaryRow label="Type" value={accountTypes.find((t) => t.value === form.account_type)?.label ?? form.account_type} />
                <SummaryRow label="City" value={[form.address, form.city, form.postal_code].filter(Boolean).join(', ') || '—'} />
                {form.role === 'recipient' && (
                  <SummaryRow label="People served" value={form.beneficiary_count ? `${form.beneficiary_count}` : '—'} />
                )}
                <p className="text-[11px] text-text-3">Units supported for donations: {Object.keys(UNIT_LABELS).slice(0, 4).join(', ')}…</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep((s) => s - 1)} className="btn-secondary px-4 h-12 rounded-xl flex items-center gap-1.5" disabled={loading}>
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => {
                  if (!canAdvance(step)) {
                    setError('Complete this step to continue')
                    return
                  }
                  setError('')
                  setStep((s) => s + 1)
                }}
                className={`btn-primary flex-1 h-12 rounded-xl flex items-center justify-center gap-1.5 ${!canAdvance(step) ? 'opacity-60' : ''}`}
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={loading}
                className="btn-primary flex-1 h-12 rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Create account</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            )}
          </div>

          <p className="text-center text-[13px] text-text-2">
            Already have an account? <Link to="/login" className="text-primary-fixed font-semibold">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 ${ok ? 'text-secondary' : 'text-text-3'}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${ok ? 'bg-secondary' : 'bg-line'}`} /> {label}
    </span>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-[13px]">
      <span className="text-text-2">{label}</span>
      <span className="text-text font-medium text-right truncate">{value}</span>
    </div>
  )
}
