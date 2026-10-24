import { useState, useRef, Suspense } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float, Environment } from '@react-three/drei'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Users,
  Package,
  Truck,
  Shield,
  Clock,
  Heart,
  ChevronRight,
  Star,
  Play,
  Sparkles,
} from 'lucide-react'
import * as THREE from 'three'
import { useAppStore } from '../store/useAppStore'

// 3D Organic Food Models
function OrganicFoodModel({ position, color, shape = 'box', delay = 0 }: { position: [number, number, number]; color: string; shape?: 'box' | 'sphere' | 'cylinder'; delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5 + delay) * 0.25
    }
  })

  return (
    <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.6}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.25 : 1}
        castShadow
      >
        {shape === 'sphere' ? (
          <sphereGeometry args={[0.7, 32, 32]} />
        ) : shape === 'cylinder' ? (
          <cylinderGeometry args={[0.5, 0.6, 1.2, 32]} />
        ) : (
          <boxGeometry args={[1, 1, 1]} />
        )}
        <meshStandardMaterial
          color={color}
          metalness={0.2}
          roughness={0.3}
          emissive={color}
          emissiveIntensity={hovered ? 0.35 : 0.15}
        />
      </mesh>
    </Float>
  )
}

// Floating Eco Particles
function EcoParticles({ count = 80 }: { count?: number }) {
  const points = useRef<THREE.Points>(null)

  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 18
    positions[i * 3 + 1] = (Math.random() - 0.5) * 18
    positions[i * 3 + 2] = (Math.random() - 0.5) * 18
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.04
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#4b8c65" transparent opacity={0.7} />
    </points>
  )
}

// Hero 3D Scene
function HeroScene() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
      <pointLight position={[-6, -6, -6]} intensity={0.6} color="#f97316" />

      <OrganicFoodModel position={[-2.8, 0.5, 0]} color="#22c55e" shape="sphere" delay={0} />
      <OrganicFoodModel position={[2.8, 1, -1.5]} color="#f97316" shape="box" delay={1.2} />
      <OrganicFoodModel position={[0, -1.8, 1.5]} color="#eab308" shape="cylinder" delay={2.4} />
      <OrganicFoodModel position={[-1.5, 2, -1]} color="#3b82f6" shape="box" delay={3.6} />

      <EcoParticles count={90} />

      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} />
      <Environment preset="city" />
    </>
  )
}

