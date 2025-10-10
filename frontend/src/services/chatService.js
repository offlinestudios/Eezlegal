import backendService from './backendService'

export class ChatService {
  constructor() {
    this.typingDelay = 1500 // Realistic typing delay in milliseconds
    this.messageQueue = []
    this.isProcessing = false
  }

  async sendMessage(message, conversationHistory = [], userContext = {}, onTypingStart, onTypingEnd) {
    return new Promise((resolve) => {
      // Add message to queue
      this.messageQueue.push({
        message,
        conversationHistory,
        userContext,
        onTypingStart,
        onTypingEnd,
        resolve
      })

      // Process queue if not already processing
      if (!this.isProcessing) {
        this.processQueue()
      }
    })
  }

  async processQueue() {
    if (this.messageQueue.length === 0) {
      this.isProcessing = false
      return
    }

    this.isProcessing = true
    const { message, conversationHistory, userContext, onTypingStart, onTypingEnd, resolve } = this.messageQueue.shift()

    try {
      // Start typing indicator
      if (onTypingStart) onTypingStart()

      // Simulate realistic typing delay
      await this.simulateTyping()

      // Try to send message through backend first
      const backendResult = await backendService.sendChatMessage(
        message, 
        conversationHistory, 
        userContext.userId
      )

      let responseMessage
      let isFromAPI = false

      if (backendResult.success) {
        // Backend API success
        responseMessage = this.formatEezLegalResponse(backendResult.message, userContext)
        isFromAPI = true
      } else {
        // Backend failed, use fallback with EezLegal formatting
        responseMessage = this.getEezLegalFallbackResponse(message, userContext)
        isFromAPI = false
      }

      // Stop typing indicator
      if (onTypingEnd) onTypingEnd()

      // Resolve with formatted response
      resolve({
        success: true,
        message: responseMessage,
        usage: backendResult.usage,
        isFromAPI: isFromAPI
      })

    } catch (error) {
      console.error('Chat service error:', error)
      
      // Stop typing indicator
      if (onTypingEnd) onTypingEnd()

      // Resolve with error fallback
      resolve({
        success: false,
        message: this.getDefaultErrorMessage(),
        error: error.message,
        isFromAPI: false
      })
    }

    // Continue processing queue
    setTimeout(() => this.processQueue(), 100)
  }

  async simulateTyping() {
    // Simulate realistic typing with variable delay
    const baseDelay = this.typingDelay
    const variableDelay = Math.random() * 500 // Add 0-500ms random variation
    
    await new Promise(resolve => setTimeout(resolve, baseDelay + variableDelay))
  }

  formatEezLegalResponse(apiResponse, userContext) {
    // If the API response is already in EezLegal format, return as-is
    if (apiResponse.includes('**TL;DR:**') || apiResponse.includes('**What this means:**')) {
      return apiResponse
    }

    // Otherwise, format the API response into EezLegal structure
    const metadata = this.extractMessageMetadata(apiResponse)
    
    return `**TL;DR:**
${this.generateTLDR(apiResponse, metadata)}

**What this means:**
${this.extractMainExplanation(apiResponse)}

**Risks & gotchas:**
${this.extractRisks(apiResponse, metadata)}

**Next steps:**
${this.generateNextSteps(metadata, userContext)}

${userContext.isLoggedIn ? '' : '**Ready to dive deeper?**\nCreate a free account to save your conversations and get unlimited legal assistance.\n\n'}*I'm an AI legal assistant, not a lawyer. This is general info, not legal advice.*`
  }

