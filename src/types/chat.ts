export interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: any
  tokens?: number
  createdAt: Date
}

export interface Conversation {
  id: string
  title: string
  pinned: boolean
  createdAt: Date
  updatedAt: Date
  messages: Message[]
}

export interface LegalMode {
  id: string
  name: string
  description: string
  prompt: string
  icon: string
}

