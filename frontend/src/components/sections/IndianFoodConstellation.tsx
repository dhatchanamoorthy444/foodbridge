import { useRef, useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tag } from 'lucide-react'

interface Food {
  emoji: string
  name: string
  tamil: string
  color: string
  note: string
}

const FOODS: Food[] = [
  { emoji: 'ð¥£', name: 'Idli', tamil: 'à®à®à¯à®²à®¿', color: '#E0FF00', note: 'Steamed cloud, sambar soul.' },
  { emoji: 'ð¥', name: 'Dosa', tamil: 'à®¤à¯à®à¯', color: '#ECFB7E', note: 'Paper-thin, ghee-kissed.' },
  { emoji: 'ð©', name: 'Vada', tamil: 'à®µà®à¯', color: '#BAD306', note: 'Crisp ring, pepper bite.' },
  { emoji: 'ð²', name: 'Pongal', tamil: 'à®ªà¯à®à¯à®à®²à¯', color: '#667210', note: 'Harvest rice, ghee, pepper.' },
  { emoji: 'ð«', name: 'Sambar', tamil: 'à®à®¾à®®à¯à®ªà®¾à®°à¯', color: '#C4C4C4', note: 'Lentil, tamarind, drumstick.' },
  { emoji: 'â', name: 'Filter Coffee', tamil: 'à®ªà®¿à®²à¯à®à®°à¯ à®à®¾à®ªà®¿', color: '#747474', note: 'Brass dabara, frothy top.' },
  { emoji: 'ð¥', name: 'Biryani', tamil: 'à®ªà®¿à®°à®¿à®¯à®¾à®£à®¿', color: '#E0FF00', note: 'Seeraga samba, saffron.' },
  { emoji: 'ð«', name: 'Parotta', tamil: 'à®ªà®°à¯à®à¯à®à®¾', color: '#ECFB7E', note: 'Layered, flaky, street-side.' },
  { emoji: 'ð§', name: 'Kuzhi Paniyaram', tamil: 'à®à¯à®´à®¿ à®ªà®£à®¿à®¯à®¾à®°à®®à¯', color: '#BAD306', note: 'Crisp outside, soft inside.' },
  { emoji: 'ð', name: 'Idiyappam', tamil: 'à®à®à®¿à®¯à®¾à®ªà¯à®ªà®®à¯', color: '#667210', note: 'Rice noodles, coconut milk.' },
  { emoji: 'ð', name: 'Puliyodarai', tamil: 'à®ªà¯à®³à®¿à®¯à¯à®¤à®°à¯', color: '#C4C4C4', note: 'Tamarind rice, temple prasadam.' },
  { emoji: 'ð¥£', name: 'Rasam', tamil: 'à®°à®à®®à¯', color: '#747474', note: 'Pepper, tomato, comfort.' },
  { emoji: 'ð®', name: 'Payasam', tamil: 'à®ªà®¾à®¯à®à®®à¯', color: '#ECFB7E', note: 'Jaggery, milk, cardamom.' },
  { emoji: 'ð¶ï¸', name: 'Chili', tamil: 'à®®à®¿à®³à®à®¾à®¯à¯', color: '#FF4630', note: 'Heat that wakes the plate.' },
  { emoji: 'ð¥­', name: 'Mango', tamil: 'à®®à®¾à®®à¯à®ªà®´à®®à¯', color: '#ECFB7E', note: 'Summer gold, sticky fingers.' },
  { emoji: 'ð¥¥', name: 'Coconut', tamil: 'à®¤à¯à®à¯à®à®¾à®¯à¯', color: '#F8F8F8', note: 'Sweet, cool, tropical.' },
  { emoji: 'ð¥¬', name: 'Banana Leaf', tamil: 'à®µà®¾à®´à¯ à®à®²à¯', color: '#667210', note: 'The plate of the south.' },
  { emoji: 'ð¬', name: 'Murukku', tamil: 'à®®à¯à®±à¯à®à¯à®à¯', color: '#E0FF00', note: 'Spiral crunch, rice flour.' },
  { emoji: 'ðª', name: 'Adhirasam', tamil: 'à®à®¤à®¿à®°à®à®®à¯', color: '#BAD306', note: 'Jaggery doughnut, deep-fried.' },
  { emoji: 'ð«', name: 'Mysore Pak', tamil: 'à®®à¯à®à¯à®°à¯ à®ªà®¾à®à¯', color: '#ECFB7E', note: 'Ghee, gram flour, melt.' },
  { emoji: 'ð¾', name: 'Sugarcane', tamil: 'à®à®°à¯à®®à¯à®ªà¯', color: '#667210', note: 'Pongal harvest symbol.' },
  { emoji: 'ð', name: 'Kolam', tamil: 'à®à¯à®²à®®à¯', color: '#C4C4C4', note: 'Rice-flour doorstep art.' },
]

