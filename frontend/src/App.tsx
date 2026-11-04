import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import { SessionBridge } from './hooks/SessionBridge'
import { CookieConsent } from './components/ui/CookieConsent'
import { CursorGlow } from './components/ui/CursorGlow'
import { LoadingSpinner } from './components/ui/Feedback'
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function ProtectedRoute({ role }: { role?: 'donor' | 'recipient' }) {
  const user = useAppStore((s) => s.user)
  const isSessionReady = useAppStore((s) => s.isSessionReady)
  if (!isSessionReady) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return <Outlet />
}

function AppShell() {
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
    <div className="flex flex-1">
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
              className="md:hidden fixed inset-0 bg-app-deep/70 z-30"
              onClick={() => setIsSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen((v) => !v)} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-app">
          <Routes>
            {/* Shared workspace */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/pickups" element={<Pickups />} />
            </Route>

            {/* Donor */}
            <Route element={<ProtectedRoute role="donor" />}>
              <Route path="/donor" element={<DonorDashboard />} />
              <Route path="/donor/new" element={<DonationForm />} />
              <Route path="/donor/:id/edit" element={<DonationForm />} />
              <Route path="/donations/:id/requests" element={<DonorDashboard />} />
            </Route>

            {/* Recipient */}
            <Route element={<ProtectedRoute role="recipient" />}>
              <Route path="/browse" element={<BrowseDonations />} />
              <Route path="/browse/:id" element={<DonationDetail />} />
              <Route path="/donation/:id" element={<DonationDetail />} />
              <Route path="/my-requests" element={<MyRequests />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <SessionBridge />
        <div className="relative min-h-dvh flex flex-col bg-app text-text">
          <CursorGlow />
          <CookieConsent />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#191E1A',
                color: '#F2F0E8',
                border: '1px solid #343C35',
                borderRadius: '8px',
                boxShadow: '0 12px 32px -4px rgba(0,0,0,0.55)',
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
          <AppShell />
        </div>
      </Router>
    </QueryClientProvider>
  )
}

export default App