  getEezLegalFallbackResponse(message, userContext) {
    const metadata = this.extractMessageMetadata(message)
    
    // Generate contextual fallback based on message content
    if (metadata.intent === 'nda_review') {
      return `**TL;DR:**
NDAs protect confidential information between parties. Key elements include scope, duration, and exceptions.

**What this means:**
• Non-disclosure agreements create legal obligations to keep information secret
• They typically cover business plans, customer lists, and proprietary processes
• Violations can result in financial damages and legal action

**Risks & gotchas:**
• Overly broad NDAs may be unenforceable
• Some information (public knowledge, independently developed) isn't protected
• Duration should be reasonable for the type of information

**Next steps:**
1. Review the specific terms and scope of confidentiality
2. Check for reasonable time limits and geographic restrictions
3. Ensure exceptions for public information are included
4. Consider having a lawyer review complex agreements

${userContext.isLoggedIn ? '' : '**Ready to dive deeper?**\nCreate a free account to save your conversations and get unlimited legal assistance.\n\n'}*I'm an AI legal assistant, not a lawyer. This is general info, not legal advice.*`
    } else if (metadata.intent === 'contract_review') {
      return `**TL;DR:**
Contract review involves checking terms, obligations, risks, and enforceability to protect your interests.

**What this means:**
• Contracts create legally binding obligations between parties
• Key areas include payment terms, deliverables, and termination clauses
• Understanding your rights and responsibilities is crucial

**Risks & gotchas:**
• Automatic renewal clauses can trap you in unwanted agreements
• Liability and indemnification terms can expose you to significant risk
• Termination procedures may be complex or costly

**Next steps:**
1. Read all terms carefully, including fine print
2. Negotiate unfavorable terms before signing
3. Understand termination and cancellation procedures
4. Keep detailed records of contract performance

${userContext.isLoggedIn ? '' : '**Ready to dive deeper?**\nCreate a free account to save your conversations and get unlimited legal assistance.\n\n'}*I'm an AI legal assistant, not a lawyer. This is general info, not legal advice.*`
    } else {
      return `**TL;DR:**
I'm here to help with your legal question. Let me provide some general guidance on this topic.

**What this means:**
• Legal issues often have multiple considerations and potential outcomes
• Understanding your rights and obligations is important
• Professional legal advice may be needed for complex situations

**Risks & gotchas:**
• Legal requirements vary by jurisdiction and specific circumstances
• Deadlines and procedural requirements are often strict
• Self-representation has limitations in complex matters

**Next steps:**
1. Gather all relevant documents and information
2. Research applicable laws and regulations
3. Consider consulting with a qualified attorney
4. Document all communications and decisions

${userContext.isLoggedIn ? '' : '**Ready to dive deeper?**\nCreate a free account to save your conversations and get unlimited legal assistance.\n\n'}*I'm an AI legal assistant, not a lawyer. This is general info, not legal advice.*`
    }
  }

  generateTLDR(response, metadata) {
    // Extract or generate a concise summary
    const sentences = response.split('.').filter(s => s.trim().length > 10)
    return sentences.slice(0, 2).join('.') + '.'
  }

  extractMainExplanation(response) {
    // Extract the main explanatory content
    const sentences = response.split('.').filter(s => s.trim().length > 10)
    return sentences.slice(2, 5).map(s => `• ${s.trim()}`).join('\n')
  }

  extractRisks(response, metadata) {
    // Generate risk-based content based on metadata
    const risks = []
    
    if (metadata.riskLevel === 'high') {
      risks.push('Immediate legal action may be required')
      risks.push('Significant financial or legal consequences possible')
    } else if (metadata.riskLevel === 'medium') {
      risks.push('Potential liability or compliance issues')
      risks.push('Professional review recommended')
    } else {
      risks.push('Standard legal considerations apply')
      risks.push('Documentation and record-keeping important')
    }
    
    return risks.map(risk => `• ${risk}`).join('\n')
  }

  generateNextSteps(metadata, userContext) {
    const steps = []
    
    if (metadata.hasDocument) {
      steps.push('Upload your document for detailed analysis')
    }
    
    steps.push('Review all relevant terms and conditions')
    
    if (metadata.riskLevel === 'high') {
      steps.push('Consult with a qualified attorney immediately')
    } else {
      steps.push('Consider professional legal consultation if needed')
    }
    
    if (!userContext.isLoggedIn) {
      steps.push('Create an account to save this conversation')
    }
    
    return steps.map((step, index) => `${index + 1}. ${step}`).join('\n')
  }

  getDefaultErrorMessage() {
    return `**TL;DR:** I encountered a technical issue, but I'm here to help with your legal question.

**What happened:**
• There was a temporary connection issue
• Your message was received, but I couldn't generate a full response
• This doesn't affect your account or conversation history

**Next steps:**
1. Please try asking your question again
2. If the issue persists, try refreshing the page

**Want me to help you get started?**
Create a free account to save your conversations and get priority support.

*I'm an AI legal assistant, not a lawyer. This is general info, not legal advice.*`
  }