// remove placeholder
const ITEMS = FOODS.filter((f) => f.name)

interface PositionedFood extends Food {
  id: string
  x: number
  y: number
  size: number
  floatDelay: number
  floatAmp: number
  rotBase: number
}

function buildPositions(items: Food[]): PositionedFood[] {
  // deterministic-ish scatter using golden ratio
  const phi = 1.61803398875
  return items.map((it, i) => {
    const angle = i * phi * Math.PI * 2
    const radius = 18 + (i % 5) * 6
    const x = 50 + Math.cos(angle) * radius * 0.6
    const y = 48 + Math.sin(angle) * radius * 0.45
    return {
      ...it,
      id: `${it.name}-${i}`,
      x: Math.min(92, Math.max(8, x)),
      y: Math.min(88, Math.max(12, y)),
      size: 44 + (i % 4) * 10,
      floatDelay: i * 0.18,
      floatAmp: 6 + (i % 3) * 4,
      rotBase: (i % 2 === 0 ? -1 : 1) * (4 + (i % 3) * 3),
    }
  })
}

export default function IndianFoodConstellation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: -1000, y: -1000, active: false })
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const [hovered, setHovered] = useState<string | null>(null)
  const [trail, setTrail] = useState<{ x: number; y: number; id: number }[]>([])
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; color: string }[]>([])

  const items = useMemo(() => buildPositions(ITEMS), [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let trailId = 0
    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setMouse({ x, y, active: true })
      setTilt({ rx: (y - 50) / 8, ry: (x - 50) / -8 })
      setTrail((prev) => {
        const next = [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, id: trailId++ }]
        return next.slice(-14)
      })
    }
    const handleLeave = () => {
      setMouse((m) => ({ ...m, active: false }))
      setTilt({ rx: 0, ry: 0 })
    }
    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  // decay trail
  useEffect(() => {
    if (trail.length === 0) return
    const t = setTimeout(() => setTrail((p) => p.slice(1)), 60)
    return () => clearTimeout(t)
  }, [trail])

  // decay bursts
  useEffect(() => {
    if (bursts.length === 0) return
    const t = setTimeout(() => setBursts((p) => p.slice(1)), 700)
    return () => clearTimeout(t)
  }, [bursts])

  const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  const intensityFor = (it: PositionedFood) => {
    if (!mouse.active) return 0
    const d = dist(it, mouse)
    return Math.max(0, 1 - d / 22)
  }

  const hoveredItem = hovered ? items.find((i) => i.id === hovered) : null

  return (
    <section className="relative z-20 overflow-hidden border-y-2 border-bone/15 px-6 py-24 md:px-10">
      {/* subtle line grid â no radial orbs (rule 22) */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgb(224 255 0 / 1) 1px, transparent 1px), linear-gradient(90deg, rgb(224 255 0 / 1) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="mb-12 grid items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-8">
            <span className="sticker mb-5">
              <Tag className="h-3.5 w-3.5" /> Indian kitchen, alive
            </span>
            <h2 className="display-type text-[clamp(2.6rem,6vw,5rem)] text-bone">
              Move your mouse.
              <br />
              <span className="text-outline-neon">Feed the constellation.</span>
            </h2>
          </div>
          <p className="font-body text-sm leading-relaxed text-fog md:col-span-4">
            Every dish is a node. Hover close and it lights up in its own colour, scales up,
            and whispers its secret. No clicks required, just curiosity.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative h-[520px] w-full overflow-hidden rounded-[10px] border-2 border-bone/20 bg-ink-deep shadow-[12px_12px_0_0_rgb(var(--fb-accent))]"
          style={{
            cursor: 'none',
            transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: 'transform 120ms ease-out',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* grid backdrop */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(248,248,248,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(248,248,248,0.06) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* trail */}
          {trail.map((t, i) => (
            <motion.span
              key={t.id}
              className="pointer-events-none absolute z-30 rounded-full"
              style={{
                left: t.x,
                top: t.y,
                width: 6 + i * 0.6,
                height: 6 + i * 0.6,
                backgroundColor: '#E0FF00',
                boxShadow: '0 0 12px #E0FF00',
                transform: 'translate(-50%, -50%)',
                opacity: (i + 1) / trail.length,
              }}
              initial={{ scale: 1, opacity: 0.9 }}
              animate={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          ))}

          {/* cursor glow core */}
          {mouse.active && (
            <motion.div
              className="pointer-events-none absolute z-20 rounded-full"
              style={{
                left: `${mouse.x}%`,
                top: `${mouse.y}%`,
                width: 180,
                height: 180,
                transform: 'translate(-50%, -50%)',
                background:
                  'radial-gradient(circle, rgba(224,255,0,0.22) 0%, rgba(224,255,0,0.06) 40%, transparent 70%)',
                mixBlendMode: 'screen',
              }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}

          {/* bursts */}
          {bursts.map((b) => (
            <div key={b.id} className="pointer-events-none absolute z-20" style={{ left: `${b.x}%`, top: `${b.y}%` }}>
              {Array.from({ length: 10 }).map((_, k) => {
                const angle = (k / 10) * Math.PI * 2
                const dist = 60 + Math.random() * 40
                return (
                  <motion.span
                    key={k}
                    className="absolute rounded-full"
                    style={{
                      width: 4 + Math.random() * 4,
                      height: 4 + Math.random() * 4,
                      backgroundColor: b.color,
                      boxShadow: `0 0 8px ${b.color}`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: Math.cos(angle) * dist,
                      y: Math.sin(angle) * dist,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                )
              })}
            </div>
          ))}

          {/* stickers */}
          {items.map((it) => {
            const intensity = intensityFor(it)
            const scale = 1 + intensity * 0.55
            const glow = intensity * 46
            const isHovered = hovered === it.id
            return (
              <motion.button
                key={it.id}
                type="button"
                onMouseEnter={() => {
                  setHovered(it.id)
                  setBursts((b) => [
                    ...b,
                    { id: Date.now() + Math.random(), x: it.x, y: it.y, color: it.color },
                  ])
                }}
                onMouseLeave={() => setHovered(null)}
                className="absolute z-10 flex flex-col items-center gap-1 outline-none"
                style={{
                  left: `${it.x}%`,
                  top: `${it.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  y: [0, -it.floatAmp, 0, it.floatAmp * 0.6, 0],
                  rotate: [it.rotBase, -it.rotBase, it.rotBase],
                }}
                transition={{
                  duration: 4 + (it.floatDelay % 2),
                  delay: it.floatDelay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="relative flex items-center justify-center rounded-full border-2"
                  style={{
                    width: it.size,
                    height: it.size,
                    fontSize: it.size * 0.52,
                    borderColor: it.color,
                    backgroundColor: 'rgba(26,26,26,0.85)',
                    boxShadow: `0 0 ${8 + glow}px ${it.color}, inset 0 0 ${glow * 0.4}px ${it.color}40`,
                    transform: `scale(${scale})`,
                    transition: 'transform 120ms ease, box-shadow 120ms ease',
                  }}
                  animate={isHovered ? { rotate: [0, -8, 8, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <span className="select-none">{it.emoji}</span>
                  {intensity > 0.35 && (
                    <motion.span
                      className="pointer-events-none absolute inset-0 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${it.color}55 0%, transparent 70%)`,
                      }}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1.4 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.span>
                <AnimatePresence>
                  {(isHovered || intensity > 0.5) && (
                    <motion.span
                      className="display-type whitespace-nowrap rounded-[6px] border-2 px-2 py-0.5 text-[10px] tracking-[0.18em]"
                      style={{
                        backgroundColor: it.color,
                        color: '#1a1a1a',
                        borderColor: '#1a1a1a',
                        boxShadow: `3px 3px 0 0 #1a1a1a`,
                      }}
                      initial={{ opacity: 0, y: 6, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.85 }}
                      transition={{ duration: 0.18 }}
                    >
                      {it.name} · {it.tamil}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}

          {/* hovered detail card */}
          <AnimatePresence>
            {hoveredItem && (
              <motion.div
                className="pointer-events-none absolute bottom-4 left-4 z-40 max-w-xs rounded-[10px] border-2 bg-ink p-4 shadow-[6px_6px_0_0_rgb(var(--fb-accent))]"
                style={{ borderColor: hoveredItem.color }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{hoveredItem.emoji}</span>
                  <div>
                    <p className="display-type text-xl text-bone">{hoveredItem.name}</p>
                    <p className="font-body text-sm text-neon">{hoveredItem.tamil}</p>
                    <p className="font-body text-xs text-fog">{hoveredItem.note}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* corner label */}
          <div className="pointer-events-none absolute right-4 top-4 z-40 rotate-[3deg] rounded-[10px] border-2 border-ink bg-neon px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-ink shadow-[4px_4px_0_0_rgb(var(--fb-text))]">
            22 dishes · live
          </div>
        </div>

        {/* legend */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ash">
            Colour key
          </span>
          {Array.from(new Set(ITEMS.map((i) => i.color))).map((c) => (
            <span
              key={c}
              className="h-3 w-3 rounded-full border-2 border-ink"
              style={{ backgroundColor: c, boxShadow: `0 0 8px ${c}` }}
            />
          ))}
          <span className="ml-auto text-[10px] font-bold uppercase tracking-[0.22em] text-ash">
            Move cursor · hover stickers · tap on mobile
          </span>
        </div>
      </div>
    </section>
  )
}
