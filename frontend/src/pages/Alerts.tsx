import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { AlarmClock, Plus, X, RefreshCw, Loader2, ChevronDown, Megaphone, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { toastApiError, alertsService } from '../services/api'
import { EmptyState, ErrorState, SkeletonList } from '../components/ui/Feedback'
import { UNIT_LABELS, UNITS, FOOD_CATEGORIES, CATEGORY_LABELS, EmergencyAlert } from '../types/api'
import { formatDateTime, cn } from '../lib/utils'
import useAppStore from '../store/useAppStore'

const ALERT_STATUS_STYLE: Record<string, string> = {
  open: 'bg-tertiary-container text-tertiary',
  partially_fulfilled: 'bg-secondary-container text-secondary',
  fulfilled: 'bg-primary-container text-on-primary-container',
  cancelled: 'bg-danger-soft text-danger',
  expired: 'bg-elevated text-text-2',
}

export default function Alerts() {
  const user = useAppStore((s) => s.user)
  const queryClient = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)

  const isDonor = user?.role === 'donor'
  const query = useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertsService.list(),
    enabled: !!user,
    refetchInterval: 20000,
  })
  const alerts = query.data ?? []

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['alerts'] })
    queryClient.invalidateQueries({ queryKey: ['alert-detail'] })
  }

  const donorRespond = async (a: EmergencyAlert) => {
    const foodName = window.prompt('What food can you offer? (e.g. Cooked rice meals)')
    if (!foodName || foodName.trim().length < 2) return
    const raw = window.prompt(
      `Quantity for "${foodName}" â€” this alert still needs ${Math.max(a.required_quantity - a.fulfilled_quantity, 0)} ${a.unit}`
    )
    if (!raw) return
    const qty = Number(raw)
    if (!qty || qty <= 0) return toast.error('Quantity must be greater than zero')
    setBusy(a.id)
    try {
      await alertsService.respond({
        alert_id: a.id,
        food_name: foodName.trim(),
        offered_quantity: qty,
      })
      toast.success('Response sent to the recipient')
      refresh()
    } catch (err) {
      toastApiError(err, 'Response failed')
    } finally {
      setBusy(null)
    }
  }

  const recipientDecide = async (rid: string, accept: boolean, alertId: string) => {
    setBusy(rid)
    try {
      await alertsService.decideResponse(rid, accept ? 'accept' : 'decline')
      toast.success(accept ? 'Response accepted â€” allocation created' : 'Response declined')
      refresh()
    } catch (err) {
      toastApiError(err, 'Decision failed')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-text tracking-tight">Emergency Food Alerts</h1>
          <p className="text-[13px] text-text-2">{isDonor ? 'Urgent needs you can fulfil right now' : 'Broadcast urgent food needs to nearby donors'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => query.refetch()} className="btn-secondary rounded-lg p-2" aria-label="Refresh">
            <RefreshCw className={cn('h-4 w-4', query.isFetching && 'animate-spin')} />
          </button>
          {!isDonor && (
            <button onClick={() => setShowCreate(true)} className="btn-primary rounded-lg px-3 py-2 text-[12px] flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" /> New alert
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {query.isLoading ? (
          <SkeletonList count={3} />
        ) : query.isError ? (
          <ErrorState message="Could not load alerts" onRetry={() => query.refetch()} />
        ) : alerts.length === 0 ? (
          <EmptyState
            icon={<AlarmClock className="h-6 w-6" />}
            title="No active alerts"
            message={isDonor
              ? 'When recipients raise urgent food needs, they appear here instantly via realtime sync.'
              : 'Create an alert when your community runs out of food â€” nearby donors are notified instantly.'}
          />
        ) : (
          alerts.map((a) => {
            const remaining = Math.max(a.required_quantity - a.fulfilled_quantity, 0)
            const isMine = user && a.recipient_id === user.id
            return (
              <div key={a.id} className="rounded-xl border border-line bg-panel p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[14px] font-semibold text-text">
                      <AlarmClock className="h-4 w-4 text-danger flex-shrink-0" /> {a.food_name}
                    </p>
                    <p className="mt-0.5 text-[12px] text-text-2">
                      {CATEGORY_LABELS[a.food_category] ?? a.food_category} Â· needs {remaining} of {a.required_quantity} {UNIT_LABELS[a.unit]?.toLowerCase() ?? a.unit} Â· by {formatDateTime(a.required_by)}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider', ALERT_STATUS_STYLE[a.status])}>
                      {a.status.replace('_', ' ')}
                    </span>
                    {isMine && (
                      <button onClick={() => setExpanded(expanded === a.id ? null : a.id)} className="text-text-3 hover:text-text" aria-label="Toggle responses">
                        <ChevronDown className={cn('h-4 w-4 transition-transform', expanded === a.id && 'rotate-180')} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-2 text-[12px] text-text-3">{a.reason}</p>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-text-3">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {a.emergency_location}{a.area ? `, ${a.area}` : ''} Â· {a.city}</span>
                  {a.people_to_feed ? <span>~{a.people_to_feed} people affected</span> : null}
                  <span className="flex items-center gap-1"><Megaphone className="h-3 w-3" /> {isMine ? 'your alert' : (a.recipient_org_name || 'verified recipient')}</span>
                </div>
                {a.additional_requirements && (
                  <p className="mt-1.5 text-[11px] text-text-3">Additional needs: {a.additional_requirements}</p>
                )}

                {/* Donor action */}
                {isDonor && ['open', 'partially_fulfilled'].includes(a.status) && !isExpired(a) && (
                  <button onClick={() => donorRespond(a)} disabled={busy === a.id} className="btn-primary mt-3 rounded-lg px-4 py-2 text-[12px] flex items-center gap-1.5">
                    {busy === a.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                    Offer food
                  </button>
                )}

                {/* Recipient responses panel */}
                {isMine && expanded === a.id && (
                  <AlertResponses alertId={a.id} onDecide={recipientDecide} busy={busy} />
                )}
              </div>
            )
          })
        )}
      </div>

      {showCreate && <CreateModal onClose={() => setShowCreate(false)} onCreated={refresh} />}
    </div>
  )
}

function isExpired(a: EmergencyAlert) {
  return new Date(a.required_by).getTime() < Date.now()
}

function AlertResponses({ alertId, onDecide, busy }: {
  alertId: string
  busy: string | null
  onDecide: (rid: string, accept: boolean, alertId: string) => void
}) {
  const detailQuery = useQuery({
    queryKey: ['alert-detail', alertId],
    queryFn: () => alertsService.byId(alertId),
  })
  const responses = detailQuery.data?.responses ?? []
  const contact = detailQuery.data?.contacts

  if (detailQuery.isLoading) return <div className="mt-3"><SkeletonList count={1} /></div>
  if (detailQuery.isError) return <p className="mt-3 text-[12px] text-danger">Could not load responses for this alert.</p>
  if (responses.length === 0) return <p className="mt-3 text-[12px] text-text-3">No donor responses yet.</p>

  return (
    <div className="mt-3 space-y-2">
      {contact && (
        <p className="text-[11px] text-text-3">Alert contact â†’ {contact.contact_phone}{contact.contact_name ? ` (${contact.contact_name})` : ''}</p>
      )}
      {responses.map((r) => (
        <div key={r.id} className="flex items-center justify-between gap-2 rounded-lg bg-elevated px-3 py-2">
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-text">
              {r.food_name} â€” {r.offered_quantity} {UNIT_LABELS[r.unit]?.toLowerCase() ?? r.unit}
              {r.message ? <span className="ml-1 text-text-3">Â· "{r.message}"</span> : null}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-text-3">{r.status}</p>
          </div>
          {r.status === 'pending' ? (
            <div className="flex flex-shrink-0 gap-1.5">
              <button onClick={() => onDecide(r.id, true, alertId)} disabled={busy === r.id} className="btn-primary rounded-md px-2.5 py-1 text-[11px]">Accept</button>
              <button onClick={() => onDecide(r.id, false, alertId)} disabled={busy === r.id} className="rounded-md bg-danger-soft px-2.5 py-1 text-[11px] font-semibold text-danger">Decline</button>
            </div>
          ) : (
            <span className={cn('flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
              r.status === 'accepted' ? 'bg-primary-container text-on-primary-container' : 'bg-danger-soft text-danger')}>
              {r.status.replace('_', ' ')}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

function CreateModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const user = useAppStore((s) => s.user)
  const [form, setForm] = useState({
    food_name: '',
    food_category: 'prepared_food',
    required_quantity: '',
    unit: 'meals',
    people_to_feed: '',
    required_by: '',
    emergency_location: '',
    area: '',
    city: user?.city?.trim() || '',
    reason: '',
    additional_requirements: '',
    contact_name: user?.full_name?.trim() || '',
    contact_phone: user?.phone?.trim() || '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.food_name.trim().length < 2) return setError('Food name is required (min 2 characters)')
    const qty = Number(form.required_quantity)
    if (!qty || qty <= 0) return setError('Required quantity must be greater than zero')
    if (!form.required_by) return setError('Needed-by date/time is required')
    if (new Date(form.required_by).getTime() <= Date.now()) return setError('Needed-by must be in the future')
    if (form.emergency_location.trim().length < 2) return setError('Emergency location is required')
    if (form.city.trim().length < 2) return setError('City is required')
    if (form.reason.trim().length < 10) return setError('Please describe the reason (min 10 characters)')

    setSubmitting(true)
    setError('')
    try {
      await alertsService.create({
        food_name: form.food_name.trim(),
        food_category: form.food_category,
        required_quantity: qty,
        unit: form.unit,
        people_to_feed: form.people_to_feed ? Number(form.people_to_feed) : undefined,
        required_by: new Date(form.required_by).toISOString(),
        emergency_location: form.emergency_location.trim(),
        area: form.area.trim() || undefined,
        city: form.city.trim(),
        reason: form.reason.trim(),
        additional_requirements: form.additional_requirements.trim() || undefined,
        contact_name: form.contact_name.trim() || user?.full_name?.trim() || 'Staff',
        contact_phone: form.contact_phone.trim() || user?.phone?.trim() || '0000000000',
      })
      toast.success('Emergency alert broadcast')
      onCreated()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create alert')
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-app-deep/70 md:items-center p-0 md:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <form onSubmit={submit} className="w-full max-w-lg max-h-[88vh] overflow-y-auto rounded-t-2xl md:rounded-2xl border border-line bg-panel p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-xl text-text">New emergency alert</h2>
            <p className="mt-0.5 text-[12px] text-text-3">Broadcast a verified urgent food need</p>
          </div>
          <button type="button" onClick={onClose} className="text-text-3 hover:text-text" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>

        {error && <div className="mt-3 rounded-lg bg-danger-soft px-3 py-2 text-[12px] text-danger">{error}</div>}

        <div className="mt-4 space-y-3">
          <Wrap label="Food needed">
            <input value={form.food_name} onChange={(e) => set('food_name', e.target.value)} placeholder="e.g. Cooked meals, rice" className="input-field" required />
          </Wrap>
          <div className="grid grid-cols-2 gap-3">
            <Wrap label="Category">
              <select value={form.food_category} onChange={(e) => set('food_category', e.target.value)} className="input-field">
                {FOOD_CATEGORIES.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
              </select>
            </Wrap>
            <Wrap label="Unit">
              <select value={form.unit} onChange={(e) => set('unit', e.target.value)} className="input-field">
                {UNITS.map((u) => <option key={u} value={u}>{UNIT_LABELS[u]}</option>)}
              </select>
            </Wrap>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Wrap label="Quantity required">
              <input type="number" min={0} step="0.01" value={form.required_quantity} onChange={(e) => set('required_quantity', e.target.value)} className="input-field" required />
            </Wrap>
            <Wrap label="People to feed">
              <input type="number" min={1} value={form.people_to_feed} onChange={(e) => set('people_to_feed', e.target.value)} className="input-field" placeholder="optional" />
            </Wrap>
          </div>
          <Wrap label="Needed by">
            <input type="datetime-local" value={form.required_by} onChange={(e) => set('required_by', e.target.value)} className="input-field" required />
          </Wrap>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="md:col-span-2">
              <Wrap label="Emergency location">
                <input value={form.emergency_location} onChange={(e) => set('emergency_location', e.target.value)} placeholder="e.g. Night shelter main gate" className="input-field" required />
              </Wrap>
            </div>
            <Wrap label="Area">
              <input value={form.area} onChange={(e) => set('area', e.target.value)} className="input-field" placeholder="optional" />
            </Wrap>
          </div>
          <Wrap label="City">
            <input value={form.city} onChange={(e) => set('city', e.target.value)} className="input-field" required />
          </Wrap>
          <Wrap label="Reason for the alert">
            <textarea value={form.reason} onChange={(e) => set('reason', e.target.value)} rows={2} className="input-field resize-none" placeholder="e.g. 60 children at our shelter have had no dinner for two days" required />
          </Wrap>
          <Wrap label="Additional requirements">
            <input value={form.additional_requirements} onChange={(e) => set('additional_requirements', e.target.value)} className="input-field" placeholder="e.g. vegetarian only â€” optional" />
          </Wrap>
          <div className="grid grid-cols-2 gap-3">
            <Wrap label="Contact person">
              <input value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} className="input-field" required />
            </Wrap>
            <Wrap label="Contact phone">
              <input value={form.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} className="input-field" required />
            </Wrap>
          </div>
          <p className="text-[11px] text-text-3">Contact details stay private â€” donors see them only after you accept their responses.</p>
        </div>

        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 rounded-xl py-3 text-[13px]">Cancel</button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1 rounded-xl py-3 text-[13px] flex items-center justify-center gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Broadcast alert
          </button>
        </div>
      </form>
    </div>
  )
}

function Wrap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-text-3">{label}</label>
      {children}
    </div>
  )
}