  // Format message for display with proper markdown rendering
  formatMessageForDisplay(message) {
    // Split message into lines and format each appropriately
    const lines = message.split('\n')
    const formattedLines = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (!line) {
        formattedLines.push({ type: 'break', content: '' })
        continue
      }

      // Bold headings (lines starting and ending with **)
      if (line.startsWith('**') && line.endsWith('**')) {
        formattedLines.push({
          type: 'heading',
          content: line.slice(2, -2)
        })
      }
      // Bullet points (lines starting with •)
      else if (line.startsWith('• ')) {
        formattedLines.push({
          type: 'bullet',
          content: line.slice(2)
        })
      }
      // Numbered lists (lines starting with number.)
      else if (/^\d+\.\s/.test(line)) {
        formattedLines.push({
          type: 'numbered',
          content: line
        })
      }
      // Italic disclaimers (lines starting and ending with *)
      else if (line.startsWith('*') && line.endsWith('*')) {
        formattedLines.push({
          type: 'disclaimer',
          content: line.slice(1, -1)
        })
      }
      // Regular paragraphs
      else {
        formattedLines.push({
          type: 'paragraph',
          content: line
        })
      }
    }

    return formattedLines
  }

  // Extract key information from message for analytics
  extractMessageMetadata(message) {
    const metadata = {
      intent: 'general',
      hasDocument: false,
      jurisdiction: null,
      documentType: null,
      riskLevel: 'low'
    }

    const lowerMessage = message.toLowerCase()

    // Detect intent
    if (lowerMessage.includes('nda') || lowerMessage.includes('non-disclosure')) {
      metadata.intent = 'nda_review'
      metadata.documentType = 'nda'
    } else if (lowerMessage.includes('contract') || lowerMessage.includes('agreement')) {
      metadata.intent = 'contract_review'
      metadata.documentType = 'contract'
    } else if (lowerMessage.includes('lease') || lowerMessage.includes('rental')) {
      metadata.intent = 'lease_review'
      metadata.documentType = 'lease'
    } else if (lowerMessage.includes('employment') || lowerMessage.includes('job')) {
      metadata.intent = 'employment'
      metadata.documentType = 'employment'
    } else if (lowerMessage.includes('explain') || lowerMessage.includes('what does')) {
      metadata.intent = 'explain'
    } else if (lowerMessage.includes('draft') || lowerMessage.includes('create')) {
      metadata.intent = 'draft'
    }

    // Detect document mentions
    if (lowerMessage.includes('document') || lowerMessage.includes('file') || lowerMessage.includes('pdf')) {
      metadata.hasDocument = true
    }

    // Detect jurisdiction mentions
    const jurisdictions = ['california', 'new york', 'texas', 'florida', 'canada', 'uk', 'australia']
    for (const jurisdiction of jurisdictions) {
      if (lowerMessage.includes(jurisdiction)) {
        metadata.jurisdiction = jurisdiction
        break
      }
    }

    // Detect risk indicators
    const highRiskTerms = ['lawsuit', 'sue', 'legal action', 'court', 'dispute', 'breach']
    const mediumRiskTerms = ['liability', 'indemnity', 'termination', 'penalty', 'damages']
    
    if (highRiskTerms.some(term => lowerMessage.includes(term))) {
      metadata.riskLevel = 'high'
    } else if (mediumRiskTerms.some(term => lowerMessage.includes(term))) {
      metadata.riskLevel = 'medium'
    }

    return metadata
  }

  // Get conversation summary for context
  getConversationSummary(messages) {
    if (messages.length === 0) return null

    const userMessages = messages.filter(m => m.role === 'user')
    const topics = new Set()
    
    userMessages.forEach(msg => {
      const metadata = this.extractMessageMetadata(msg.content)
      if (metadata.documentType) topics.add(metadata.documentType)
      if (metadata.intent !== 'general') topics.add(metadata.intent)
    })

    return {
      messageCount: messages.length,
      userMessageCount: userMessages.length,
      topics: Array.from(topics),
      lastUserMessage: userMessages[userMessages.length - 1]?.content || null
    }
  }
}

export default new ChatService()
