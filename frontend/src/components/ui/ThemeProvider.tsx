"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface Theme {
  name: string
  colors: {
    primary: string
    primaryLight: string
    primaryDark: string
    background: string
    surface: string
    surfaceElevated: string
    text: string
    textSecondary: string
    textTertiary: string
    border: string
    success: string
    warning: string
    danger: string
    info: string
    botanical: string
    botanicalLight: string
    botanicalDark: string
    forest: string
    forestLight: string
    forestDark: string
    cream: string
    olive: string
  }
}

const themes: Record<string, Theme> = {
  forest: {
    name: 'forest',
    colors: {
      primary: '#2d5a3c',
      primaryLight: '#4b8c65',
      primaryDark: '#1a4731',
      background: '#0b1510',
      surface: '#0f291e',
      surfaceElevated: '#16382a',
      text: '#f5f0e6',
      textSecondary: '#e8e2d5',
      textTertiary: '#d6cebd',
      border: '#2d5a3c',
      success: '#4b5e40',
      warning: '#eab308',
      danger: '#ef4444',
      info: '#3b82f6',
      botanical: '#3b6e4f',
      botanicalLight: '#4b8c65',
      botanicalDark: '#2c523b',
      forest: '#0f291e',
      forestLight: '#16382a',
      forestDark: '#0a1f10',
      cream: '#f5f0e6',
      olive: '#4b5e40',
    }
  },
  earth: {
    name: 'earth',
    colors: {
      primary: '#5d4e37',
      primaryLight: '#7d6f57',
      primaryDark: '#3d2e1f',
      background: '#1a1611',
      surface: '#2d2419',
      surfaceElevated: '#3e2e20',
      text: '#f5f0e6',
      textSecondary: '#e8e2d5',
      textTertiary: '#d6cebd',
      border: '#5d4e37',
      success: '#5e7d4a',
      warning: '#d97706',
      danger: '#dc2626',
      info: '#2563eb',
      botanical: '#6d5e4b',
      botanicalLight: '#8a7964',
      botanicalDark: '#54493b',
      forest: '#1a1611',
      forestLight: '#2d2419',
      forestDark: '#0f0b08',
      cream: '#f5f0e6',
      olive: '#5d4e37',
    }
  },
  sage: {
    name: 'sage',
    colors: {
      primary: '#3d5f4f',
      primaryLight: '#5a7f71',
      primaryDark: '#2a4f40',
      background: '#0a1412',
      surface: '#0e1d18',
      surfaceElevated: '#114c3c',
      text: '#f0f7f4',
      textSecondary: '#e1efe9',
      textTertiary: '#d2e9df',
      border: '#3d5f4f',
      success: '#3a7467',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#60a5fa',
      botanical: '#3d5f4f',
      botanicalLight: '#5a7f71',
      botanicalDark: '#2a4f40',
      forest: '#0e1d18',
      forestLight: '#114c3c',
      forestDark: '#072a1a',
      cream: '#f0f7f4',
      olive: '#3d5f4f',
    }
  }
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: string
}

export function ThemeProvider({ children, defaultTheme = 'forest' }: ThemeProviderProps) {
  const [themeName, setThemeName] = useState(defaultTheme)

  const theme = themes[themeName] || themes.forest

  const setTheme = (themeName: string) => {
    setThemeName(themeName)
    localStorage.setItem('foodbridge-theme', themeName)
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem('foodbridge-theme')
    if (storedTheme && themes[storedTheme]) {
      setThemeName(storedTheme)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const colors = theme.colors

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    if (theme.name === 'forest') {
      root.style.setProperty('--bg-primary', colors.background)
      root.style.setProperty('--bg-surface', colors.surface)
      root.style.setProperty('--bg-surface-elevated', colors.surfaceElevated)
      root.style.setProperty('--text-primary', colors.text)
      root.style.setProperty('--text-secondary', colors.textSecondary)
      root.style.setProperty('--text-tertiary', colors.textTertiary)
      root.style.setProperty('--border-color', colors.border)
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider