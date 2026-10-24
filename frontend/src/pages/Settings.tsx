import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Moon, Sun, Monitor, Languages, Save, Download, Upload } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import useAppStore from '../store/useAppStore'

export default function Settings() {
  const { user, theme, setTheme, animationsEnabled, setAnimationsEnabled } = useAppStore()
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance' | 'privacy' | 'integrations'>('profile')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  // Form state
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [organization, setOrganization] = useState(user?.organization || '')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [timezone, setTimezone] = useState('UTC')
  const [language, setLanguage] = useState('en')

  const handleSaveProfile = async () => {
    setSaveStatus('saving')
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Bell },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">
          Manage your account preferences and application settings
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <Card className="lg:w-64 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </Card>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-white mb-6">Profile Information</h3>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Organization</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="input-label">Timezone</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="input-field">
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                    <option value="CET">Central European Time</option>
                  </select>
                </div>
                <div>
                  <label className="input-label">Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input-field">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={saveStatus === 'saving'}
                  className="btn-primary"
                >
                  {saveStatus === 'saving' ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </span>
                  ) : saveStatus === 'success' ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                      </svg>
                      Saved!
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-white mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-surface-border">
                  <div>
                    <h4 className="font-medium text-white">Email Notifications</h4>
                    <p className="text-sm text-slate-400">Receive email updates about your donations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only" />
                    <div className="w-11 h-6 bg-surface-elevated rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:border after:border-surface-border checked:bg-primary-500 checked:after:translate-x-5"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-surface-border">
                  <div>
                    <h4 className="font-medium text-white">Push Notifications</h4>
                    <p className="text-sm text-slate-400">Get instant notifications in the app</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only" />
                    <div className="w-11 h-6 bg-surface-elevated rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:border after:border-surface-border checked:bg-primary-500 checked:after:translate-x-5"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-surface-border">
                  <div>
                    <h4 className="font-medium text-white">SMS Notifications</h4>
                    <p className="text-sm text-slate-400">Receive SMS for pickup confirmations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-11 h-6 bg-surface-elevated rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:border after:border-surface-border"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-surface-border">
                  <div>
                    <h4 className="font-medium text-white">Expiry Alerts</h4>
                    <p className="text-sm text-slate-400">Get notified about expiring food items</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only" />
                    <div className="w-11 h-6 bg-surface-elevated rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:border after:border-surface-border checked:bg-primary-500 checked:after:translate-x-5"></div>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-white mb-4">Appearance Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`p-4 rounded-lg border transition-all ${
                        theme === 'dark'
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-surface-border hover:border-slate-500'
                      }`}
                    >
                      <Moon className="w-5 h-5 mx-auto mb-2" />
                      <span className="text-sm font-medium">Dark</span>
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`p-4 rounded-lg border transition-all ${
                        theme === 'light'
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-surface-border hover:border-slate-500'
                      }`}
                    >
                      <Sun className="w-5 h-5 mx-auto mb-2" />
                      <span className="text-sm font-medium">Light</span>
                    </button>
                    <button
                      onClick={() => setTheme('system')}
                      className={`p-4 rounded-lg border transition-all ${
                        theme === 'system'
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-surface-border hover:border-slate-500'
                      }`}
                    >
                      <Monitor className="w-5 h-5 mx-auto mb-2" />
                      <span className="text-sm font-medium">System</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-surface-border">
                  <div>
                    <h4 className="font-medium text-white">Enable Animations</h4>
                    <p className="text-sm text-slate-400">Toggle all UI animations and transitions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={animationsEnabled}
                      onChange={(e) => setAnimationsEnabled(e.target.checked)}
                      className="sr-only"
                    />
                    <div className="w-11 h-6 bg-surface-elevated rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:border after:border-surface-border checked:bg-primary-500 checked:after:translate-x-5"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between py-3 border-t border-surface-border">
                  <div>
                    <h4 className="font-medium text-white">Reduced Motion</h4>
                    <p className="text-sm text-slate-400">Minimize animations for accessibility</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-11 h-6 bg-surface-elevated rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:border after:border-surface-border checked:bg-primary-500 checked:after:translate-x-5"></div>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'privacy' && (
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-white mb-4">Privacy & Security</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-surface-elevated border border-surface-border">
                  <h4 className="font-medium text-white mb-2">Password</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">••••••••••</span>
                    <button className="text-sm text-primary-400 hover:text-primary-300">Change</button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-surface-elevated border border-surface-border">
                  <h4 className="font-medium text-white mb-2">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between">
                    <span classClassName="text-sm text-slate-400">Enabled</span>
                    <button className="text-sm text-danger-400 hover:text-danger-300">Disable</button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-surface-elevated border border-surface-border">
                  <h4 className="font-medium text-white mb-2">Session Management</h4>
                  <p className="text-sm text-slate-400 mb-3">Active sessions on 2 devices</p>
                  <button className="text-sm text-danger-400 hover:text-danger-300">Logout All Devices</button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'integrations' && (
            <Card className="p-6">
              <h3 className="font-semibold text-lg text-white mb-4">Connected Services</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-elevated border border-surface-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 font-bold">G</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Google Drive</h4>
                      <p className="text-sm text-slate-400">Connected</p>
                    </div>
                  </div>
                  <button className="text-sm text-danger-400 hover:text-danger-300">Disconnect</button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-elevated border border-surface-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 font-bold">M</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Microsoft Azure</h4>
                      <p className="text-sm text-slate-400">Connected</p>
                    </div>
                  </div>
                  <button className="text-sm text-danger-400 hover:text-danger-300">Disconnect</button>
                </div>

                <button className="w-full p-4 rounded-lg border border-dashed border-surface-border hover:border-primary-500/30 transition-colors text-slate-400 hover:text-slate-200">
                  <span className="flex items-center justify-center gap-2">
                    <Plus className="w-5 h-5" /> Add New Integration
                  </span>
                </button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}