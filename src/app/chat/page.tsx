import { AppShell } from '@/components/layout/app-shell'

export default function ChatPage() {
  // TODO: Fetch conversations from API
  const mockConversations = [
    {
      id: '1',
      title: 'Contract Review Help',
      pinned: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    },
    {
      id: '2', 
      title: 'Employment Law Question',
      pinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    }
  ]

  return <AppShell conversations={mockConversations} showSidebar={true} />
}

