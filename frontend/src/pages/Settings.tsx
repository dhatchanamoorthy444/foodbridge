import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Bell, Shield, Save, Download, Trash2, Mail, Lock, Eye, EyeOff, ChevronRight, CheckCircle2, AlertCircle, Smartphone, Globe, Building2 } from 'lucide-react'
import useAppStore from '../store/useAppStore'

const C = {
  primary: '#dfff00', primaryContainer: '#0e5c35',
  secondary: '#2bff88', secondaryFixed: '#6ffbbe', onSecondaryFixed: '#002113',
  surface: '#0a0a0a', surfaceLowest: '#141614',
  surfaceContainerLow: '#1b1e1b', surfaceContainer: '#232723',
  surfaceContainerHigh: '#2e322e', surfaceContainerHighest: '#343834',
  onSurface: '#ffffff', onSurfaceVariant: '#9aa39b',
  error: '#ff4d4d', errorContainer: '#3a1414', onErrorContainer: '#ff9d9d',
  tertiaryFixed: '#3a3000', onTertiaryFixed: '#ffd54d',
}

type Tab = 'profile' | 'notifications' | 'privacy'

const TABS: { id: Tab; label: string; Icon: React.FC<any> }[] = [
  { id: 'profile', label: 'Profile', Icon: User },
  { id: 'notifications', label: 'Notifications', Icon: Bell },
  { id: 'privacy', label: 'Privacy & Security', Icon: Shield },
]

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold mb-1"
      style={{ fontFamily: 'Be Vietnam Pro, sans-serif', color: C.onSurface, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      {children}
    </label>
  )
}

function TextField({ label, value, onChange, type = 'text', placeholder, icon: Icon, readOnly }:
  { label: string; value: string; onChange?: (v: string) => void; type?: string; placeholder?: string; icon?: React.FC<any>; readOnly?: boolean }) {
  const [showPwd, setShowPwd] = useState(false)
  const isPwd = type === 'password'
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.onSurfaceVariant }} />}
        <input
          type={isPwd ? (showPwd ? 'text' : 'password') : type}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className="w-full h-11 rounded-xl text-sm outline-none transition-all"
          style={{
            paddingLeft: Icon ? 40 : 14, paddingRight: isPwd ? 40 : 14,
            background: readOnly ? C.surfaceContainerLow : C.surfaceLowest,
            border: `1px solid ${C.surfaceContainerHigh}`,
            color: C.onSurface, fontFamily: 'Rubik, sans-serif',
            cursor: readOnly ? 'default' : 'text',
          }}
        />
        {isPwd && (
          <button type="button" onClick={() => setShowPwd(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: C.onSurfaceVariant }}>
            {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  )
}

function SelectField({ label, value, onChange, options, icon: Icon }:
  { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; icon?: React.FC<any> }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: C.onSurfaceVariant }} />}
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full h-11 rounded-xl text-sm outline-none appearance-none"
          style={{
            paddingLeft: Icon ? 40 : 14, paddingRight: 36,
            background: C.surfaceLowest, border: `1px solid ${C.surfaceContainerHigh}`,
            color: C.onSurface, fontFamily: 'Rubik, sans-serif',
          }}>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rotate-90 pointer-events-none" style={{ color: C.onSurfaceVariant }} />
      </div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
      style={{ background: checked ? C.secondary : C.surfaceContainerHigh }}>
      <motion.div animate={{ x: checked ? 20 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        className="absolute top-1 w-4 h-4 rounded-full shadow"
        style={{ background: checked ? '#fff' : C.onSurfaceVariant }} />
    </button>
  )
}

function NotifRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3" style={{ borderBottom: `1px solid ${C.surfaceContainerHigh}` }}>
      <div className="min-w-0">
        <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 14, fontWeight: 600, color: C.onSurface }}>{label}</p>
        <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: C.onSurfaceVariant }}>{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5 space-y-4 shadow-sm" style={{ background: C.surfaceLowest }}>
      {title && (
        <h3 style={{ fontFamily: 'Rubik, sans-serif', fontSize: 15, fontWeight: 700, color: C.primary }}>{title}</h3>
      )}
      {children}
    </div>
  )
}

