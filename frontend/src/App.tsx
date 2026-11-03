import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

// Components
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import { CookieConsent } from './components/ui/CookieConsent'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import CookiePolicy from './pages/CookiePolicy'
import RefundPolicy from './pages/RefundPolicy'
import Home from './pages/Home'
import DonorDashboard from './pages/DonorDashboard'
import Inventory from './pages/Inventory'
import Matching from './pages/Matching'
import Pickups from './pages/Pickups'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from './pages/LandingPage'

// Store
import useAppStore from './store/useAppStore'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
})

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { isAuthenticated } = useAppStore()

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true)
    }
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen flex flex-col bg-surface text-on-surface">
          <CookieConsent />

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#141614',
                color: '#ffffff',
                border: '1px solid rgba(223,255,0,0.25)',
                borderRadius: '8px',
                boxShadow: '0 12px 32px -4px rgba(0,0,0,0.55)',
              },
            }}
          />

          {isAuthenticated ? (
            <div className="flex flex-1 min-h-screen">
              {/* Sidebar — static on desktop, drawer on mobile */}
              <AnimatePresence>
                {isSidebarOpen && (
                  <>
                    <motion.div
                      initial={{ x: -280 }}
                      animate={{ x: 0 }}
                      exit={{ x: -280 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="fixed md:static z-40 h-screen w-[260px] flex-shrink-0"
                    >
                      <Sidebar />
                    </motion.div>
                    <div
                      className="md:hidden fixed inset-0 bg-inverse-surface/40 z-30"
                      onClick={() => setIsSidebarOpen(false)}
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Main content */}
              <div className="flex-1 flex flex-col min-h-screen min-w-0">
                <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-surface">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/donor" element={<DonorDashboard />} />
                    <Route path="/inventory" element={<DonorDashboard />} />
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
              <Route path="/register" element={<Register />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route path="/refund" element={<RefundPolicy />} />
              <Route path="*" element={<LandingPage />} />
            </Routes>
          )}
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
