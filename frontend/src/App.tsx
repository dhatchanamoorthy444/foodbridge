import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import { SessionBridge } from './hooks/SessionBridge'
import { CookieConsent } from './components/ui/CookieConsent'
import { CursorGlow } from './components/ui/CursorGlow'
import { LoadingSpinner } from './components/ui/Feedback'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import CookiePolicy from './pages/CookiePolicy'
import RefundPolicy from './pages/RefundPolicy'
import Home from './pages/Home'
import DonorDashboard from './pages/DonorDashboard'
import DonationForm from './pages/DonationForm'
import BrowseDonations from './pages/BrowseDonations'
import DonationDetail from './pages/DonationDetail'
import MyRequests from './pages/MyRequests'
import Pickups from './pages/Pickups'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import LandingPage from './pages/LandingPage'

import useAppStore from './store/useAppStore'
import type { AppRole } from './types/api'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Helper to determine role-based home landing
function getRoleHome(role?: AppRole): string {
  if (role === 'donor') return '/donor'
  if (role === 'recipient') return '/browse'
  if (role === 'admin') return '/donor'
  return '/'
}

// ── Protected Route: only authenticated users allowed ──
function ProtectedRoute({ role }: { role?: AppRole }) {
  const user = useAppStore((s) => s.user)
  const isSessionReady = useAppStore((s) => s.isSessionReady)
  const location = useLocation()

  if (!isSessionReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#090B09]">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner />
          <span className="font-mono text-xs uppercase tracking-widest text-[#D7EF4A]">
            Verifying Security Session...
          </span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user.role !== role && user.role !== 'admin') {
    return <Navigate to={getRoleHome(user.role)} replace />
  }

  return <Outlet />
}

// ── Public Only Route: redirects authenticated users away from Login / Register ──
function PublicOnlyRoute() {
  const user = useAppStore((s) => s.user)
  const isSessionReady = useAppStore((s) => s.isSessionReady)

  if (!isSessionReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#090B09]">
        <LoadingSpinner />
      </div>
    )
  }

  if (user) {
    return <Navigate to={getRoleHome(user.role)} replace />
  }

  return <Outlet />
}

function AuthenticatedAppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const user = useAppStore((s) => s.user)

  useEffect(() => {
    if (window.innerWidth >= 768) setIsSidebarOpen(true)
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!user) return null

  return (
    <div className="flex flex-1 min-h-screen bg-[#090B09] text-white">
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
              className="md:hidden fixed inset-0 bg-black/80 z-30"
              onClick={() => setIsSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen((v) => !v)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-[#090B09]">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function RootRedirect() {
  const user = useAppStore((s) => s.user)
  const isSessionReady = useAppStore((s) => s.isSessionReady)

  if (!isSessionReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#090B09]">
        <LoadingSpinner />
      </div>
    )
  }

  // If authenticated, send to their role command hub. Otherwise render the public LandingPage!
  if (user) {
    return <Navigate to={getRoleHome(user.role)} replace />
  }

  return <LandingPage />
}

function ErrorFallback({ error, resetErrorBoundary }: { error?: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-[#090B09] text-white">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-[#858C84] mb-6 max-w-md text-center">
        {error?.message || 'An unexpected error occurred. Please refresh and try again.'}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-5 py-2 rounded-lg bg-[#D7EF4A] text-[#090B09] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#E8F5A4] transition-colors"
      >
        Try again
      </button>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <SessionBridge>
          <div className="relative min-h-dvh flex flex-col bg-[#090B09] text-white">
            <CursorGlow />
            <CookieConsent />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#131713',
                  color: '#F6F7F2',
                  border: '1px solid #262E26',
                  borderRadius: '12px',
                  boxShadow: '0 12px 32px -4px rgba(0,0,0,0.65)',
                },
              }}
            />

            <ErrorBoundary fallback={<ErrorFallback />}>
              <Routes>
                {/* Public Root: shows LandingPage for guests, redirects authenticated users to their dashboard */}
                <Route path="/" element={<RootRedirect />} />

                {/* Public Information Pages */}
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/cookies" element={<CookiePolicy />} />
                <Route path="/refund" element={<RefundPolicy />} />

                {/* Public Only Auth Pages (Auto-redirect if already logged in) */}
                <Route element={<PublicOnlyRoute />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                {/* Authenticated Workspace App Layout with Sidebar & Navbar */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AuthenticatedAppLayout />}>
                    {/* Shared across authenticated users */}
                    <Route path="/hub" element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/pickups" element={<Pickups />} />

                    {/* Donor & Admin Area */}
                    <Route element={<ProtectedRoute role="donor" />}>
                      <Route path="/donor" element={<DonorDashboard />} />
                      <Route path="/donor/new" element={<DonationForm />} />
                      <Route path="/donor/:id/edit" element={<DonationForm />} />
                      <Route path="/donations/:id/requests" element={<DonorDashboard />} />
                    </Route>

                    {/* Recipient / NGO Area */}
                    <Route element={<ProtectedRoute role="recipient" />}>
                      <Route path="/browse" element={<BrowseDonations />} />
                      <Route path="/browse/:id" element={<DonationDetail />} />
                      <Route path="/donation/:id" element={<DonationDetail />} />
                      <Route path="/my-requests" element={<MyRequests />} />
                    </Route>
                  </Route>
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </div>
        </SessionBridge>
      </Router>
    </QueryClientProvider>
  )
}

export default App