// ---------- Profile Tab ----------
function ProfileSection() {
  const { user } = useAppStore()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [organization, setOrganization] = useState(user?.organization || '')
  const [phone, setPhone] = useState('+1 555 000 0000')
  const [timezone, setTimezone] = useState('UTC')
  const [language, setLanguage] = useState('en')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle')

  const handleSave = async () => {
    setSaveStatus('saving')
    await new Promise(r => setTimeout(r, 900))
    setSaveStatus('success')
    setTimeout(() => setSaveStatus('idle'), 3000)
  }

  return (
    <div className="space-y-4">
      {/* Avatar block */}
      <SectionCard>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow"
            style={{ background: C.primaryContainer }}>
            <span style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 26, color: C.secondaryFixed }}>
              {(user?.fullName || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 16, fontWeight: 700, color: C.onSurface }}>{user?.fullName || 'User'}</p>
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, color: C.onSurfaceVariant }}>{user?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: C.secondaryFixed, color: C.onSecondaryFixed, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {user?.role || 'donor'}
            </span>
          </div>
        </div>
      </SectionCard>

      {/* Personal info */}
      <SectionCard title="Personal Information">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField label="Full Name" value={fullName} onChange={setFullName} placeholder="Your name" icon={User} />
          <TextField label="Email Address" value={user?.email || ''} type="email" placeholder="you@example.com" icon={Mail} readOnly />
          <TextField label="Organisation" value={organization} onChange={setOrganization} placeholder="e.g. Green Leaf Bakery" icon={Building2} />
          <TextField label="Phone Number" value={phone} onChange={setPhone} type="tel" placeholder="+1 555 000 0000" icon={Smartphone} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SelectField label="Timezone" value={timezone} onChange={setTimezone} icon={Globe}
            options={[
              { value: 'UTC', label: 'UTC — Universal Time' },
              { value: 'EST', label: 'EST — Eastern Time' },
              { value: 'PST', label: 'PST — Pacific Time' },
              { value: 'IST', label: 'IST — India Standard Time' },
              { value: 'CET', label: 'CET — Central European Time' },
            ]} />
          <SelectField label="Language" value={language} onChange={setLanguage} icon={Globe}
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Spanish' },
              { value: 'fr', label: 'French' },
              { value: 'de', label: 'German' },
              { value: 'ta', label: 'Tamil' },
            ]} />
        </div>
      </SectionCard>

      {/* Save button */}
      <div className="flex items-center justify-end">
        <button onClick={handleSave} disabled={saveStatus === 'saving'}
          className="h-11 px-6 rounded-xl font-semibold flex items-center gap-2 transition-all active:scale-[0.98] shadow-sm disabled:opacity-60"
          style={{ background: C.primary, color: '#0a0a0a', fontFamily: 'Rubik, sans-serif', fontSize: 14 }}>
          {saveStatus === 'saving' ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
          ) : saveStatus === 'success' ? (
            <><CheckCircle2 className="w-4 h-4" /> Saved!</>
          ) : (
            <><Save className="w-4 h-4" /> Save Changes</>
          )}
        </button>
      </div>

      {/* Change password */}
      <SectionCard title="Change Password">
        <div className="space-y-3">
          <TextField label="Current Password" value="" type="password" placeholder="••••••••" icon={Lock} />
          <TextField label="New Password" value="" type="password" placeholder="Min. 8 characters" icon={Lock} />
          <TextField label="Confirm New Password" value="" type="password" placeholder="Repeat new password" icon={Lock} />
        </div>
        <button className="h-10 px-5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]"
          style={{ background: C.surfaceContainerHigh, color: C.primary, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
          Update Password
        </button>
      </SectionCard>
    </div>
  )
}

