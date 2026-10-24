"use client"

import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { cn } from '../lib/utils'

interface SidebarProps {
  items: Array<{ path: string; label: string; icon: React.ReactNode }>
  className?: string
}

export function Sidebar({ items, className }: SidebarProps) {
  return (
    <nav className={cn('flex flex-col gap-2', className)}>
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
              isActive
                ? 'bg-botanical/20 text-cream border border-botanical/40'
                : 'text-stone hover:text-cream hover:bg-forest-800/40'
            )
          }
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}