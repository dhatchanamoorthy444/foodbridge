"use client"

import React from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '../lib/utils'

interface NavigationItemProps {
  to: string
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function NavigationItem({ to, label, icon, onClick, className }: NavigationItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
          'text-stone hover:text-cream hover:bg-forest-800/40',
          isActive && 'bg-botanical/20 text-cream border border-botanical/40',
          className
        )
      }
      onClick={onClick}
    >
      {icon && <span className="text-stone">{icon}</span>}
      <span className="font-medium">{label}</span>
    </NavLink>
  )
}