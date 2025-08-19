'use client'

import { Sidebar } from './sidebar'
import { ChatViewport } from '@/components/chat/chat-viewport'
import { Conversation } from '@/types/chat'

interface AppShellProps {
  conversations?: Conversation[]
  currentConversationId?: string
  showSidebar?: boolean
}

export function AppShell({ 
  conversations = [], 
  currentConversationId,
  showSidebar = true 
}: AppShellProps) {
  const handleNewChat = () => {
    // TODO: Implement new chat logic
    console.log('New chat')
  }

  const handleSelectConversation = (id: string) => {
    // TODO: Implement conversation selection
    console.log('Select conversation:', id)
  }

  const handleDeleteConversation = (id: string) => {
    // TODO: Implement conversation deletion
    console.log('Delete conversation:', id)
  }

  const handlePinConversation = (id: string) => {
    // TODO: Implement conversation pinning
    console.log('Pin conversation:', id)
  }

  return (
    <div className="flex h-screen">
      {showSidebar && (
        <Sidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          onPinConversation={handlePinConversation}
        />
      )}
      
      <div className="flex-1">
        <ChatViewport />
      </div>
    </div>
  )
}

