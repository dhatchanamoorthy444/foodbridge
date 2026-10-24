"use client"

import React from 'react'
import { cn } from '../lib/utils'

// Typography Styles that adhere to the UI/UX design constraints

// Import the CSS file for styles
import '../components/ui/Typography.css'

export const Typography = {
  // Headings - using serif font as per design constraints
  H1: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h1 className={cn('text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-cream tracking-tight', className)}>
      {children}
    </h1>
  ),

  H2: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h2 className={cn('text-3xl md:text-4xl font-serif font-semibold text-cream tracking-tight', className)}>
      {children}
    </h2>
  ),

  H3: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h3 className={cn('text-2xl md:text-3xl font-serif font-semibold text-cream tracking-tight', className)}>
      {children}
    </h3>
  ),

  H4: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h4 className={cn('text-xl md:text-2xl font-serif font-medium text-cream tracking-tight', className)}>
      {children}
    </h4>
  ),

  H5: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h5 className={cn('text-lg md:text-xl font-serif font-medium text-cream tracking-tight', className)}>
      {children}
    </h5>
  ),

  H6: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <h6 className={cn('text-base md:text-lg font-serif font-medium text-cream tracking-tight', className)}>
      {children}
    </h6>
  ),

  // Body text - using clean sans-serif with proper line height
  Body: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <p className={cn('text-sm md:text-base font-sans text-stone leading-relaxed', className)}>
      {children}
    </p>
  ),

  BodyLarge: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <p className={cn('text-base md:text-lg font-sans text-stone leading-relaxed', className)}>
      {children}
    </p>
  ),

  BodySmall: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <p className={cn('text-xs md:text-sm font-sans text-stone leading-relaxed', className)}>
      {children}
    </p>
  ),

  // UI-specific typography components
  Caption: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={cn('text-xs font-sans text-stone uppercase tracking-wider', className)}>
      {children}
    </span>
  ),

  Overline: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={cn('text-xs font-mono text-stone uppercase tracking-widest', className)}>
      {children}
    </span>
  ),

  // Lists with custom styling (addressing constraint 16)
  List: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <ul className={cn('custom-list space-y-3', className)}>
      {children}
    </ul>
  ),

  ListItem: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <li className={cn('flex items-start gap-3 text-stone', className)}>
      {children}
    </li>
  ),
}

export default Typography