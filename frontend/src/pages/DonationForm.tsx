import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { ArrowLeft, ImagePlus, X, Loader2, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  donationsService, uploadsService,
} from '../services/api'
import {
  FOOD_CATEGORIES, CATEGORY_LABELS, UNITS, UNIT_LABELS, STORAGE_REQUIREMENTS,
} from '../types/api'
import { storagePublicUrl } from '../lib/supabase'

interface FormState {
  food_name: string
  food_category: string
  description: string
  quantity: string
  unit: string
  prepared_at: string
  expires_at: string
  storage_requirement: string
  temperature_category: string
  packaging_condition: string
  is_vegetarian: boolean | null
  allergen_info: string
  pickup_address: string
  area: string
  city: string
  postal_code: string
  pickup_window: string
  pickup_instructions: string
  contact_name: string
  contact_phone: string
  alternate_contact: string
}

const EMPTY_FORM: FormState = {
  food_name: '', food_category: 'fruits', description: '', quantity: '',
  unit: 'kg', prepared_at: '', expires_at: '', storage_requirement: 'room_temperature',
  temperature_category: '', packaging_condition: '', is_vegetarian: null,
  allergen_info: '', pickup_address: '', area: '', city: '', postal_code: '',
  pickup_window: '', pickup_instructions: '', contact_name: '', contact_phone: '', alternate_contact: '',
}

