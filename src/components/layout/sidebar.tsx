'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Conversation } from '@/types/chat'
import { Plus, Search, MessageSquare, Pin, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  conversations?: Conversation[]
  currentConversationId?: string
  onNewChat: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation?: (id: string) => void
  onPinConversation?: (id: string) => void
}

export function Sidebar({ 
  conversations = [], 
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  onPinConversation
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pinnedConversations = filteredConversations.filter(conv => conv.pinned)
  const unpinnedConversations = filteredConversations.filter(conv => !conv.pinned)

  return (
    <div className="w-64 bg-muted/30 border-r flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">E</span>
          </div>
          <span className="font-semibold">EezLegal</span>
        </div>
        
        <Button 
          onClick={onNewChat}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chats"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {pinnedConversations.length > 0 && (
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Pinned</div>
            {pinnedConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === currentConversationId}
                onSelect={() => onSelectConversation(conversation.id)}
                onPin={() => onPinConversation?.(conversation.id)}
                onDelete={() => onDeleteConversation?.(conversation.id)}
              />
            ))}
          </div>
        )}

        <div className="p-2">
          {pinnedConversations.length > 0 && (
            <div className="text-xs font-medium text-muted-foreground mb-2 px-2">Recent</div>
          )}
          {unpinnedConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={conversation.id === currentConversationId}
              onSelect={() => onSelectConversation(conversation.id)}
              onPin={() => onPinConversation?.(conversation.id)}
              onDelete={() => onDeleteConversation?.(conversation.id)}
            />
          ))}
        </div>

        {filteredConversations.length === 0 && (
          <div className="p-4 text-center text-muted-foreground text-sm">
            {searchQuery ? 'No conversations found' : 'No conversations yet'}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground text-xs">U</span>
          </div>
          <span className="text-sm">user@example.com</span>
        </Button>
      </div>
    </div>
  )
}

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onSelect: () => void
  onPin: () => void
  onDelete: () => void
}

function ConversationItem({ conversation, isActive, onSelect, onPin, onDelete }: ConversationItemProps) {
  const [showActions, setShowActions] = useState(false)

  return (
    <div
      className={cn(
        "group relative rounded-lg p-2 cursor-pointer hover:bg-accent transition-colors",
        isActive && "bg-accent"
      )}
      onClick={onSelect}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm truncate flex-1">{conversation.title}</span>
        {conversation.pinned && <Pin className="h-3 w-3 text-muted-foreground" />}
      </div>
      
      {showActions && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              // Show context menu
            }}
          >
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  )
}

