'use client'

import { Button } from '@/components/ui/button'
import { Banner } from '@/components/ui/banner'
import { Crown, MessageSquare } from 'lucide-react'

interface NudgeBannerProps {
  type: 'signup' | 'upgrade' | 'quota'
  onAction: () => void
  onDismiss: () => void
}

export function NudgeBanner({ type, onAction, onDismiss }: NudgeBannerProps) {
  const getContent = () => {
    switch (type) {
      case 'signup':
        return {
          icon: <MessageSquare className="h-4 w-4" />,
          text: 'Save this conversation and unlock unlimited access',
          actionText: 'Create free account',
          variant: 'info' as const
        }
      case 'upgrade':
        return {
          icon: <Crown className="h-4 w-4" />,
          text: 'Unlock unlimited messages and file uploads with EezLegal Plus',
          actionText: 'Upgrade now',
          variant: 'warning' as const
        }
      case 'quota':
        return {
          icon: <Crown className="h-4 w-4" />,
          text: 'You\'re approaching your daily message limit. Upgrade for unlimited access.',
          actionText: 'Upgrade to Plus',
          variant: 'warning' as const
        }
      default:
        return null
    }
  }

  const content = getContent()
  if (!content) return null

  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-2">
      <Banner variant={content.variant} onDismiss={onDismiss}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {content.icon}
            <span className="text-sm">{content.text}</span>
          </div>
          <Button 
            size="sm" 
            onClick={onAction}
            className="ml-4 flex-shrink-0"
          >
            {content.actionText}
          </Button>
        </div>
      </Banner>
    </div>
  )
}

