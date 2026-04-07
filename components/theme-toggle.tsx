'use client'

import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

type Theme = 'light' | 'dark' | 'system'

const NEXT_THEME: Record<Theme, Theme> = {
  light: 'dark',
  dark: 'system',
  system: 'light',
}

const THEME_LABEL: Record<Theme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System',
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch: only render icon after mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const current = (theme as Theme) ?? 'system'
  const next = NEXT_THEME[current]

  const Icon = current === 'light' ? Sun : current === 'dark' ? Moon : Monitor

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={`Switch to ${THEME_LABEL[next]} theme`}
      title={`Theme: ${THEME_LABEL[current]} (click for ${THEME_LABEL[next]})`}
      onClick={() => setTheme(next)}
    >
      {mounted ? <Icon className="size-4" /> : <Sun className="size-4" />}
    </Button>
  )
}