function localInput(dt: string): string {
  if (!dt) return ''
  const d = new Date(dt)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function DonationForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = Boolean(id)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [existingImagePath, setExistingImagePath] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const existingQuery = useQuery({
    queryKey: ['donation', id],
    queryFn: () => donationsService.byId(id!),
    enabled: editing,
  })

  useEffect(() => {
    const d = existingQuery.data
    if (d) {
      setForm({
        food_name: d.food_name, food_category: d.food_category,
        description: d.description ?? '', quantity: String(d.quantity), unit: d.unit,
        prepared_at: localInput(d.prepared_at ?? ''),
        expires_at: localInput(d.expires_at ?? ''),
        storage_requirement: d.storage_requirement,
        temperature_category: d.temperature_category ?? '',
        packaging_condition: d.packaging_condition ?? '',
        is_vegetarian: d.is_vegetarian,
        allergen_info: d.allergen_info ?? '',
        pickup_address: d.pickup_address, area: d.area ?? '', city: d.city,
        postal_code: d.postal_code ?? '', pickup_window: d.pickup_window ?? '',
        pickup_instructions: d.pickup_instructions ?? '', contact_name: d.contact_name ?? '',
        contact_phone: d.contact_phone ?? '', alternate_contact: d.alternate_contact ?? '',
      })
      setExistingImagePath(d.image_path)
      if (d.image_path) setImagePreview(storagePublicUrl(d.image_path))
    }
  }, [existingQuery.data])

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: val }))

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setError('')
    if (!file) return
    const okTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
    if (!okTypes.includes(file.type)) {
      setError('Only JPG, PNG, WEBP or HEIC images are accepted')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB')
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setExistingImagePath(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const validate = (): string => {
    if (form.food_name.trim().length < 2) return 'Food name is required'
    if (!form.quantity || Number(form.quantity) <= 0) return 'Quantity must be greater than zero'
    if (!form.expires_at) return 'Expiry date/time is required'
    if (form.prepared_at && new Date(form.expires_at) <= new Date(form.prepared_at)) {
      return 'Expiry must be after preparation time'
    }
    if (new Date(form.expires_at).getTime() < Date.now()) return 'Expired food cannot be published'
    if (form.pickup_address.trim().length < 4) return 'Pickup address is required'
    if (form.city.trim().length < 2) return 'City is required'
    if (form.contact_name.trim().length < 2) return 'Contact name is required'
    if (form.contact_phone.trim().length < 6) return 'Contact phone is required'
    return ''
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate()
    if (v) { setError(v); return }
    setError('')
    setSubmitting(true)
    try {
      let image_path = existingImagePath
      if (imageFile) {
        setUploading(true)
        const up = await uploadsService.foodImage(imageFile)
        image_path = up.path
        setUploading(false)
      }
      const payload = {
        food_name: form.food_name.trim(),
        food_category: form.food_category,
        description: form.description.trim() || undefined,
        image_path: image_path ?? undefined,
        quantity: Number(form.quantity),
        unit: form.unit,
        prepared_at: form.prepared_at ? new Date(form.prepared_at).toISOString() : undefined,
        expires_at: new Date(form.expires_at).toISOString(),
        storage_requirement: form.storage_requirement,
        temperature_category: form.temperature_category.trim() || undefined,
        packaging_condition: form.packaging_condition.trim() || undefined,
        is_vegetarian: form.is_vegetarian,
        allergen_info: form.allergen_info.trim() || undefined,
        pickup_address: form.pickup_address.trim(),
        area: form.area.trim() || undefined,
        city: form.city.trim(),
        postal_code: form.postal_code.trim() || undefined,
        pickup_window: form.pickup_window.trim() || undefined,
        pickup_instructions: form.pickup_instructions.trim() || undefined,
        contact_name: form.contact_name.trim(),
        contact_phone: form.contact_phone.trim(),
        alternate_contact: form.alternate_contact.trim() || undefined,
      }
      if (editing) {
        await donationsService.update(id!, payload)
        toast.success('Donation updated')
      } else {
        await donationsService.create(payload)
        setSubmitted(true)
      }
      navigate('/donor', { replace: !editing })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
      setUploading(false)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto mt-10 max-w-md text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
          <Check className="h-7 w-7" />
        </span>
        <h1 className="mt-4 font-display text-2xl text-text">Donation published</h1>
        <p className="mt-2 text-[13px] text-text-2">It is now visible to eligible recipients and live on your dashboard.</p>
        <Link to="/donor" className="btn-primary mt-6 inline-flex rounded-xl px-5 py-2.5 text-[13px]">Back to dashboard</Link>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl pb-10">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-[13px] text-text-2 hover:text-text transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <h1 className="font-display text-2xl text-text tracking-tight">
        {editing ? 'Edit donation' : 'New food donation'}
      </h1>
      <p className="mt-1 text-[13px] text-text-2">All fields validated on the server. Image uploads go to secure storage.</p>

      {error && (
        <div className="mt-4 rounded-xl bg-danger-soft px-4 py-3 text-[13px] text-danger">{error}</div>
      )}

      <form onSubmit={submit} className="mt-5 space-y-6">
        <Section title="Food details">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Food name" required>
              <input value={form.food_name} onChange={(e) => set('food_name', e.target.value)} placeholder="e.g. Basmati rice, cooked meals" className="input-field" />
            </Field>
            <Field label="Category" required>
              <select value={form.food_category} onChange={(e) => set('food_category', e.target.value)} className="input-field">
                {FOOD_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={2} className="input-field resize-none" placeholder="Brand, freshness notes, serving size…" />
              </Field>
            </div>

            {/* Image */}
            <div className="md:col-span-2">
              <Field label="Food image">
                {imagePreview ? (
                  <div className="relative w-fit">
                    <img src={imagePreview} alt="Preview" className="h-36 w-44 rounded-xl object-cover border border-line" />
                    <button type="button" onClick={clearImage} className="absolute -right-2 -top-2 rounded-full bg-danger p-1 text-white" aria-label="Remove image"><X className="h-3.5 w-3.5" /></button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex h-24 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-panel text-[13px] text-text-2 hover:border-primary hover:text-text transition-colors"
                  >
                    <ImagePlus className="h-5 w-5" />
                    Choose image (JPG/PNG/WEBP · max 5 MB)
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic" onChange={onImageChange} className="hidden" />
                {uploading && <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-text-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading image…</p>}
              </Field>
            </div>

            <Field label="Available quantity" required>
              <input type="number" min={0} step="0.01" value={form.quantity} onChange={(e) => set('quantity', e.target.value)} className="input-field" placeholder="e.g. 25" />
            </Field>
            <Field label="Unit" required>
              <select value={form.unit} onChange={(e) => set('unit', e.target.value)} className="input-field">
                {UNITS.map((u) => (
                  <option key={u} value={u}>{UNIT_LABELS[u]}</option>
                ))}
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Safety & expiry">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Prepared at" >
              <input type="datetime-local" value={form.prepared_at} onChange={(e) => set('prepared_at', e.target.value)} className="input-field" />
            </Field>
            <Field label="Expiry / best before" required>
              <input type="datetime-local" value={form.expires_at} onChange={(e) => set('expires_at', e.target.value)} className="input-field" />
            </Field>
            <Field label="Storage requirement">
              <select value={form.storage_requirement} onChange={(e) => set('storage_requirement', e.target.value)} className="input-field">
                {STORAGE_REQUIREMENTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Temperature category">
              <input value={form.temperature_category} onChange={(e) => set('temperature_category', e.target.value)} placeholder="e.g. Hot-held, frozen" className="input-field" />
            </Field>
            <Field label="Packaging condition">
              <input value={form.packaging_condition} onChange={(e) => set('packaging_condition', e.target.value)} placeholder="e.g. Sealed crate" className="input-field" />
            </Field>
            <Field label="Food classification">
              <select value={form.is_vegetarian === null ? '' : form.is_vegetarian ? 'veg' : 'nonveg'} onChange={(e) => set('is_vegetarian', e.target.value === '' ? null : e.target.value === 'veg')} className="input-field">
                <option value="">Not specified</option>
                <option value="veg">Vegetarian</option>
                <option value="nonveg">Contains meat / fish</option>
              </select>
            </Field>
            <div className="md:col-span-2">
              <Field label="Allergen information">
                <input value={form.allergen_info} onChange={(e) => set('allergen_info', e.target.value)} placeholder="e.g. contains gluten, nuts" className="input-field" />
              </Field>
            </div>
          </div>
        </Section>

        <Section title="Location & collection">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Field label="Pickup address" required>
                <input value={form.pickup_address} onChange={(e) => set('pickup_address', e.target.value)} className="input-field" placeholder="Street / location" />
              </Field>
            </div>
            <Field label="Area / locality">
              <input value={form.area} onChange={(e) => set('area', e.target.value)} className="input-field" />
            </Field>
            <Field label="City" required>
              <input value={form.city} onChange={(e) => set('city', e.target.value)} className="input-field" />
            </Field>
            <Field label="Postal code">
              <input value={form.postal_code} onChange={(e) => set('postal_code', e.target.value)} className="input-field" />
            </Field>
            <Field label="Pickup availability">
              <input value={form.pickup_window} onChange={(e) => set('pickup_window', e.target.value)} placeholder="e.g. Monâ€“Sat, 9 AMâ€“7 PM" className="input-field" />
            </Field>
            <div className="md:col-span-2">
              <Field label="Pickup instructions">
                <textarea value={form.pickup_instructions} onChange={(e) => set('pickup_instructions', e.target.value)} rows={2} className="input-field resize-none" placeholder="Gate details, who to ask…" />
              </Field>
            </div>
          </div>
        </Section>

        <Section title="Contact">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Contact person" required>
              <input value={form.contact_name} onChange={(e) => set('contact_name', e.target.value)} className="input-field" />
            </Field>
            <Field label="Contact phone" required>
              <input value={form.contact_phone} onChange={(e) => set('contact_phone', e.target.value)} className="input-field" placeholder="+91 …" />
            </Field>
            <Field label="Alternate contact">
              <input value={form.alternate_contact} onChange={(e) => set('alternate_contact', e.target.value)} className="input-field" />
            </Field>
          </div>
          <p className="mt-2 text-[11px] text-text-3">Contact details become visible to recipients requesting this donation.</p>
        </Section>

        <button type="submit" disabled={submitting} className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[14px]">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {editing ? 'Save changes' : uploading ? 'Uploading…' : 'Publish donation'}
        </button>
      </form>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-xl border border-line bg-panel p-4 md:p-5">
      <legend className="px-1.5 text-[11px] font-bold uppercase tracking-widest text-text-2">{title}</legend>
      <div className="pt-3">{children}</div>
    </fieldset>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-text-2">
        {label}{required && <span className="ml-1 text-danger">*</span>}
      </label>
      {children}
    </div>
  )
}
