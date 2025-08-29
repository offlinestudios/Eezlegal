const Message = ({ message }) => {
  const isUser = message.sender === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] md:max-w-3xl ${isUser ? 'ml-4 md:ml-12' : 'mr-4 md:mr-12'}`}>
        {!isUser && (
          <div className="flex items-center mb-2">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium mr-2 md:mr-3">
              E
            </div>
            <span className="text-xs md:text-sm font-medium text-gray-900">Eezlegal</span>
          </div>
        )}
        
        <div className={`
          px-3 md:px-4 py-2 md:py-3 rounded-2xl
          ${isUser 
            ? 'bg-gray-900 text-white ml-auto' 
            : 'bg-gray-100 text-gray-900'
          }
        `}>
          <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
        </div>
        
        {isUser && (
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-500">You</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Message

