import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'botanical' | 'botanical-outline' | 'forest-primary'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon' | 'xl'

const getVariantClasses = (variant: ButtonVariant): string => {
  const variants: Record<ButtonVariant, string> = {
    default:
      'bg-harvest text-app-deep border-2 border-harvest hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_rgb(var(--fb-text))] active:translate-x-0 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wide',
    destructive:
      'bg-tomato text-app-deep border-2 border-tomato hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_rgb(var(--fb-text))] font-bold uppercase tracking-wide',
    outline: 'border-2 border-harvest bg-transparent hover:bg-harvest/10 text-harvest font-bold uppercase tracking-wide',
    secondary: 'bg-panel text-bone border-2 border-line hover:border-harvest hover:text-harvest font-bold uppercase tracking-wide',
    ghost: 'text-muted hover:text-harvest hover:bg-panel/60 border-2 border-transparent font-bold uppercase tracking-wide',
    link: 'text-harvest underline-offset-4 hover:underline font-semibold',
    botanical:
      'bg-harvest text-app-deep border-2 border-harvest rounded-[10px] font-bold uppercase tracking-wide transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_rgb(var(--fb-text))] active:translate-x-0 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none',
    'botanical-outline':
      'bg-transparent hover:bg-harvest/10 text-harvest rounded-[10px] font-bold uppercase tracking-wide transition-all duration-150 border-2 border-harvest',
    'forest-primary':
      'bg-panel hover:border-harvest hover:text-harvest text-bone rounded-[10px] font-bold uppercase tracking-wide transition-all duration-150 border-2 border-line active:scale-[0.98]',
  }
  return variants[variant]
}

const getSizeClasses = (size: ButtonSize): string => {
  const sizes: Record<ButtonSize, string> = {
    default: 'h-10 px-4 py-2',
    sm: 'h-8 px-3 text-sm',
    lg: 'h-12 px-6 text-base',
    icon: 'h-10 w-10',
    xl: 'h-14 px-8 text-lg',
  }
  return sizes[size]
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-[10px] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-harvest focus:ring-offset-2 focus:ring-offset-app disabled:pointer-events-none',
          getVariantClasses(variant),
          getSizeClasses(size),
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button }