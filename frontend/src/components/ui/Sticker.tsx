import { cn } from '../../lib/utils'

const tones = {
  harvest: 'bg-harvest text-app-deep',
  tomato: 'bg-tomato text-app-deep',
  carrot: 'bg-carrot text-app-deep',
  wheat: 'bg-wheat text-app-deep',
  leaf: 'bg-leaf text-bone',
} as const

export type StickerTone = keyof typeof tones

interface StickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: StickerTone
  rotate?: number
}

export function Sticker({
  children,
  tone = 'harvest',
  rotate = -2,
  className,
  style,
  ...props
}: StickerProps) {
  return (
    <span
      className={cn('sticker', tones[tone], className)}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
      {...props}
    >
      {children}
    </span>
  )
}

export default Sticker
