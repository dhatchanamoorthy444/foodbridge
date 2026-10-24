import { forwardRef } from 'react'
import { cn } from '../lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  transparent?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, transparent = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-surface-border bg-surface-elevated p-6 shadow-card',
          hover && 'transition-all duration-300 hover:shadow-card-hover hover:border-white/10',
          transparent && 'bg-transparent border-white/5',
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export { Card }