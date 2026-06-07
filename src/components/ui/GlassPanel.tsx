import type { ReactNode } from 'react'
import '../../styles/glass.css'

interface GlassPanelProps {
  children: ReactNode
  className?: string
}

export function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return <section className={`glass-panel ${className}`.trim()}>{children}</section>
}
