import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

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
          'rounded-[10px] border-2 border-line/70 bg-panel p-6 shadow-card',
          hover &&
            'transition-all duration-200 hover:border-harvest hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgb(var(--fb-accent))]',
          transparent && 'border-line/40 bg-transparent',
          className
        )}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export { Card }