'use client'

import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BannerProps {
  children: React.ReactNode
  variant?: 'info' | 'warning' | 'success'
  onDismiss?: () => void
  className?: string
}

export function Banner({ children, variant = 'info', onDismiss, className }: BannerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 border rounded-lg",
        {
          "bg-blue-50 border-blue-200 text-blue-800": variant === 'info',
          "bg-yellow-50 border-yellow-200 text-yellow-800": variant === 'warning',
          "bg-green-50 border-green-200 text-green-800": variant === 'success',
        },
        className
      )}
    >
      <div className="flex-1">{children}</div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="h-6 w-6 ml-2"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