// ---------- Notifications Tab ----------
function NotificationsSection() {
  const [notifs, setNotifs] = useState({
    urgentExpiry: true,
    newRequests: true,
    pickupUpdates: true,
    weeklyReport: false,
    systemAlerts: true,
    marketingEmails: false,
  })

  const set = (k: keyof typeof notifs) => (v: boolean) => setNotifs(n => ({ ...n, [k]: v }))

  return (
    <div className="space-y-4">
      <SectionCard title="Email Notifications">
        <NotifRow label="Urgent Expiry Alerts" desc="Items expiring within 24 hours" checked={notifs.urgentExpiry} onChange={set('urgentExpiry')} />
        <NotifRow label="New Surplus Requests" desc="When NGOs request your food batches" checked={notifs.newRequests} onChange={set('newRequests')} />
        <NotifRow label="Pickup Status Updates" desc="Real-time pickup progress notifications" checked={notifs.pickupUpdates} onChange={set('pickupUpdates')} />
        <NotifRow label="Weekly Impact Report" desc="Summary of your monthly contributions" checked={notifs.weeklyReport} onChange={set('weeklyReport')} />
        <div className="flex items-center justify-between gap-4 py-3">
          <div>
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 14, fontWeight: 600, color: C.onSurface }}>System Announcements</p>
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: C.onSurfaceVariant }}>Platform updates and maintenance windows</p>
          </div>
          <Toggle checked={notifs.systemAlerts} onChange={set('systemAlerts')} />
        </div>
      </SectionCard>

      <SectionCard title="Marketing">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 14, fontWeight: 600, color: C.onSurface }}>Product Updates & News</p>
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: C.onSurfaceVariant }}>Occasional emails about new features</p>
          </div>
          <Toggle checked={notifs.marketingEmails} onChange={set('marketingEmails')} />
        </div>
      </SectionCard>

      <SectionCard>
        <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: C.surfaceContainerLow }}>
          <Bell className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: C.secondary }} />
          <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, color: C.onSurfaceVariant, lineHeight: '20px' }}>
            Urgent expiry alerts are sent immediately regardless of quiet hours. All other notifications respect your timezone settings.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}

