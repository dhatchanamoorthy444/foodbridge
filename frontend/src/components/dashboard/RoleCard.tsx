import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface RoleCardProps {
  title: string
  description: string
  icon: LucideIcon
  accentColor: string
  bgGradient: string
  features: string[]
  buttonText: string
  onClick: () => void
  badge?: string
}

export default function RoleCard({
  title,
  description,
  icon: Icon,
  accentColor,
  bgGradient,
  features,
  buttonText,
  onClick,
  badge,
}: RoleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="relative rounded-2xl border border-[#262E26] overflow-hidden group cursor-pointer"
      style={{ background: bgGradient }}
      onClick={onClick}
    >
      {/* Accent glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ background: accentColor }}
      />

      <div className="relative z-10 p-8">
        <div className="flex items-start justify-between mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: `${accentColor}20` }}
          >
            <Icon className="w-8 h-8" style={{ color: accentColor }} />
          </div>

          {badge && (
            <span
              className="px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider border"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              {badge}
            </span>
          )}
        </div>

        <h3
          className="font-['Anton'] text-3xl uppercase tracking-wide mb-3"
          style={{ color: accentColor }}
        >
          {title}
        </h3>

        <p className="text-[#B8BDB6] text-sm leading-relaxed mb-6">
          {description}
        </p>

        <ul className="space-y-3 mb-8">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div
                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: `${accentColor}20` }}
              >
                <span
                  className="material-symbols-outlined text-[14px]"
                  style={{ color: accentColor }}
                >
                  check
                </span>
              </div>
              <span className="text-[#E6E9E3] text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          className="w-full h-14 rounded-xl font-mono text-sm font-bold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-98 shadow-lg"
          style={{ background: accentColor, color: '#090B09' }}
        >
          {buttonText} →
        </button>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: accentColor }} />
    </motion.div>
  )
}