// Feature Card component conforming to Earthy & Inspo guidelines
function InspoFeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType
  title: string
  description: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-[#12241b] border border-forest-600/40 p-6 rounded-2xl hover:border-botanical-light/60 transition-all duration-300 group shadow-lg relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-botanical/5 rounded-full blur-2xl group-hover:bg-botanical/15 transition-all" />
      <div className="w-12 h-12 rounded-xl bg-botanical/20 border border-botanical/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-botanical-light" />
      </div>
      <h3 className="text-xl font-serif text-cream mb-2">{title}</h3>
      <p className="text-stone text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const { login } = useAppStore()
  const [isLoading, setIsLoading] = useState(false)

  const handleQuickLogin = async (role: 'donor' | 'recipient' | 'admin') => {
    setIsLoading(true)
    const demoUser = {
      id: '1',
      email: `${role}@foodbridge.demo`,
      fullName: role.charAt(0).toUpperCase() + role.slice(1) + ' Representative',
      role: role as 'donor' | 'recipient' | 'admin',
      status: 'active' as const,
      organization: role === 'donor' ? 'Green Valley Groceries' : role === 'recipient' ? 'Community Hope Shelter' : 'Central Admin Authority',
      createdAt: new Date(),
    }
    setTimeout(() => {
      login(demoUser)
      navigate('/')
    }, 400)
  }

  const features = [
    {
      icon: Package,
      title: 'Real-Time Expiry Monitoring',
      description: 'Advanced batch tracking with predictive shelf-life alerts to prevent edible surplus from becoming waste.',
    },
    {
      icon: Users,
      title: 'Equitable AI Matching',
      description: 'Intelligent allocation matrix balancing dietary needs, logistics radius, and volumetric urgency.',
    },
    {
      icon: Truck,
      title: 'Synchronized Transit Nodes',
      description: 'Coordinated pickup scheduling with live status handshakes and verification codes.',
    },
    {
      icon: Shield,
      title: 'Uncompromising Compliance',
      description: 'Built-in GDPR data minimization, robust audit trails, and strict WCAG 2.2 AA accessibility standards.',
    },
    {
      icon: Clock,
      title: 'Instant Alert Protocols',
      description: 'Immediate multi-channel notifications for critical surplus listings and expiring inventories.',
    },
    {
      icon: Heart,
      title: 'Measurable Carbon Impact',
      description: 'Quantify diverted tonnage and carbon offset metrics through transparent analytics dashboards.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0b1510] text-cream relative overflow-hidden font-sans">
      {/* Background ambient lighting and noise */}
      <div className="fixed inset-0 pointer-events-none noise-overlay z-0" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-botanical/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5 border-b border-forest-600/30 backdrop-blur-md bg-[#0b1510]/80 sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-botanical flex items-center justify-center shadow-lg border border-forest-600/50">
            <Heart className="w-5 h-5 text-cream" />
          </div>
          <div>
            <span className="font-serif font-bold text-lg text-cream tracking-wide">FoodBridge</span>
            <span className="block text-[10px] text-stone uppercase tracking-widest font-mono">Surplus Resilience</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-stone hover:text-cream text-sm transition-colors font-medium px-4 py-2"
          >
            Sign In
          </button>
          <Link
            to="/login"
            className="btn-primary text-sm py-2 px-5 shadow-lg"
          >
            Launch Platform <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section with Interactive 3D Canvas */}
      <section className="relative z-20 px-6 md:px-12 pt-12 pb-24 min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-800/80 border border-botanical/40 text-botanical-light text-xs font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen Food Surplus Redistribution
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-cream leading-[1.15]"
            >
              Bridging Edible Abundance with{' '}
              <span className="text-botanical-light italic">Community Need.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-stone text-base md:text-lg max-w-xl leading-relaxed"
            >
              An enterprise-grade ecosystem integrating real-time expiry monitoring, concurrent allocations, and zero-waste logistics powered by immersive spatial intelligence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <Link to="/login" className="btn-primary text-base py-3.5 px-8 justify-center shadow-xl">
                Get Started Now <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleQuickLogin('donor')}
                className="btn-secondary text-base py-3.5 px-6 justify-center border-forest-600/60 hover:bg-forest-800/60"
              >
                <Play className="w-4 h-4 text-botanical-light" /> Live Demo Mode
              </button>
            </motion.div>

            {/* Quick Demo Access Bar */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-forest-600/30 flex flex-wrap items-center gap-3"
            >
              <span className="text-xs font-mono uppercase tracking-wider text-stone">Instant Role Switch:</span>
              <button
                onClick={() => handleQuickLogin('donor')}
                disabled={isLoading}
                className="px-3 py-1.5 rounded bg-forest-800 hover:bg-forest-700 text-cream text-xs font-medium border border-forest-600/40 transition-colors"
              >
                Donor Portal
              </button>
              <button
                onClick={() => handleQuickLogin('recipient')}
                disabled={isLoading}
                className="px-3 py-1.5 rounded bg-forest-800 hover:bg-forest-700 text-cream text-xs font-medium border border-forest-600/40 transition-colors"
              >
                Recipient Portal
              </button>
              <button
                onClick={() => handleQuickLogin('admin')}
                disabled={isLoading}
                className="px-3 py-1.5 rounded bg-forest-800 hover:bg-forest-700 text-cream text-xs font-medium border border-forest-600/40 transition-colors"
              >
                Admin Authority
              </button>
            </motion.div>
          </div>

          {/* Right 3D Interactive Canvas Column */}
          <div className="lg:col-span-5 h-[420px] md:h-[500px] relative rounded-3xl bg-[#0f291e]/60 border border-forest-600/40 shadow-2xl overflow-hidden backdrop-blur-md">
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded bg-[#0b1510]/80 border border-forest-600/50 text-[11px] font-mono uppercase tracking-wider text-botanical-light">
              Interactive 3D Spatial Matrix
            </div>
            <Canvas camera={{ position: [0, 2, 6], fov: 45 }}>
              <Suspense fallback={null}>
                <HeroScene />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="relative z-20 px-6 md:px-12 py-24 bg-[#0f291e]/30 border-t border-forest-600/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-cream mb-4">
              Architected for Absolute Efficiency
            </h2>
            <p className="text-stone text-sm">
              Engineered with modern full-stack resilience, real-time concurrency guards, and strict legal compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <InspoFeatureCard key={feature.title} {...feature} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / Impact Section */}
      <section className="relative z-20 px-6 md:px-12 py-24">
        <div className="max-w-5xl mx-auto bg-[#12241b] border border-forest-600/40 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-botanical/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-warning-400 fill-warning-400" />
              ))}
            </div>
            <blockquote className="font-serif text-2xl md:text-3xl text-cream mb-6 leading-snug">
              "FoodBridge transformed our surplus inventory workflow. We diverted over 14 tons of edible produce in our first quarter alone with zero logistical friction."
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-botanical flex items-center justify-center text-cream font-bold text-base border border-forest-600/60">
                SJ
              </div>
<div>
                <p className="font-semibold text-cream">Sarah Johnson</p>
                <p className="text-xs text-stone uppercase tracking-wider">Director, Metropolitan Food Coalition</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="relative z-20 px-6 md:px-12 py-20 border-t border-forest-600/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-serif text-cream">
            Ready to Eliminate Surplus Waste?
          </h2>
          <p className="text-stone text-base max-w-xl mx-auto">
            Join the movement toward sustainable food redistribution. Fully compliant, secure, and ready for deployment.
          </p>
          <div className="pt-4">
            <Link to="/login" className="btn-primary text-base py-3.5 px-8 inline-flex items-center gap-2 shadow-xl">
              Access Platform Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 px-6 md:px-12 py-10 border-t border-forest-600/30 bg-[#0b1510]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-stone">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-botanical flex items-center justify-center">
              <Heart className="w-4 h-4 text-cream" />
            </div>
            <span className="font-serif font-semibold text-cream text-sm">FoodBridge</span>
          </div>
          <div className="flex flex-wrap gap-6 font-mono uppercase tracking-wider">
            <Link to="/privacy" className="hover:text-cream transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-cream transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-cream transition-colors">Cookie Policy</Link>
          </div>
          <p>© 2026 FoodBridge Resilience System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
