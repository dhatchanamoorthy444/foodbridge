import { lazy, Suspense, useEffect, useState } from 'react'

const FoodEcosystem = lazy(() => import('./FoodEcosystem'))

function webglAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
    )
  } catch {
    return false
  }
}

type Mode = 'loading' | '3d' | 'static'

/**
 * Lazy WebGL hero with graceful fallbacks:
 * - static DOM illustration when WebGL is unavailable
 * - static fallback for prefers-reduced-motion users
 * - no 3D code is fetched unless the browser can render it
 */
export default function HeroCanvas() {
  const [mode, setMode] = useState<Mode>('loading')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!webglAvailable() || reduced) {
      setMode('static')
    } else {
      setMode('3d')
    }
  }, [])

  return (
    <div className="relative h-[300px] sm:h-[380px] lg:h-[520px] w-full" aria-hidden="true">
      <div className="absolute inset-0 rounded-[2rem] border border-line bg-gradient-to-b from-elevated via-panel to-app-deep" />
      <div
        className="absolute inset-0 rounded-[2rem]"
        style={{
          background:
            'radial-gradient(62% 62% at 50% 42%, rgba(183,217,106,0.10) 0%, rgba(16,60,45,0.0) 62%)',
        }}
      />

      {mode === '3d' && (
        <div className="absolute inset-0 p-2">
          <Suspense fallback={<StaticHero />}>
            <FoodEcosystem />
          </Suspense>
        </div>
      )}

      {mode !== '3d' && <StaticHero />}
    </div>
  )
}

function StaticHero() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative">
        <div
          className="absolute -inset-10 rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(183,217,106,0.16) 0%, rgba(16,60,45,0) 65%)',
          }}
        />
        <img
          src="/stickers/cream/01_brand_and_donation/donate_food.png"
          alt=""
          className="relative h-64 w-64 sm:h-80 sm:w-80 object-contain drop-shadow-[0_24px_48px_rgba(5,8,7,0.7)]"
          loading="eager"
        />
      </div>
    </div>
  )
}
