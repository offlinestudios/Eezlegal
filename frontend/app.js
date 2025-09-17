document.addEventListener('DOMContentLoaded', function() {
  const messageInput = document.getElementById('messageInput');
  const voiceButton = document.getElementById('voiceButton');
  const chat = document.getElementById('chat');
  const welcomeSection = document.getElementById('welcomeSection');
  const headerTitle = document.getElementById('headerTitle');
  
  let chatHistory = [];
  let isFirstMessage = true;

  // Voice/Send button toggle
  function toggleButtons() {
    const hasText = messageInput.value.trim().length > 0;
    
    if (hasText) {
      voiceButton.innerHTML = '<span>Send</span>';
      voiceButton.className = 'send-button';
    } else {
      voiceButton.innerHTML = '<i class="fas fa-microphone"></i><span>Voice</span>';
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

    // If this is the first message, move title to header
    if (isFirstMessage) {
      welcomeSection.classList.add('hidden');
      headerTitle.classList.remove('hidden');
      isFirstMessage = false;
    }

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
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = content;
    
    messageDiv.appendChild(contentDiv);
    chat.appendChild(messageDiv);
    
    // Scroll to bottom
    messageDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Add to history
    chatHistory.push({ role, content });
  }

  async function sendMessage(message) {
    try {
      const response = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          history: chatHistory.slice(-10) // Send last 10 messages for context
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

  // Initialize button state and focus input
  toggleButtons();
  messageInput.focus();
});

