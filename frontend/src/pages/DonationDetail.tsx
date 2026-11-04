import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ArrowLeft, MapPin, Package, Clock, Snowflake, Phone, User as UserIcon, Loader2, BadgeCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { donationsService, requestsService } from '../services/api'
import { EmptyState, ErrorState, SkeletonCard, ExpiryBadge } from '../components/ui/Feedback'
import { storagePublicUrl } from '../lib/supabase'
import { CATEGORY_LABELS, UNIT_LABELS, UNITS } from '../types/api'
import useAppStore from '../store/useAppStore'
import { formatDateTime } from '../lib/utils'
import { StatusChip } from './DonorDashboard'

export default function DonationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAppStore((s) => s.user)
  const isRecipient = user?.role === 'recipient'

  const donationQuery = useQuery({
    queryKey: ['donation', id],
    queryFn: () => donationsService.byId(id!),
  })
  const donation = donationQuery.data
  const imageUrl = storagePublicUrl(donation?.image_path)

  const [showRequest, setShowRequest] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('kg')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [address, setAddress] = useState('')
  const [people, setPeople] = useState('')
  const [preferredTime, setPreferredTime] = useState('')
  const [instructions, setInstructions] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const expired = donation?.expires_at ? new Date(donation.expires_at).getTime() < Date.now() : false
  const claimable = donation && !expired && donation.available_quantity > 0 && (donation.status === 'available' || donation.status === 'partially_fulfilled')

  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!donation) return
    const qty = Number(quantity)
    if (!qty || qty <= 0) return toast.error('Enter a quantity greater than zero')
    if (qty > donation.available_quantity) {
      return toast.error(`Only ${donation.available_quantity} ${donation.unit} available`)
    }
    if (contactName.trim().length < 2) return toast.error('Contact name required')
    if (contactPhone.trim().length < 6) return toast.error('Contact phone required')
    if (address.trim().length < 4) return toast.error('Pickup / delivery address required')
    setSubmitting(true)
    try {
      await requestsService.create({
        donation_id: donation.id,
        requested_quantity: qty,
        unit,
        contact_name: contactName.trim(),
        contact_phone: contactPhone.trim(),
        pickup_address: address.trim(),
        people_to_feed: people ? Number(people) : undefined,
        preferred_time: preferredTime ? new Date(preferredTime).toISOString() : undefined,
        instructions: instructions.trim() || undefined,
      })
      toast.success('Request sent to the donor')
      setShowRequest(false)
      navigate('/my-requests')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl pb-10">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-[13px] text-text-2 hover:text-text">
        <ArrowLeft className="h-4 w-4" /> Back to browse
      </button>

      {donationQuery.isLoading ? (
        <SkeletonCard lines={5} />
      ) : donationQuery.isError || !donation ? (
        <ErrorState message="This donation is no longer available" onRetry={donationQuery.refetch} />
      ) : (
        <>
          {/* Image */}
          {imageUrl && (
            <div className="overflow-hidden rounded-xl border border-line">
              <img src={imageUrl} alt={donation.food_name} className="photo-natural h-60 w-full object-cover" />
            </div>
          )}

          {/* Title block */}
          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-['Anton'] text-2xl text-text tracking-tight">{donation.food_name}</h1>
              <p className="mt-0.5 text-[13px] text-text-2">
                {CATEGORY_LABELS[donation.food_category] ?? donation.food_category} ·
                {' '}{donation.available_quantity} {UNIT_LABELS[donation.unit]?.toLowerCase() ?? donation.unit} available
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusChip status={donation.status} />
              <ExpiryBadge expiresAt={donation.expires_at} />
            </div>
          </div>

          {/* Facts grid */}
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Fact icon={<Package className="h-4 w-4" />} label="Donor" value={donation.donor_business_name || 'Verified donor'} />
            <Fact icon={<MapPin className="h-4 w-4" />} label="Pickup city" value={donation.city} />
            <Fact icon={<Snowflake className="h-4 w-4" />} label="Storage" value={donation.storage_requirement.replace('_', ' ')} />
            <Fact icon={<Clock className="h-4 w-4" />} label="Qty claimed" value={`${(donation.quantity - donation.available_quantity) < 0 ? 0 : donation.quantity - donation.available_quantity} / ${donation.quantity}`} />
          </div>

          {/* Description */}
          <div className="mt-5 rounded-xl border border-line bg-panel p-4">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-text-2">About this donation</h2>
            <p className="mt-2 text-[13px] leading-relaxed text-text-2">{donation.description || 'No description was provided for this donation.'}</p>
            <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1.5 text-[12px] md:grid-cols-2">
              <DetailRow label="Prepared at" value={donation.prepared_at ? formatDateTime(donation.prepared_at) : '—'} />
              <DetailRow label="Expires at" value={donation.expires_at ? formatDateTime(donation.expires_at) : '—'} />
              <DetailRow label="Temperature" value={donation.temperature_category || '—'} />
              <DetailRow label="Packaging" value={donation.packaging_condition || '—'} />
              <DetailRow label="Classification" value={donation.is_vegetarian === null ? 'Not specified' : donation.is_vegetarian ? 'Vegetarian' : 'Contains meat / fish'} />
              <DetailRow label="Allergens" value={donation.allergen_info || 'Not specified'} />
              <DetailRow label="Pickup window" value={donation.pickup_window || '—'} />
              <DetailRow label="Pickup instructions" value={donation.pickup_instructions || '—'} />
            </dl>
          </div>

          {/* CTA */}
          {!isRecipient ? (
            <div className="mt-5 rounded-xl border border-line bg-panel p-4">
              <p className="flex items-center gap-2 text-[13px] text-text-2">
                <Phone className="h-4 w-4 text-primary-fixed" /> Recipients request food here — contact details are shared when your donation is claimed.
              </p>
            </div>
          ) : claimable ? (
            <button onClick={() => setShowRequest(true)} className="btn-primary mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5">
              <BadgeCheck className="h-4 w-4" /> Request food ({donation.available_quantity} {donation.unit} available)
            </button>
          ) : (
            <div className="mt-5 rounded-xl border border-line bg-panel p-4 text-center">
              <p className="text-[13px] font-semibold text-text">
                {expired ? 'This donation expired — it can no longer be requested' : 'This batch is fully claimed'}
              </p>
              <Link to="/browse" className="mt-2 inline-block text-[13px] text-primary-fixed font-semibold">Browse other donations</Link>
            </div>
          )}

          {/* Request modal */}
          {showRequest && donation && (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-app-deep/70 md:items-center p-0 md:p-4" onClick={(e) => e.target === e.currentTarget && setShowRequest(false)}>
              <form onSubmit={submitRequest} className="w-full max-w-lg rounded-t-2xl md:rounded-2xl border border-line bg-panel p-5 max-h-[88vh] overflow-y-auto">
                <h2 className="font-['Anton'] text-xl text-text">Request "{donation.food_name}"</h2>
                <p className="mt-0.5 text-[12px] text-text-3">{donation.available_quantity} {donation.unit} available from {donation.city}</p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <ReqField label="Quantity" required>
                    <input
                      type="number" min={0} step="0.01" value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder={`max ${donation.available_quantity}`}
                      className="input-field"
                      required
                    />
                  </ReqField>
                  <ReqField label="Unit" required>
                    <select value={unit} onChange={(e) => setUnit(e.target.value)} className="input-field">
                      {UNITS.map((u) => (
                        <option key={u} value={u}>{UNIT_LABELS[u]}</option>
                      ))}
                    </select>
                  </ReqField>
                  <ReqField label="Your contact name" required>
                    <input value={contactName} onChange={(e) => setContactName(e.target.value)} className="input-field" required />
                  </ReqField>
                  <ReqField label="Contact number" required>
                    <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className="input-field" required />
                  </ReqField>
                  <div className="col-span-2">
                    <ReqField label="Pickup / delivery address" required>
                      <input value={address} onChange={(e) => setAddress(e.target.value)} className="input-field" required />
                    </ReqField>
                  </div>
                  <ReqField label="Preferred collection time">
                    <input type="datetime-local" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} className="input-field" />
                  </ReqField>
                  <ReqField label="People to feed">
                    <input type="number" min={1} value={people} onChange={(e) => setPeople(e.target.value)} className="input-field" />
                  </ReqField>
                  <div className="col-span-2">
                    <ReqField label="Additional instructions">
                      <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={2} className="input-field resize-none" />
                    </ReqField>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => setShowRequest(false)} className="btn-secondary flex-1 rounded-xl py-3 text-[13px]">Cancel</button>
                  <button type="submit" disabled={submitting} className="btn-primary flex-1 rounded-xl py-3 text-[13px] flex items-center justify-center gap-2">
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />} Send request
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* User swap hint */}
          {!user && <p className="mt-4 text-center text-[12px] text-text-3"><UserIcon className="inline h-3 w-3" /> Sign in as a recipient to request food</p>}
        </>
      )}
    </div>
  )
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-panel p-3">
      <div className="flex items-center gap-1.5 text-text-3">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className="mt-1 truncate text-[13px] font-semibold text-text">{value}</p>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-text-3">{label}</dt>
      <dd className="text-right text-text-2">{value}</dd>
    </div>
  )
}

function ReqField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-text-3">
        {label}{required && <span className="ml-0.5 text-danger">*</span>}
      </label>
      {children}
    </div>
  )
}
