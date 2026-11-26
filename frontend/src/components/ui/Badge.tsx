import { cn } from '../../lib/utils'

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'
  | 'botanical'
  | 'forest'
  | 'olive'
  | 'cream'
  | 'status-normal'
  | 'status-urgent'
  | 'status-critical'
  | 'status-expired'
  | 'status-safety'

const getBadgeClasses = (variant: BadgeVariant = 'default'): string => {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/40',
    secondary: 'bg-forest-800 text-stone border-forest-600/40',
    success: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/40',
    warning: 'bg-amber-950/80 text-amber-300 border-amber-700/40',
    danger: 'bg-rose-950/80 text-rose-300 border-rose-700/40',
    info: 'bg-sky-950/80 text-sky-300 border-sky-700/40',
    outline: 'text-stone border-forest-600/40 bg-transparent',
    botanical: 'bg-botanical/20 text-botanical-light border-botanical/40',
    forest: 'bg-forest-800/40 text-cream border-forest-600/30',
    olive: 'bg-olive/20 text-olive-light border-olive/30',
    cream: 'bg-cream/20 text-cream border-cream/30',
    "status-normal": 'bg-emerald-950/80 text-emerald-300 border-emerald-700/40',
    "status-urgent": 'bg-amber-950/80 text-amber-300 border-amber-700/40',
    "status-critical": 'bg-orange-950/80 text-orange-300 border-orange-700/40',
    "status-expired": 'bg-rose-950/80 text-rose-300 border-rose-700/40',
    "status-safety": 'bg-purple-950/80 text-purple-300 border-purple-700/40',
  }
  return variants[variant] || variants.default
}

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant | (string & {})
}

function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
        getBadgeClasses(variant as BadgeVariant),
        className
      )}
      {...props}
    />
  )
}

export { Badge }
export const badgeVariants = (opts?: { variant?: BadgeVariant }) => getBadgeClasses(opts?.variant)