import { useEffect, useRef, useState } from 'react'

interface CursorGlowProps {
  size?: number
  className?: string
}

/**
 * A single compositor-friendly ambient light that follows the pointer.
 * It updates a transform via requestAnimationFrame, never React state,
 * and is disabled on touch devices and for reduced-motion users.
 */
export function CursorGlow({ size = 720, className }: CursorGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const finePointer = window.matchMedia('(pointer: fine)')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const canAnimate = () =>
      finePointer.matches && !reducedMotion.matches && window.innerWidth >= 768

    setEnabled(canAnimate())

    const onChange = () => setEnabled(canAnimate())
    finePointer.addEventListener('change', onChange)
    reducedMotion.addEventListener('change', onChange)
    window.addEventListener('resize', onChange)

    return () => {
      finePointer.removeEventListener('change', onChange)
      reducedMotion.removeEventListener('change', onChange)
      window.removeEventListener('resize', onChange)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const node = glowRef.current
    if (!node) return

    let frame = 0
    let currentX = window.innerWidth / 2
    let currentY = window.innerHeight * 0.35
    let targetX = currentX
    let targetY = currentY
    let lastX = Number.NaN
    let lastY = Number.NaN

    const render = () => {
      const dx = targetX - currentX
      const dy = targetY - currentY
      currentX += dx * 0.12
      currentY += dy * 0.12

      node.style.transform = `translate3d(${currentX - size / 2}px, ${currentY - size / 2}px, 0)`

      if (Math.abs(dx) > 0.25 || Math.abs(dy) > 0.25) {
        frame = requestAnimationFrame(render)
      } else {
        currentX = targetX
        currentY = targetY
        node.style.transform = `translate3d(${currentX - size / 2}px, ${currentY - size / 2}px, 0)`
        frame = 0
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const x = event.clientX
      const y = event.clientY
      if (Math.abs(x - lastX) < 1 && Math.abs(y - lastY) < 1) return
      lastX = x
      lastY = y
      targetX = x
      targetY = y
      if (!frame) frame = requestAnimationFrame(render)
    }

    node.style.transform = `translate3d(${currentX - size / 2}px, ${currentY - size / 2}px, 0)`
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [enabled, size])

  if (!enabled) return null

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-0 rounded-full ${className ?? ''}`}
      style={{
        width: size,
        height: size,
        background:
          'radial-gradient(circle, rgba(47,107,74,0.18) 0%, rgba(47,107,74,0.07) 42%, rgba(47,107,74,0) 70%)',
        opacity: 0.9,
        willChange: 'transform',
      }}
    />
  )
}
