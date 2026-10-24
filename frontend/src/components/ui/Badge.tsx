import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary-500/20 text-primary-300 border-primary-500/30',
        secondary: 'bg-surface-elevated text-slate-300 border-surface-border',
        success: 'bg-green-500/20 text-green-300 border-green-500/30',
        warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        danger: 'bg-red-500/20 text-red-300 border-red-500/30',
        info: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
        outline: 'text-slate-300 border-surface-border',
        // UI/UX design constraint compliant variants
        botanical: 'bg-botanical/20 text-botanical-light border-botanical/40',
        forest: 'bg-forest-800/40 text-cream border-forest-600/30',
        olive: 'bg-olive/20 text-olive-light border-olive/30',
        cream: 'bg-cream/20 text-forest-800 border-cream/30',
        "status-normal": 'bg-emerald-950/80 text-emerald-300 border-emerald-700/40',
        "status-urgent": 'bg-amber-950/80 text-amber-300 border-amber-700/40',
        "status-critical": 'bg-orange-950/80 text-orange-300 border-orange-700/40',
        "status-expired": 'bg-rose-950/80 text-rose-300 border-rose-700/40',
        "status-safety": 'bg-purple-950/80 text-purple-300 border-purple-700/40',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }