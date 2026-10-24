"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export function MobileMenu({ isOpen, onClose, children, className }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
          className={cn('fixed inset-y-0 right-0 z-50 w-full bg-surface-elevated', 'md:hidden', className)}
        >
          <div className="flex flex-col h-full p-6">
            <div className="flex justify-end mb-8">
              <button
                onClick={onClose}
                className="p-2 text-stone hover:text-cream hover:bg-forest-800/40 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}