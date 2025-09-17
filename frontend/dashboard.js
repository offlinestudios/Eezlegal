document.addEventListener('DOMContentLoaded', function() {
  const messageInput = document.getElementById('messageInput');
  const voiceButton = document.getElementById('voiceButton');
  const chatMessages = document.getElementById('chatMessages');
  
  let isFirstMessage = !chatMessages || chatMessages.children.length === 0;

  // Voice/Send button toggle
  function toggleButtons() {
    const hasText = messageInput.value.trim().length > 0;
    
    if (hasText) {
      voiceButton.innerHTML = '<span>Send</span>';
      voiceButton.className = 'voice-button send-button';
    } else {
      voiceButton.innerHTML = '<span>🎙</span><span>Voice</span>';
      voiceButton.className = 'voice-button';
    }
  }

  // Auto-resize textarea
  function autoResize() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
  }

  messageInput.addEventListener('input', function() {
    autoResize();
    toggleButtons();
  });
  
  messageInput.addEventListener('keyup', toggleButtons);
  
  messageInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  });

  // Voice/Send button click
  voiceButton.addEventListener('click', function() {
    const hasText = messageInput.value.trim().length > 0;
    
    if (hasText) {
      // Send message
      handleSubmit();
    } else {
      // Voice functionality placeholder
      console.log('Voice recording would start here');
      messageInput.focus();
    }
  });

  function handleSubmit() {
    const message = messageInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    
    // Clear input and reset buttons
    messageInput.value = '';
    autoResize();
    toggleButtons();
    
    // Disable button
    voiceButton.disabled = true;
    voiceButton.innerHTML = '<span>Sending...</span>';

    // Send to backend
    sendMessage(message);
  }

  function addMessage(content, role) {
    // If this is the first message and we're in welcome state, create chat container
    if (isFirstMessage && !chatMessages) {
      const welcomeSection = document.querySelector('.welcome-section');
      if (welcomeSection) {
        welcomeSection.style.display = 'none';
        
        // Create chat messages container
        const newChatMessages = document.createElement('div');
        newChatMessages.className = 'chat-messages';
        newChatMessages.id = 'chatMessages';
        
        const chatContainer = document.querySelector('.chat-container');
        const composerSection = document.querySelector('.composer-section');
        chatContainer.insertBefore(newChatMessages, composerSection);
        
        // Update reference
        chatMessages = newChatMessages;
      }
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(contentDiv);
    
    if (chatMessages) {
      chatMessages.appendChild(messageDiv);
      // Scroll to bottom
      messageDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    isFirstMessage = false;
  }

  async function sendMessage(message) {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message
        }),
      });

      const data = await response.json();
      
      if (data.success && data.message) {
        addMessage(data.message, 'assistant');
      } else {
        addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
      }
    } catch (error) {
      console.error('Error:', error);
      addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
    } finally {
      // Re-enable button
      voiceButton.disabled = false;
      toggleButtons();
      messageInput.focus();
    }
  }

  // Suggestion chips
  const suggestionChips = document.querySelectorAll('.suggestion-chip');
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', function() {
      const text = this.textContent;
      messageInput.value = text;
      autoResize();
      toggleButtons();
      messageInput.focus();
    });
  });

  // New chat button
  const newChatBtn = document.querySelector('.new-chat-btn');
  if (newChatBtn) {
    newChatBtn.addEventListener('click', function() {
      // Redirect to dashboard without chat ID
      window.location.href = '/dashboard';
    });
  }

  // Initialize button state and focus input
  toggleButtons();
  messageInput.focus();
});

