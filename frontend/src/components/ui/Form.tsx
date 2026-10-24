import { forwardRef } from 'react'
import { cn } from '../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  placeholder?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, placeholder = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="input-label">{label}</label>
        )}
        <input
          type="text"
          ref={ref}
          placeholder={placeholder}
          className={cn(
            'w-full bg-[#12241b] border border-forest-600/40 rounded-lg px-3.5 py-2.5 text-cream placeholder-stone-dark/70 focus:outline-none focus:ring-2 focus:ring-botanical focus:border-transparent transition-all duration-200 text-sm',
            error && 'border-rose-500/50 focus:ring-rose-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-rose-400">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string; label: string }>
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="input-label">{label}</label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full bg-[#12241b] border border-forest-600/40 rounded-lg px-3.5 py-2.5 text-cream placeholder-stone-dark/70 focus:outline-none focus:ring-2 focus:ring-botanical focus:border-transparent transition-all duration-200 text-sm',
            error && 'border-rose-500/50 focus:ring-rose-500',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-[#12241b] text-cream">
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-rose-400">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="input-label">{label}</label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full bg-[#12241b] border border-forest-600/40 rounded-lg px-3.5 py-2.5 text-cream placeholder-stone-dark/70 focus:outline-none focus:ring-2 focus:ring-botanical focus:border-transparent transition-all duration-200 text-sm',
            error && 'border-rose-500/50 focus:ring-rose-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-rose-400">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Input, Select, Textarea }