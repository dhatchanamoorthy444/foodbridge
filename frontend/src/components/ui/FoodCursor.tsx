import { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

const FOODS = ['🥣', '🥞', '🍩', '🍲', '🫕', '☕', '🥘', '🫓', '🧆', '🍜', '🍚', '🥬', '🍮', '🌶️', '🥭', '🥥']

export default function FoodCursor() {
  const [enabled, setEnabled] = useState(false)
  const [emoji, setEmoji] = useState('🥘')
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 280, damping: 26, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 280, damping: 26, mass: 0.4 })
  const trailX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 })
  const trailY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 })
  const idxRef = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return
    setEnabled(true)
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      // occasionally swap emoji
      if (Math.random() < 0.04) {
        idxRef.current = (idxRef.current + 1) % FOODS.length
        setEmoji(FOODS[idxRef.current])
      }
    }
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [x, y])

  if (!enabled) return null

  return (
    <>
      <motion.div
        className="pointer-events-none fixed z-[9999] hidden md:block"
        style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      >
        <span className="text-2xl drop-shadow-[0_0_8px_#E0FF00]">{emoji}</span>
      </motion.div>
      <motion.div
        className="pointer-events-none fixed z-[9998] hidden md:block"
        style={{ x: trailX, y: trailY, translateX: '-50%', translateY: '-50%' }}
      >
        <span className="text-lg opacity-40 blur-[1px]">{emoji}</span>
      </motion.div>
    </>
  )
}
