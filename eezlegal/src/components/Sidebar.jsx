import { Button } from '@/components/ui/button'

const Sidebar = ({ isOpen, onToggle, onNewChat, setIsLoggedIn }) => {
  const recentChats = [
    "NDA Review",
    "Job Offer",
    "Lease Agreement", 
    "Service Terms"
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed md:relative left-0 top-0 h-full w-64 bg-gray-50 border-r border-gray-200 z-50 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${!isOpen ? 'md:w-0 md:border-r-0' : ''}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-lg font-medium text-gray-900">
              ezlegal
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={onToggle}
            >
              ✕
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button 
            onClick={onNewChat}
            className="w-full justify-start text-left"
            variant="outline"
          >
            + New Chat
          </Button>
        </div>

        {/* Recent Chats */}
        <div className="flex-1 px-4">
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Recent Chats
          </h3>
          <div className="space-y-2">
            {recentChats.map((chat, index) => (
              <button
                key={index}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                {chat}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLoggedIn(false)}
            className="w-full justify-start text-gray-600"
          >
            Sign out
          </Button>
        </div>
      </div>
    </>
  )
}

export default Sidebar