// ---------- Privacy & Security Tab ----------
function PrivacySection() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [exportDone, setExportDone] = useState(false)

  const handleExport = async () => {
    setExportLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setExportLoading(false)
    setExportDone(true)
    setTimeout(() => setExportDone(false), 4000)
  }

  return (
    <div className="space-y-4">
      {/* Data rights */}
      <SectionCard title="Data Rights">
        <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, color: C.onSurfaceVariant, lineHeight: '20px' }}>
          Under GDPR and applicable data protection laws, you have the right to access, correct, and delete your personal data at any time.
        </p>
        <div className="space-y-2 pt-1">
          {/* Export data */}
          <button onClick={handleExport} disabled={exportLoading}
            className="w-full flex items-center justify-between p-3.5 rounded-xl transition-all active:scale-[0.99] disabled:opacity-60"
            style={{ background: C.surfaceContainerLow, border: `1px solid ${C.surfaceContainerHigh}` }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: C.secondaryFixed }}>
                {exportDone ? <CheckCircle2 className="w-4 h-4" style={{ color: C.onSecondaryFixed }} />
                  : exportLoading ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" style={{ color: C.onSecondaryFixed }} />
                  : <Download className="w-4 h-4" style={{ color: C.onSecondaryFixed }} />}
              </div>
              <div className="text-left">
                <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 14, fontWeight: 600, color: C.onSurface }}>
                  {exportDone ? 'Export Ready!' : 'Export My Data'}
                </p>
                <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: C.onSurfaceVariant }}>Download all account data as JSON</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: C.onSurfaceVariant }} />
          </button>

          {/* Unsubscribe */}
          <button className="w-full flex items-center justify-between p-3.5 rounded-xl transition-all active:scale-[0.99]"
            style={{ background: C.surfaceContainerLow, border: `1px solid ${C.surfaceContainerHigh}` }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: C.tertiaryFixed }}>
                <Mail className="w-4 h-4" style={{ color: C.onTertiaryFixed }} />
              </div>
              <div className="text-left">
                <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 14, fontWeight: 600, color: C.onSurface }}>Unsubscribe from All Emails</p>
                <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: C.onSurfaceVariant }}>Stop all non-essential email communications</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: C.onSurfaceVariant }} />
          </button>
        </div>
      </SectionCard>

      {/* Security */}
      <SectionCard title="Session & Security">
        <div className="flex items-center justify-between gap-4 py-1">
          <div>
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 14, fontWeight: 600, color: C.onSurface }}>Two-Factor Authentication</p>
            <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: C.onSurfaceVariant }}>Add an extra layer of security to your account</p>
          </div>
          <button className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
            style={{ background: C.secondaryFixed, color: C.onSecondaryFixed, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }}>
            ENABLE
          </button>
        </div>
        <div style={{ borderTop: `1px solid ${C.surfaceContainerHigh}` }} className="pt-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.surfaceContainerHigh }}>
              <Shield className="w-4 h-4" style={{ color: C.secondary }} />
            </div>
            <div>
              <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 13, fontWeight: 600, color: C.onSurface }}>Active Sessions</p>
              <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: C.onSurfaceVariant }}>1 active session · Chrome on Windows</p>
            </div>
            <button className="ml-auto text-xs font-semibold flex-shrink-0"
              style={{ color: C.error, fontFamily: 'Be Vietnam Pro, sans-serif' }}>
              Sign Out All
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Delete account */}
      <SectionCard title="Danger Zone">
        <div className="rounded-xl p-4" style={{ background: C.errorContainer }}>
          <div className="flex items-start gap-3 mb-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: C.onErrorContainer }} />
            <div>
              <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 14, fontWeight: 700, color: C.onErrorContainer }}>Delete Account</p>
              <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, color: C.onErrorContainer, lineHeight: '18px', marginTop: 2 }}>
                This permanently deletes your account, all donation records, and impact history. This action cannot be undone.
              </p>
            </div>
          </div>
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)}
              className="w-full h-10 rounded-lg text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              style={{ background: C.error, color: 'white', fontFamily: 'Rubik, sans-serif' }}>
              <Trash2 className="w-4 h-4" /> Delete My Account
            </button>
          ) : (
            <div className="space-y-2">
              <p style={{ fontFamily: 'Rubik, sans-serif', fontSize: 12, fontWeight: 600, color: C.onErrorContainer }}>Are you absolutely sure?</p>
              <div className="flex gap-2">
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 h-10 rounded-lg text-sm font-semibold transition-all active:scale-95"
                  style={{ background: C.surfaceLowest, color: C.onSurface, fontFamily: 'Rubik, sans-serif' }}>
                  Cancel
                </button>
                <button className="flex-1 h-10 rounded-lg text-sm font-semibold transition-all active:scale-95"
                  style={{ background: C.error, color: 'white', fontFamily: 'Rubik, sans-serif' }}>
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  )
}

// ---------- Main component ----------
export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  return (
    <div className="space-y-5 pt-4 pb-10 animate-fade-in">
      {/* Header */}
      <div>
        <span style={{ fontFamily: 'Be Vietnam Pro, sans-serif', fontSize: 10, fontWeight: 700, color: C.secondary, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Account Management
        </span>
        <h1 style={{ fontFamily: 'Anton, Impact, sans-serif', fontSize: 28, lineHeight: '34px', letterSpacing: '-0.01em', color: C.primary }}>
          Settings
        </h1>
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold transition-all active:scale-95"
            style={activeTab === id
              ? { background: C.primaryContainer, color: 'white', fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }
              : { background: C.surfaceContainer, color: C.onSurfaceVariant, fontFamily: 'Be Vietnam Pro, sans-serif', letterSpacing: '0.04em' }
            }>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}>
          {activeTab === 'profile' && <ProfileSection />}
          {activeTab === 'notifications' && <NotificationsSection />}
          {activeTab === 'privacy' && <PrivacySection />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
