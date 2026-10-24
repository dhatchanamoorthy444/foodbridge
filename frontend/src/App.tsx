import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'

// Components
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import CookieConsent from './components/ui/CookieConsent'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import CookiePolicy from './pages/CookiePolicy'
import Dashboard from './pages/Dashboard'
import Inventory from './pages/Inventory'
import Matching from './pages/Matching'
import Pickups from './pages/Pickups'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'

// Store
import useAppStore from './store/useAppStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
    },
  },
})

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const { user, isAuthenticated } = useAppStore()

  // Track cursor for glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#0b1510] relative overflow-x-hidden">
          {/* Cursor glow effect */}
          <div
            className="fixed inset-0 pointer-events-none z-0 cursor-glow"
            style={{
              '--cursor-x': `${cursorPosition.x}px`,
              '--cursor-y': `${cursorPosition.y}px`,
            } as React.CSSProperties}
          />

          {/* Noise texture overlay */}
          <div className="fixed inset-0 pointer-events-none z-0 noise-overlay" />

          <CookieConsent />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#16382a',
                color: '#f5f0e6',
                border: '1px solid #4b8c65',
                borderRadius: '8px',
              },
            }}
          />

          {isAuthenticated ? (
            <div className="flex flex-1">
              {/* Mobile sidebar toggle */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-forest-800 rounded-lg shadow-lg border border-forest-600"
              >
                {isSidebarOpen ? (
                  <X className="w-5 h-5 text-cream" />
                ) : (
                  <Menu className="w-5 h-5 text-cream" />
                )}
              </button>

              {/* Sidebar */}
              <motion.div
                initial={{ x: -260 }}
                animate={{ x: isSidebarOpen ? 0 : -260 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed md:static z-40 h-screen sidebar-width bg-[#0b1510] border-r border-forest-600/30 flex-shrink-0"
              >
                <Sidebar />
              </motion.div>

              {/* Main content */}
              <div className="flex-1 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/matching" element={<Matching />} />
                    <Route path="/pickups" element={<Pickups />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="*" element={<LandingPage />} />
            </Routes>
          )}

          {/* Mobile sidebar backdrop */}
          {isSidebarOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/60 z-30"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
