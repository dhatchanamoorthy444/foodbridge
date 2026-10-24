import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm',
        destructive: 'bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 shadow-sm',
        outline: 'border border-surface-border bg-transparent hover:bg-white/5 text-slate-200',
        secondary: 'bg-surface-elevated text-slate-200 hover:bg-surface-border border border-surface-border',
        ghost: 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
        link: 'text-primary-400 underline-offset-4 hover:underline',
        botanical: 'bg-botanical hover:bg-botanical-light text-cream rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-botanical-light focus:ring-offset-2 focus:ring-offset-[#0b1510] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        "botanical-outline": 'bg-transparent hover:bg-botanical/20 text-botanical rounded-lg font-medium transition-all duration-200 border border-botanical/40 focus:outline-none focus:ring-2 focus:ring-botanical',
        "forest-primary": 'bg-forest-800 hover:bg-forest-700 text-cream rounded-lg font-medium transition-all duration-200 border border-forest-600/40 focus:outline-none focus:ring-2 focus:ring-botanical focus:ring-offset-2 focus:ring-offset-[#0b1510] active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-12 px-6',
        icon: 'h-10 w-10',
        xl: 'h-14 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }