"use client"

import React, { useState } from 'react'
import { cn } from '../lib/utils'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
  icon?: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultActive?: string
  className?: string
  variant?: 'default' | 'pills'
}

export function Tabs({ tabs, defaultActive, className, variant = 'default' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultActive || tabs[0]?.id)

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Navigation */}
      <div className={cn(
        'flex space-x-2 pb-4',
        variant === 'pills' && 'gap-2'
      )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2',
              activeTab === tab.id
                ? variant === 'default'
                  ? 'bg-botanical/20 text-cream border border-botanical/40'
                  : 'bg-botanical text-cream'
                : 'text-stone hover:text-cream hover:bg-forest-800/40'
            )}
          >
            {tab.icon && <span className="text-lg">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTabContent}
      </div>
    </div>
  )
}