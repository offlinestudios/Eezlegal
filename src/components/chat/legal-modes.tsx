'use client'

import { Button } from '@/components/ui/button'
import { LegalMode } from '@/types/chat'
import { FileText, Scale, Handshake, MessageSquare } from 'lucide-react'

const legalModes: LegalMode[] = [
  {
    id: 'plain-english',
    name: 'Plain English',
    description: 'Translate complex legal docs',
    prompt: 'You are a legal expert who specializes in translating complex legal documents into plain English that anyone can understand.',
    icon: 'MessageSquare'
  },
  {
    id: 'document-generator',
    name: 'Document Generator',
    description: 'Create professional legal docs',
    prompt: 'You are a legal document expert who helps create professional legal documents, contracts, and agreements.',
    icon: 'FileText'
  },
  {
    id: 'dispute-resolution',
    name: 'Dispute Resolution',
    description: 'Recover what you\'re owed',
    prompt: 'You are a dispute resolution expert who helps people understand their rights and options for resolving legal disputes.',
    icon: 'Scale'
  },
  {
    id: 'deal-advisor',
    name: 'Deal Advisor',
    description: 'Get suggestions to win every deal',
    prompt: 'You are a deal advisor who provides strategic advice on negotiations, contracts, and business transactions.',
    icon: 'Handshake'
  }
]

const iconMap = {
  MessageSquare,
  FileText,
  Scale,
  Handshake
}

interface LegalModesProps {
  onSelectMode: (mode: LegalMode) => void
}

export function LegalModes({ onSelectMode }: LegalModesProps) {
  return (
    <div className="max-w-3xl mx-auto w-full px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">What can I help with?</h1>
        <p className="text-muted-foreground">Choose a legal assistance mode to get started</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {legalModes.map((mode) => {
          const Icon = iconMap[mode.icon as keyof typeof iconMap]
          return (
            <Button
              key={mode.id}
              variant="outline"
              className="h-auto p-6 flex flex-col items-start text-left hover:bg-accent transition-colors"
              onClick={() => onSelectMode(mode)}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className="h-5 w-5 text-primary" />
                <span className="font-semibold">{mode.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">{mode.description}</p>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

