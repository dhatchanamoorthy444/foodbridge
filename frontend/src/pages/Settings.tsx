import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Shield, Mail, Building2, Smartphone, MapPin, Globe, Lock, Inbox } from 'lucide-react'
import toast from 'react-hot-toast'
import useAppStore from '../store/useAppStore'
import { authService } from '../services/api'
import { RECIPIENT_ACCOUNT_TYPES, DONOR_ACCOUNT_TYPES } from '../types/api'
import { cn } from '../lib/utils'

interface ProfileForm {
  full_name: string
  organization: string
  phone: string
  address: string
  city: string
  account_type: string
}

type Tab = 'profile' | 'security'
const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
]

export default function Settings() {
  const user = useAppStore((s) => s.user)
  const setUser = useAppStore((s) => s.setUser)
  const [tab, setTab] = useState<Tab>('profile')
  const isRecipient = user?.role === 'recipient'
  const types = isRecipient ? RECIPIENT_ACCOUNT_TYPES : DONOR_ACCOUNT_TYPES

  const [form, setForm] = useState<ProfileForm>({
    full_name: user?.full_name || '',
    organization: user?.organization || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    account_type: user?.account_type || '',
  } as ProfileForm)
  const [saving, setSaving] = useState(false)
  const [pwd, setPwd] = useState({ next: '', confirm: '' })
  const [changingPwd, setChangingPwd] = useState(false)

  const set = <K extends keyof ProfileForm>(k: K, v: ProfileForm[K]) => setForm((f) => ({ ...f, [k]: v }))

  const saveProfile = async () => {
    setSaving(true)
    try {
      const patch: Record<string, string> = {}
      for (const k of Object.keys(form) as (keyof ProfileForm)[]) {
        const v = form[k]
        if (v && v.trim() && v.trim() !== (user?.[k] ?? '')) patch[k] = v.trim()
      }
      if (Object.keys(patch).length === 0) {
        toast('Nothing to update')
        return
      }
      const updated = await authService.updateProfile(patch)
      if (updated) setUser({ ...(user as NonNullable<typeof user>), ...updated })
      toast.success('Profile saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    if (pwd.next.length < 8) return toast.error('Password must be at least 8 characters')
    if (pwd.next !== pwd.confirm) return toast.error('Passwords do not match')
    setChangingPwd(true)
    try {
      await authService.updatePassword(pwd.next)
      toast.success('Password updated')
      setPwd({ next: '', confirm: '' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setChangingPwd(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl pb-10">
      <h1 className="font-display text-2xl text-text tracking-tight">Settings</h1>
      <p className="text-[13px] text-text-2">Identity, contact details and account security</p>

      {/* Tabs */}
      <div className="mt-4 flex gap-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)} className={cn(
            'flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-widest',
            tab === id ? 'bg-primary-container text-on-primary-container' : 'bg-elevated text-text-3 hover:text-text'
          )}>
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
          {tab === 'profile' && (
            <div className="mt-4 space-y-4">
              {/* identity card */}
              <div className="rounded-xl border border-line bg-panel p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container">
                    <span className="font-display text-xl text-on-primary-container">
                      {(user?.full_name || user?.email || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-semibold text-text">{user?.full_name || user?.organization || 'Member'}</p>
                    <p className="truncate text-[12px] text-text-2">{user?.email}</p>
                    <span className="mt-1 inline-block rounded-full bg-elevated px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-text-2">
                      {user?.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* editable profile */}
              <div className="rounded-xl border border-line bg-panel p-4">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-text-2">Details</h2>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field icon={<User className="h-4 w-4" />} label="Full name">
                    <input value={form.full_name} onChange={(e) => set('full_name', e.target.value)} className="input-field" placeholder="Your name" />
                  </Field>
                  <Field icon={<Mail className="h-4 w-4" />} label="Email">
                    <input value={user?.email || ''} readOnly className="input-field opacity-60 cursor-default" />
                  </Field>
                  <div className="md:col-span-2">
                    <Field icon={<Building2 className="h-4 w-4" />} label="Organisation">
                      <input value={form.organization} onChange={(e) => set('organization', e.target.value)} className="input-field" placeholder="e.g. Green Leaf Bakery" />
                    </Field>
                  </div>
                  <Field icon={<Smartphone className="h-4 w-4" />} label="Phone">
                    <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className="input-field" placeholder="+91 …" />
                  </Field>
                  <Field icon={<Inbox className="h-4 w-4" />} label={isRecipient ? 'Organisation type' : 'Business type'}>
                    <select value={form.account_type} onChange={(e) => set('account_type', e.target.value)} className="input-field">
                      <option value="">Select…</option>
                      {types.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </Field>
                  <div className="md:col-span-2">
                    <Field icon={<MapPin className="h-4 w-4" />} label="Address">
                      <input value={form.address} onChange={(e) => set('address', e.target.value)} className="input-field" placeholder="Street / location" />
                    </Field>
                  </div>
                  <Field icon={<Globe className="h-4 w-4" />} label="City">
                    <input value={form.city} onChange={(e) => set('city', e.target.value)} className="input-field" />
                  </Field>
                </div>
                <button onClick={saveProfile} disabled={saving} className="btn-primary mt-4 rounded-lg px-5 py-2.5 text-[13px] disabled:opacity-60">
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
              </div>
            </div>
          )}

          {tab === 'security' && (
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-line bg-panel p-4">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-text-2">Change password</h2>
                <p className="mt-1 text-[12px] text-text-3">Applies to your Supabase-verified sign-in.</p>
                <div className="mt-3 space-y-3">
                  <Field icon={<Lock className="h-4 w-4" />} label="New password">
                    <input type="password" value={pwd.next} onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))} className="input-field" placeholder="Min. 8 characters" autoComplete="new-password" />
                  </Field>
                  <Field icon={<Lock className="h-4 w-4" />} label="Confirm password">
                    <input type="password" value={pwd.confirm} onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))} className="input-field" autoComplete="new-password" />
                  </Field>
                </div>
                <button onClick={changePassword} disabled={changingPwd} className="btn-secondary mt-3 rounded-lg px-5 py-2.5 text-[13px] disabled:opacity-60">
                  {changingPwd ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-text-3">{label}</label>
      {children}
    </div>
  )
}
