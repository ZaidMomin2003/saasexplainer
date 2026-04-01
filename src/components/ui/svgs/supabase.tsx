import React from 'react'
import { cn } from '@/lib/utils'

export const SupabaseFull = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("fill-current", className)}>
    <path d="M12 2L3 13h9v9l9-11h-9v-9z" />
  </svg>
)
